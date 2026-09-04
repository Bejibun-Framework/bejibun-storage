import Logger from "@bejibun/logger";
import { defineValue } from "@bejibun/utils";
/**
 * Exception thrown when a storage operation fails.
 */
export default class StorageException extends Error {
    /** The HTTP status code associated with the exception. */
    code;
    /**
     * Create a new storage exception.
     *
     * @param {string} message - The error message.
     * @param {number} code - The HTTP status code, defaults to 503.
     */
    constructor(message, code) {
        super(message);
        this.name = "StorageException";
        this.code = defineValue(code, 503);
        Logger.setContext(this.name).error(this.message).trace(this.stack);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, StorageException);
        }
    }
}
