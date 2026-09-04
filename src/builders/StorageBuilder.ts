import type {Stats} from "fs";
import type {StorageDisk, StorageDriver, StorageOptions} from "@/types/storage";
import App from "@bejibun/app";
import Logger from "@bejibun/logger";
import {defineValue} from "@bejibun/utils";
import Enum from "@bejibun/utils/facades/Enum";
import StorageLocalBuilder from "@/builders/storage/StorageLocalBuilder";
import StorageS3Builder from "@/builders/storage/StorageS3Builder";
import StorageDiskDriverEnum from "@/enums/StorageDiskDriverEnum";
import StorageException from "@/exceptions/StorageException";

/** The app storage config, loaded once from disk. */
let cachedConfig: any;

/**
 * Loads the app storage config from disk once, falling back to the built-in default.
 *
 * @returns {any} The loaded storage configuration.
 */
const loadConfig = (): any => {
    if (cachedConfig) return cachedConfig;

    try {
        cachedConfig = require(App.Path.configPath("storage.ts")).default;
    } catch {
        cachedConfig = require("@/config/storage").default;
    }

    return cachedConfig;
};

/**
 * Builds and dispatches storage operations to the configured disk driver.
 */
export default class StorageBuilder {
    /** The loaded storage configuration. */
    protected conf: Record<string, any>;

    /** An optional disk override applied when building a driver. */
    protected overrideDisk?: StorageDisk;

    /** The name of the selected disk. */
    protected drive?: string;

    /**
     * Load the storage configuration from the app config or the built-in default.
     */
    public constructor() {
        this.conf = loadConfig();
    }

    /**
     * Get the storage configuration, throwing if it is empty.
     *
     * @returns {Record<string, any>} The storage configuration.
     * @throws {StorageException} When no configuration is provided.
     */
    private get config(): Record<string, any> {
        if (!this.conf) throw new StorageException("There is no config provided.");

        return this.conf;
    }

    /**
     * Get the configuration for the current disk.
     *
     * @returns {any} The current disk configuration.
     */
    private get currentDisk(): any {
        return defineValue(
            this.overrideDisk,
            this.config.disks[defineValue(this.drive, this.config.default)]
        );
    }

