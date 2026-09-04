/**
 * Exception thrown when a storage operation fails.
 */
export default class StorageException extends Error {
    /** The HTTP status code associated with the exception. */
    code: number;
    /**
     * Create a new storage exception.
     *
     * @param {string} message - The error message.
     * @param {number} code - The HTTP status code, defaults to 503.
     */
    constructor(message?: string, code?: number);
}
