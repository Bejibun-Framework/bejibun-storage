/**
 * Supported storage disk drivers.
 */
var StorageDiskDriverEnum;
(function (StorageDiskDriverEnum) {
    /** Local filesystem disk driver. */
    StorageDiskDriverEnum["Local"] = "local";
    /** Amazon S3-compatible disk driver. */
    StorageDiskDriverEnum["S3"] = "s3";
})(StorageDiskDriverEnum || (StorageDiskDriverEnum = {}));
export default StorageDiskDriverEnum;
