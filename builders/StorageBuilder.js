import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import { defineValue, isEmpty } from "@bejibun/utils";
import Enum from "@bejibun/utils/facades/Enum";
import fs from "fs";
import StorageLocalBuilder from "../builders/storage/StorageLocalBuilder";
import StorageS3Builder from "../builders/storage/StorageS3Builder";
import StorageConfig from "../config/storage";
import StorageDiskDriverEnum from "../enums/StorageDiskDriverEnum";
import StorageException from "../exceptions/StorageException";
export default class StorageBuilder {
    conf;
    overrideDisk;
    drive;
    constructor() {
        const configPath = App.Path.configPath("storage.ts");
        let config;
        if (fs.existsSync(configPath))
            config = require(configPath).default;
        else
            config = StorageConfig;
        this.conf = config;
    }
    get config() {
        if (isEmpty(this.conf))
            throw new StorageException("There is no config provided.");
        return this.conf;
    }
    get currentDisk() {
        return defineValue(this.overrideDisk, this.config.disks[defineValue(this.drive, this.config.default)]);
    }
    get driver() {
        const driver = defineValue(this.currentDisk?.driver);
        if (isEmpty(driver))
            throw new StorageException(`Missing "driver" on disk config.`);
        if (!Enum.setEnums(StorageDiskDriverEnum).hasValue(driver))
            throw new StorageException(`Not supported "driver" disk.`);
        switch (driver) {
            case StorageDiskDriverEnum.Local:
                return new StorageLocalBuilder(this.currentDisk);
            case StorageDiskDriverEnum.S3:
                return new StorageS3Builder(this.currentDisk);
            default:
                throw new StorageException(`Not supported "driver" disk.`);
        }
    }
    build(overrideDisk) {
        this.overrideDisk = overrideDisk;
        return this;
    }
    disk(drive) {
        this.drive = drive;
        return this;
    }
    async exists(filepath) {
        if (isEmpty(filepath))
            throw new StorageException("The file path is required.");
        return await this.driver.exists(filepath);
    }
    async missing(filepath) {
        if (isEmpty(filepath))
            throw new StorageException("The file path is required.");
        return !(await this.driver.missing(filepath));
    }
    async metadata(filepath) {
        if (isEmpty(filepath))
            throw new StorageException("The file path is required.");
        return await this.driver.metadata(filepath);
    }
    async size(filepath) {
        if (isEmpty(filepath))
            throw new StorageException("The file path is required.");
        return await this.driver.size(filepath);
    }
    async mimeType(filepath) {
        if (isEmpty(filepath))
            throw new StorageException("The file path is required.");
        return await this.driver.mimeType(filepath);
    }
    async lastModified(filepath) {
        if (isEmpty(filepath))
            throw new StorageException("The file path is required.");
        return await this.driver.lastModified(filepath);
    }
    async get(filepath) {
        if (isEmpty(filepath))
            throw new StorageException("The file path is required.");
        return await this.driver.get(filepath);
    }
    async put(filepath, content, options) {
        if (isEmpty(filepath))
            throw new StorageException("The file path is required.");
        if (isEmpty(content))
            throw new StorageException("The content is required.");
        try {
            await this.driver.put(filepath, content, options);
        }
        catch (error) {
            Logger.setContext("Storage")
                .error("Something went wrong when saving file.")
                .trace(error);
        }
    }
    async copy(source, destination, options) {
        if (isEmpty(source))
            throw new StorageException("The source file path is required.");
        if (isEmpty(destination))
            throw new StorageException("The destination file path is required.");
        try {
            await this.driver.copy(source, destination, options);
        }
        catch (error) {
            Logger.setContext("Storage")
                .error("Something went wrong when copying file.")
                .trace(error);
        }
    }
    async move(source, destination, options) {
        if (isEmpty(source))
            throw new StorageException("The source file path is required.");
        if (isEmpty(destination))
            throw new StorageException("The destination file path is required.");
        try {
            await this.driver.move(source, destination, options);
        }
        catch (error) {
            Logger.setContext("Storage")
                .error("Something went wrong when moving file.")
                .trace(error);
        }
    }
    async delete(filepath) {
        if (isEmpty(filepath))
            throw new StorageException("The file path is required.");
        await this.driver.delete(filepath);
    }
}
