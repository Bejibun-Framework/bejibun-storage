/**
 * Supported storage disk drivers.
 */
enum StorageDiskDriverEnum {
    /** Local filesystem disk driver. */
    Local = "local",

    /** Amazon S3-compatible disk driver. */
    S3 = "s3"
}

export default StorageDiskDriverEnum;
