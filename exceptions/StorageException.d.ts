export default class StorageException extends Error {
    code: number;
    constructor(message?: string, code?: number);
}
