import App from "@bejibun/app";
import StorageDiskDriverEnum from "../enums/StorageDiskDriverEnum";
/**
 * Default storage configuration defining the available disk drivers and their settings.
 */
const config = {
    /** The default disk used when no disk is specified. */
    default: "local",
    /** The collection of named storage disks. */
    disks: {
        /** Local disk using the application storage path as its root. */
        local: {
            driver: StorageDiskDriverEnum.Local,
            root: App.Path.storagePath("app")
        },
        /** Publicly accessible local disk rooted at the public storage path. */
        public: {
            driver: StorageDiskDriverEnum.Local,
            root: App.Path.storagePath("app/public"),
            url: `${Bun.env.APP_URL}/storage/public`
        },
        /** S3-compatible disk configured via S3 environment variables. */
        s3: {
            driver: StorageDiskDriverEnum.S3,
            endpoint: Bun.env.S3_ENDPOINT,
            region: Bun.env.S3_REGION,
            bucket: Bun.env.S3_BUCKET,
            access_key_id: Bun.env.S3_ACCESS_KEY_ID,
            secret_access_key: Bun.env.S3_SECRET_ACCESS_KEY,
            url: ""
        }
    }
};
export default config;
