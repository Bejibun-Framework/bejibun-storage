import type {Stats} from "fs";
import type {StorageDriver, StorageOptions} from "@/types/storage";
import Logger from "@bejibun/logger";
import {resolve} from "path";
import StorageException from "@/exceptions/StorageException";

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
    public constructor(config: Record<string, any>) {
        this._config = config;
    }

    private get config(): Record<string, any> {
        if (!this._config.root)
            throw new StorageException(`Missing "root" for "local" disk configuration.`);

        return this._config;
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

        return await Bun.file(resolve(this.config.root, filepath)).exists();
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

        return !(await this.exists(filepath));
    }

    /**
     * Retrieve metadata for a file.
     *
     * @param {string} filepath - The path to the file.
     * @returns {Promise<Stats>} File metadata and statistics.
     * @throws {StorageException} When the file path is empty.
     */
    public async metadata(filepath: string): Promise<Stats> {
        if (!filepath) throw new StorageException("The file path is required.");

        return await (await this.get(filepath)).stat();
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

        return (await this.metadata(filepath)).size;
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

        return (await this.get(filepath)).type;
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

        return (await this.metadata(filepath)).mtime;
    }

    /**
     * Retrieve a file from storage.
     *
     * @param {string} filepath - The path to the file.
     * @returns {Promise<Bun.BunFile>} The local file instance.
     * @throws {StorageException} When the file path is empty.
     */
    public async get(filepath: string): Promise<Bun.BunFile> {
        if (!filepath) throw new StorageException("The file path is required.");

        return Bun.file(resolve(this.config.root, filepath));
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
            await Bun.write(resolve(this.config.root, filepath), content, options);
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
            await this.put(destination, await this.get(source), options);
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
            await this.copy(source, destination, options);

            await this.delete(source);
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

        await Bun.file(resolve(this.config.root, filepath)).delete();
    }
}
