import type { Stats } from "fs";
import type { StorageDisk, StorageOptions } from "../types/storage";
import StorageBuilder from "../builders/StorageBuilder";
/**
 * Static facade for performing storage operations via the default builder.
 */
export default class Storage {
    /**
     * Build a storage builder with the given disk override.
     *
     * @param {StorageDisk} disk - The disk configuration to use.
     * @returns {StorageBuilder} A storage builder bound to the disk.
     */
    static build(disk: StorageDisk): StorageBuilder;
    /**
     * Select a disk by name and return a storage builder.
     *
     * @param {string} disk - The name of the disk to use.
     * @returns {StorageBuilder} A storage builder bound to the disk name.
     */
    static disk(disk: string): StorageBuilder;
    /**
     * Determine whether a file exists.
     *
     * @param {string} path - The path to the file.
     * @returns {Promise<boolean>} Whether the file exists.
     */
    static exists(path: string): Promise<boolean>;
    /**
     * Determine whether a file is missing.
     *
     * @param {string} path - The path to the file.
     * @returns {Promise<boolean>} Whether the file does not exist.
     */
    static missing(path: string): Promise<boolean>;
    /**
     * Retrieve metadata for a file.
     *
     * @param {string} path - The path to the file.
     * @returns {Promise<Stats | Bun.S3Stats>} File metadata and statistics.
     */
    static metadata(path: string): Promise<Stats | Bun.S3Stats>;
    /**
     * Get the file size in bytes.
     *
     * @param {string} path - The path to the file.
     * @returns {Promise<number>} The file size in bytes.
     */
    static size(path: string): Promise<number>;
    /**
     * Get the file MIME type.
     *
     * @param {string} path - The path to the file.
     * @returns {Promise<string>} The detected MIME type.
     */
    static mimeType(path: string): Promise<string>;
    /**
     * Get the file's last modification date.
     *
     * @param {string} path - The path to the file.
     * @returns {Promise<Date>} The last modified timestamp.
     */
    static lastModified(path: string): Promise<Date>;
    /**
     * Retrieve a file from storage.
     *
     * @param {string} path - The path to the file.
     * @returns {Promise<Bun.BunFile | Bun.S3File>} The storage file instance.
     */
    static get(path: string): Promise<Bun.BunFile | Bun.S3File>;
    /**
     * Store content at the given path.
     *
     * @param {string} path - The destination file path.
     * @param {any} content - The content to store.
     * @param {StorageOptions} options - Additional storage options.
     * @returns {Promise<void>} A promise resolving once the file is stored.
     */
    static put(path: string, content: any, options?: StorageOptions): Promise<void>;
    /**
     * Copy a file to a new location.
     *
     * @param {string} source - The source file path.
     * @param {string} destination - The destination file path.
     * @param {StorageOptions} options - Additional storage options.
     * @returns {Promise<void>} A promise resolving once the file is copied.
     */
    static copy(source: string, destination: string, options?: StorageOptions): Promise<void>;
    /**
     * Move a file to a new location.
     *
     * @param {string} source - The source file path.
     * @param {string} destination - The destination file path.
     * @param {StorageOptions} options - Additional storage options.
     * @returns {Promise<void>} A promise resolving once the file is moved.
     */
    static move(source: string, destination: string, options?: StorageOptions): Promise<void>;
    /**
     * Delete a file from storage.
     *
     * @param {string} path - The path to the file.
     * @returns {Promise<void>} A promise resolving once the file is deleted.
     */
    static delete(path: string): Promise<any>;
}
