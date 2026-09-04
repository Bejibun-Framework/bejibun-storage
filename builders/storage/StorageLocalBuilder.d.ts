import type { Stats } from "fs";
import type { StorageDriver, StorageOptions } from "../../types/storage";
/**
 * Local filesystem storage driver backed by Bun file utilities.
 */
export default class StorageLocalBuilder implements StorageDriver {
    /** The Local disk configuration. */
    protected _config: Record<string, any>;
    /**
     * Create a local storage driver from disk configuration.
     *
     * @param {Record<string, any>} config - The local disk configuration.
     * @throws {StorageException} When the root path is missing.
     */
    constructor(config: Record<string, any>);
    private get config();
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
     * @returns {Promise<Stats>} File metadata and statistics.
     * @throws {StorageException} When the file path is empty.
     */
    metadata(filepath: string): Promise<Stats>;
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
     * @returns {Promise<Bun.BunFile>} The local file instance.
     * @throws {StorageException} When the file path is empty.
     */
    get(filepath: string): Promise<Bun.BunFile>;
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
