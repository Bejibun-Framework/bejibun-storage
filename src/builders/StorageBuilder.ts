import type {Stats} from "fs";
import type {StorageDisk, StorageDriver, StorageOptions} from "@/types/storage";
import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import {defineValue, isEmpty} from "@bejibun/utils";
import Enum from "@bejibun/utils/facades/Enum";
import fs from "fs";
import StorageLocalBuilder from "@/builders/storage/StorageLocalBuilder";
import StorageS3Builder from "@/builders/storage/StorageS3Builder";
import StorageConfig from "@/config/storage";
import StorageDiskDriverEnum from "@/enums/StorageDiskDriverEnum";
import StorageException from "@/exceptions/StorageException";

export default class StorageBuilder {
    protected conf: Record<string, any>;
    protected overrideDisk?: StorageDisk;
    protected drive?: string;

    public constructor() {
        const configPath: string = App.Path.configPath("storage.ts");

        let config: any;

        if (fs.existsSync(configPath)) config = require(configPath).default;
        else config = StorageConfig;

        this.conf = config;
    }

    private get config(): Record<string, any> {
        if (isEmpty(this.conf)) throw new StorageException("There is no config provided.");

        return this.conf;
    }

    private get currentDisk(): any {
        return defineValue(this.overrideDisk, this.config.disks[defineValue(this.drive, this.config.default)]);
    }

    private get driver(): StorageDriver {
        const driver: string | null = defineValue(this.currentDisk?.driver);

        if (isEmpty(driver)) throw new StorageException(`Missing "driver" on disk config.`);

        if (!Enum.setEnums(StorageDiskDriverEnum).hasValue(driver)) throw new StorageException(`Not supported "driver" disk.`);

        switch (driver) {
            case StorageDiskDriverEnum.Local:
                return new StorageLocalBuilder(this.currentDisk);
            case StorageDiskDriverEnum.S3:
                return new StorageS3Builder(this.currentDisk);
            default:
                throw new StorageException(`Not supported "driver" disk.`);
        }
    }

    public build(overrideDisk: StorageDisk): StorageBuilder {
        this.overrideDisk = overrideDisk;

        return this;
    }

    public disk(drive: string): StorageBuilder {
        this.drive = drive;

        return this;
    }

    public async exists(filepath: string): Promise<boolean> {
        if (isEmpty(filepath)) throw new StorageException("The file path is required.");

        return await this.driver.exists(filepath);
    }

    public async missing(filepath: string): Promise<boolean> {
        if (isEmpty(filepath)) throw new StorageException("The file path is required.");

        return !await this.driver.missing(filepath);
    }

    public async metadata(filepath: string): Promise<Stats | Bun.S3Stats> {
        if (isEmpty(filepath)) throw new StorageException("The file path is required.");

        return await this.driver.metadata(filepath);
    }

    public async size(filepath: string): Promise<number> {
        if (isEmpty(filepath)) throw new StorageException("The file path is required.");

        return await this.driver.size(filepath);
    }

    public async mimeType(filepath: string): Promise<string> {
        if (isEmpty(filepath)) throw new StorageException("The file path is required.");

        return await this.driver.mimeType(filepath);
    }

    public async lastModified(filepath: string): Promise<Date> {
        if (isEmpty(filepath)) throw new StorageException("The file path is required.");

        return await this.driver.lastModified(filepath);
    }

    public async get(filepath: string): Promise<Bun.BunFile | Bun.S3File> {
        if (isEmpty(filepath)) throw new StorageException("The file path is required.");

        return await this.driver.get(filepath);
    }

    public async put(filepath: string, content: any, options?: StorageOptions): Promise<void> {
        if (isEmpty(filepath)) throw new StorageException("The file path is required.");
        if (isEmpty(content)) throw new StorageException("The content is required.");

        try {
            await this.driver.put(filepath, content, options);
        } catch (error: any) {
            Logger.setContext("Storage").error("Something went wrong when saving file.").trace(error);
        }
    }

    public async copy(source: string, destination: string, options?: StorageOptions): Promise<void> {
        if (isEmpty(source)) throw new StorageException("The source file path is required.");
        if (isEmpty(destination)) throw new StorageException("The destination file path is required.");

        try {
            await this.driver.copy(source, destination, options);
        } catch (error: any) {
            Logger.setContext("Storage").error("Something went wrong when copying file.").trace(error);
        }
    }

    public async move(source: string, destination: string, options?: StorageOptions): Promise<void> {
        if (isEmpty(source)) throw new StorageException("The source file path is required.");
        if (isEmpty(destination)) throw new StorageException("The destination file path is required.");

        try {
            await this.driver.move(source, destination, options);
        } catch (error: any) {
            Logger.setContext("Storage").error("Something went wrong when moving file.").trace(error);
        }
    }

    public async delete(filepath: string): Promise<void> {
        if (isEmpty(filepath)) throw new StorageException("The file path is required.");

        await this.driver.delete(filepath);
    }
}