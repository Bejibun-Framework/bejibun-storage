import App from "@bejibun/app";
import StorageDiskDriverEnum from "../enums/StorageDiskDriverEnum";
const config = {
    default: "local",
    disks: {
        local: {
            driver: StorageDiskDriverEnum.Local,
            root: App.Path.storagePath("app")
        },
        public: {
            driver: StorageDiskDriverEnum.Local,
            root: App.Path.storagePath("app/public"),
            url: `${Bun.env.APP_URL}/storage/public`
        },
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
