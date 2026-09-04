import type {Stats} from "fs";
import type {StorageDisk, StorageOptions} from "@/types/storage";
import StorageBuilder from "@/builders/StorageBuilder";

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
    public static build(disk: StorageDisk): StorageBuilder {
        return new StorageBuilder().build(disk);
    }

    /**
     * Select a disk by name and return a storage builder.
     *
     * @param {string} disk - The name of the disk to use.
     * @returns {StorageBuilder} A storage builder bound to the disk name.
     */
    public static disk(disk: string): StorageBuilder {
        return new StorageBuilder().disk(disk);
    }

    /**
     * Determine whether a file exists.
     *
     * @param {string} path - The path to the file.
     * @returns {Promise<boolean>} Whether the file exists.
     */
    public static async exists(path: string): Promise<boolean> {
        return await new StorageBuilder().exists(path);
    }

    /**
     * Determine whether a file is missing.
     *
     * @param {string} path - The path to the file.
     * @returns {Promise<boolean>} Whether the file does not exist.
     */
    public static async missing(path: string): Promise<boolean> {
        return await new StorageBuilder().missing(path);
    }

    /**
     * Retrieve metadata for a file.
     *
     * @param {string} path - The path to the file.
     * @returns {Promise<Stats | Bun.S3Stats>} File metadata and statistics.
     */
    public static async metadata(path: string): Promise<Stats | Bun.S3Stats> {
        return await new StorageBuilder().metadata(path);
    }

    /**
     * Get the file size in bytes.
     *
     * @param {string} path - The path to the file.
     * @returns {Promise<number>} The file size in bytes.
     */
    public static async size(path: string): Promise<number> {
        return await new StorageBuilder().size(path);
    }

    /**
     * Get the file MIME type.
     *
     * @param {string} path - The path to the file.
     * @returns {Promise<string>} The detected MIME type.
     */
    public static async mimeType(path: string): Promise<string> {
        return await new StorageBuilder().mimeType(path);
    }

    /**
     * Get the file's last modification date.
     *
     * @param {string} path - The path to the file.
     * @returns {Promise<Date>} The last modified timestamp.
     */
    public static async lastModified(path: string): Promise<Date> {
        return await new StorageBuilder().lastModified(path);
    }

    /**
     * Retrieve a file from storage.
     *
     * @param {string} path - The path to the file.
     * @returns {Promise<Bun.BunFile | Bun.S3File>} The storage file instance.
     */
    public static async get(path: string): Promise<Bun.BunFile | Bun.S3File> {
        return await new StorageBuilder().get(path);
    }

    /**
     * Store content at the given path.
     *
     * @param {string} path - The destination file path.
     * @param {any} content - The content to store.
     * @param {StorageOptions} options - Additional storage options.
     * @returns {Promise<void>} A promise resolving once the file is stored.
     */
    public static async put(path: string, content: any, options?: StorageOptions): Promise<void> {
        return await new StorageBuilder().put(path, content, options);
    }

    /**
     * Copy a file to a new location.
     *
     * @param {string} source - The source file path.
     * @param {string} destination - The destination file path.
     * @param {StorageOptions} options - Additional storage options.
     * @returns {Promise<void>} A promise resolving once the file is copied.
     */
    public static async copy(
        source: string,
        destination: string,
        options?: StorageOptions
    ): Promise<void> {
        return await new StorageBuilder().copy(source, destination, options);
    }

    /**
     * Move a file to a new location.
     *
     * @param {string} source - The source file path.
     * @param {string} destination - The destination file path.
     * @param {StorageOptions} options - Additional storage options.
     * @returns {Promise<void>} A promise resolving once the file is moved.
     */
    public static async move(
        source: string,
        destination: string,
        options?: StorageOptions
    ): Promise<void> {
        return await new StorageBuilder().move(source, destination, options);
    }

    /**
     * Delete a file from storage.
     *
     * @param {string} path - The path to the file.
     * @returns {Promise<void>} A promise resolving once the file is deleted.
     */
    public static async delete(path: string): Promise<any> {
        return await new StorageBuilder().delete(path);
    }
}