    /**
     * Resolve the driver instance for the current disk.
     *
     * @returns {StorageDriver} The resolved storage driver.
     * @throws {StorageException} When the driver is missing or unsupported.
     */
    private get driver(): StorageDriver {
        const driver: string | null = defineValue(this.currentDisk?.driver);

        if (!driver) throw new StorageException(`Missing "driver" on disk config.`);

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

    /**
     * Override the disk used for subsequent operations.
     *
     * @param {StorageDisk} overrideDisk - The disk configuration to use.
     * @returns {StorageBuilder} This builder instance.
     */
    public build(overrideDisk: StorageDisk): StorageBuilder {
        this.overrideDisk = overrideDisk;

        return this;
    }

    /**
     * Select the disk by name for subsequent operations.
     *
     * @param {string} drive - The name of the disk to use.
     * @returns {StorageBuilder} This builder instance.
     */
    public disk(drive: string): StorageBuilder {
        this.drive = drive;

        return this;
    }

    /**
     * Determine whether a file exists.
     *
     * @param {string} filepath - The path to the file.
     * @returns {Promise<boolean>} True if the file exists; otherwise false.
     * @throws {StorageException} When the file path is empty.
     */
    public async exists(filepath: string): Promise<boolean> {
        if (!filepath) throw new StorageException("The file path is required.");

        return await this.driver.exists(filepath);
    }

    /**
     * Determine whether a file is missing.
     *
     * @param {string} filepath - The path to the file.
     * @returns {Promise<boolean>} True if the file does not exist; otherwise false.
     * @throws {StorageException} When the file path is empty.
     */
    public async missing(filepath: string): Promise<boolean> {
        if (!filepath) throw new StorageException("The file path is required.");

        return await this.driver.missing(filepath);
    }

    /**
     * Retrieve metadata for a file.
     *
     * @param {string} filepath - The path to the file.
     * @returns {Promise<Stats | Bun.S3Stats>} File metadata and statistics.
     * @throws {StorageException} When the file path is empty.
     */
    public async metadata(filepath: string): Promise<Stats | Bun.S3Stats> {
        if (!filepath) throw new StorageException("The file path is required.");

        return await this.driver.metadata(filepath);
    }

    /**
     * Get the file size in bytes.
     *
     * @param {string} filepath - The path to the file.
     * @returns {Promise<number>} The file size in bytes.
     * @throws {StorageException} When the file path is empty.
     */
    public async size(filepath: string): Promise<number> {
        if (!filepath) throw new StorageException("The file path is required.");

        return await this.driver.size(filepath);
    }

    /**
     * Get the file MIME type.
     *
     * @param {string} filepath - The path to the file.
     * @returns {Promise<string>} The detected MIME type.
     * @throws {StorageException} When the file path is empty.
     */
    public async mimeType(filepath: string): Promise<string> {
        if (!filepath) throw new StorageException("The file path is required.");

        return await this.driver.mimeType(filepath);
    }

    /**
     * Get the file's last modification date.
     *
     * @param {string} filepath - The path to the file.
     * @returns {Promise<Date>} The last modified timestamp.
     * @throws {StorageException} When the file path is empty.
     */
    public async lastModified(filepath: string): Promise<Date> {
        if (!filepath) throw new StorageException("The file path is required.");

        return await this.driver.lastModified(filepath);
    }

    /**
     * Retrieve a file from storage.
     *
     * @param {string} filepath - The path to the file.
     * @returns {Promise<Bun.BunFile | Bun.S3File>} The storage file instance.
     * @throws {StorageException} When the file path is empty.
     */
    public async get(filepath: string): Promise<Bun.BunFile | Bun.S3File> {
        if (!filepath) throw new StorageException("The file path is required.");

        return await this.driver.get(filepath);
    }

    /**
     * Store content at the given path.
     *
     * @param {string} filepath - The destination file path.
     * @param {any} content - The content to store.
     * @param {StorageOptions} options - Additional storage options.
     * @throws {StorageException} When the file path or content is empty.
     */
    public async put(filepath: string, content: any, options?: StorageOptions): Promise<void> {
        if (!filepath) throw new StorageException("The file path is required.");
        if (!content) throw new StorageException("The content is required.");

        try {
            await this.driver.put(filepath, content, options);
        } catch (error: any) {
            Logger.setContext("Storage")
                .error("Something went wrong when saving file.")
                .trace(error);
        }
    }

    /**
     * Copy a file to a new location.
     *
     * @param {string} source - The source file path.
     * @param {string} destination - The destination file path.
     * @param {StorageOptions} options - Additional storage options.
     * @throws {StorageException} When the source or destination path is empty.
     */
    public async copy(
        source: string,
        destination: string,
        options?: StorageOptions
    ): Promise<void> {
        if (!source) throw new StorageException("The source file path is required.");
        if (!destination) throw new StorageException("The destination file path is required.");

        try {
            await this.driver.copy(source, destination, options);
        } catch (error: any) {
            Logger.setContext("Storage")
                .error("Something went wrong when copying file.")
                .trace(error);
        }
    }

    /**
     * Move a file to a new location.
     *
     * @param {string} source - The source file path.
     * @param {string} destination - The destination file path.
     * @param {StorageOptions} options - Additional storage options.
     * @throws {StorageException} When the source or destination path is empty.
     */
    public async move(
        source: string,
        destination: string,
        options?: StorageOptions
    ): Promise<void> {
        if (!source) throw new StorageException("The source file path is required.");
        if (!destination) throw new StorageException("The destination file path is required.");

        try {
            await this.driver.move(source, destination, options);
        } catch (error: any) {
            Logger.setContext("Storage")
                .error("Something went wrong when moving file.")
                .trace(error);
        }
    }

    /**
     * Delete a file from storage.
     *
     * @param {string} filepath - The path to the file.
     * @throws {StorageException} When the file path is empty.
     */
    public async delete(filepath: string): Promise<void> {
        if (!filepath) throw new StorageException("The file path is required.");

        await this.driver.delete(filepath);
    }
}
