import Logger from "@bejibun/logger";
import StorageException from "../../exceptions/StorageException";
/**
 * S3-compatible storage driver backed by a Bun S3 client.
 */
export default class StorageS3Builder {
    /** The S3 disk configuration. */
    _config;
    /** The underlying S3 client. */
    client;
    /**
     * Create an S3 storage driver from disk configuration.
     *
     * @param {Record<string, any>} config - The S3 disk configuration.
     * @throws {StorageException} When the endpoint, access key id, or secret access key is missing.
     */
    constructor(config) {
        this._config = config;
        this.client = new Bun.S3Client({
            endpoint: this.config.endpoint,
            region: this.config.region,
            bucket: this.config.bucket,
            accessKeyId: this.config.access_key_id,
            secretAccessKey: this.config.secret_access_key
        });
    }
    get config() {
        if (!this._config.endpoint)
            throw new StorageException(`Missing "endpoint" for "s3" disk configuration.`);
        if (!this._config.access_key_id)
            throw new StorageException(`Missing "access_key_id" for "s3" disk configuration.`);
        if (!this._config.secret_access_key)
            throw new StorageException(`Missing "secret_access_key" for "s3" disk configuration.`);
        return this._config;
    }
    /**
     * Determine whether a file exists.
     *
     * @param {string} filepath - The path to the file.
     * @returns {Promise<boolean>} True if the file exists; otherwise false.
     * @throws {StorageException} When the file path is empty.
     */
    async exists(filepath) {
        if (!filepath)
            throw new StorageException("The file path is required.");
        return await this.client.file(filepath).exists();
    }
    /**
     * Determine whether a file is missing.
     *
     * @param {string} filepath - The path to the file.
     * @returns {Promise<boolean>} True if the file does not exist; otherwise false.
     * @throws {StorageException} When the file path is empty.
     */
    async missing(filepath) {
        if (!filepath)
            throw new StorageException("The file path is required.");
        return !(await this.exists(filepath));
    }
    /**
     * Retrieve metadata for a file.
     *
     * @param {string} filepath - The path to the file.
     * @returns {Promise<Bun.S3Stats>} File metadata and statistics.
     * @throws {StorageException} When the file path is empty.
     */
    async metadata(filepath) {
        if (!filepath)
            throw new StorageException("The file path is required.");
        return await (await this.get(filepath)).stat();
    }
    /**
     * Get the file size in bytes.
     *
     * @param {string} filepath - The path to the file.
     * @returns {Promise<number>} The file size in bytes.
     * @throws {StorageException} When the file path is empty.
     */
    async size(filepath) {
        if (!filepath)
            throw new StorageException("The file path is required.");
        return (await this.metadata(filepath)).size;
    }
    /**
     * Get the file MIME type.
     *
     * @param {string} filepath - The path to the file.
     * @returns {Promise<string>} The detected MIME type.
     * @throws {StorageException} When the file path is empty.
     */
    async mimeType(filepath) {
        if (!filepath)
            throw new StorageException("The file path is required.");
        return (await this.metadata(filepath)).type;
    }
    /**
     * Get the file's last modification date.
     *
     * @param {string} filepath - The path to the file.
     * @returns {Promise<Date>} The last modified timestamp.
     * @throws {StorageException} When the file path is empty.
     */
    async lastModified(filepath) {
        if (!filepath)
            throw new StorageException("The file path is required.");
        return (await this.metadata(filepath)).lastModified;
    }
    /**
     * Retrieve a file from storage.
     *
     * @param {string} filepath - The path to the file.
     * @returns {Promise<Bun.S3File>} The S3 file instance.
     * @throws {StorageException} When the file path is empty.
     */
    async get(filepath) {
        if (!filepath)
            throw new StorageException("The file path is required.");
        return this.client.file(filepath);
    }
    /**
     * Store content at the given path.
     *
     * @param {string} filepath - The destination file path.
     * @param {any} content - The content to store.
     * @param {StorageOptions} options - Additional storage options.
     * @throws {StorageException} When the file path or content is empty.
     */
    async put(filepath, content, options) {
        if (!filepath)
            throw new StorageException("The file path is required.");
        if (!content)
            throw new StorageException("The content is required.");
        try {
            await this.client.write(filepath, content, options);
        }
        catch (error) {
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
    async copy(source, destination, options) {
        if (!source)
            throw new StorageException("The source file path is required.");
        if (!destination)
            throw new StorageException("The destination file path is required.");
        try {
            await this.put(destination, await this.get(source), options);
        }
        catch (error) {
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
    async move(source, destination, options) {
        if (!source)
            throw new StorageException("The source file path is required.");
        if (!destination)
            throw new StorageException("The destination file path is required.");
        try {
            await this.copy(source, destination, options);
            await this.delete(source);
        }
        catch (error) {
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
    async delete(filepath) {
        if (!filepath)
            throw new StorageException("The file path is required.");
        await this.client.file(filepath).delete();
    }
}
