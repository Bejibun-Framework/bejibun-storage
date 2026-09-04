import type { Stats } from "fs";
import type { StorageDisk, StorageOptions } from "../types/storage";
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
    constructor();
    /**
     * Get the storage configuration, throwing if it is empty.
     *
     * @returns {Record<string, any>} The storage configuration.
     * @throws {StorageException} When no configuration is provided.
     */
    private get config();
    /**
     * Get the configuration for the current disk.
     *
     * @returns {any} The current disk configuration.
     */
    private get currentDisk();
    /**
     * Resolve the driver instance for the current disk.
     *
     * @returns {StorageDriver} The resolved storage driver.
     * @throws {StorageException} When the driver is missing or unsupported.
     */
    private get driver();
    /**
     * Override the disk used for subsequent operations.
     *
     * @param {StorageDisk} overrideDisk - The disk configuration to use.
     * @returns {StorageBuilder} This builder instance.
     */
    build(overrideDisk: StorageDisk): StorageBuilder;
    /**
     * Select the disk by name for subsequent operations.
     *
     * @param {string} drive - The name of the disk to use.
     * @returns {StorageBuilder} This builder instance.
     */
    disk(drive: string): StorageBuilder;
    /**
     * Determine whether a file exists.
     *
     * @param {string} filepath - The path to the file.
     * @returns {Promise<boolean>} True if the file exists; otherwise false.
     * @throws {StorageException} When the file path is empty.
     */
    exists(filepath: string): Promise<boolean>;
    /**
     * Determine whether a file is missing.
     *
     * @param {string} filepath - The path to the file.
     * @returns {Promise<boolean>} True if the file does not exist; otherwise false.
     * @throws {StorageException} When the file path is empty.
     */
    missing(filepath: string): Promise<boolean>;
    /**
     * Retrieve metadata for a file.
     *
     * @param {string} filepath - The path to the file.
     * @returns {Promise<Stats | Bun.S3Stats>} File metadata and statistics.
     * @throws {StorageException} When the file path is empty.
     */
    metadata(filepath: string): Promise<Stats | Bun.S3Stats>;
    /**
     * Get the file size in bytes.
     *
     * @param {string} filepath - The path to the file.
     * @returns {Promise<number>} The file size in bytes.
     * @throws {StorageException} When the file path is empty.
     */
    size(filepath: string): Promise<number>;
    /**
     * Get the file MIME type.
     *
     * @param {string} filepath - The path to the file.
     * @returns {Promise<string>} The detected MIME type.
     * @throws {StorageException} When the file path is empty.
     */
    mimeType(filepath: string): Promise<string>;
    /**
     * Get the file's last modification date.
     *
     * @param {string} filepath - The path to the file.
     * @returns {Promise<Date>} The last modified timestamp.
     * @throws {StorageException} When the file path is empty.
     */
    lastModified(filepath: string): Promise<Date>;
    /**
     * Retrieve a file from storage.
     *
     * @param {string} filepath - The path to the file.
     * @returns {Promise<Bun.BunFile | Bun.S3File>} The storage file instance.
     * @throws {StorageException} When the file path is empty.
     */
    get(filepath: string): Promise<Bun.BunFile | Bun.S3File>;
    /**
     * Store content at the given path.
     *
     * @param {string} filepath - The destination file path.
     * @param {any} content - The content to store.
     * @param {StorageOptions} options - Additional storage options.
     * @throws {StorageException} When the file path or content is empty.
     */
    put(filepath: string, content: any, options?: StorageOptions): Promise<void>;
    /**
     * Copy a file to a new location.
     *
     * @param {string} source - The source file path.
     * @param {string} destination - The destination file path.
     * @param {StorageOptions} options - Additional storage options.
     * @throws {StorageException} When the source or destination path is empty.
     */
    copy(source: string, destination: string, options?: StorageOptions): Promise<void>;
    /**
     * Move a file to a new location.
     *
     * @param {string} source - The source file path.
     * @param {string} destination - The destination file path.
     * @param {StorageOptions} options - Additional storage options.
     * @throws {StorageException} When the source or destination path is empty.
     */
    move(source: string, destination: string, options?: StorageOptions): Promise<void>;
    /**
     * Delete a file from storage.
     *
     * @param {string} filepath - The path to the file.
     * @throws {StorageException} When the file path is empty.
     */
    delete(filepath: string): Promise<void>;
}
