<div align="center">

<img src="https://github.com/Bejibun-Framework/bejibun/blob/master/public/images/bejibun.png?raw=true" width="150" alt="Bejibun" />

![GitHub top language](https://img.shields.io/github/languages/top/Bejibun-Framework/bejibun-storage)
![NPM Downloads](https://img.shields.io/npm/d18m/%40bejibun%2Fstorage)
![GitHub issues](https://img.shields.io/github/issues/Bejibun-Framework/bejibun-storage)
![GitHub](https://img.shields.io/github/license/Bejibun-Framework/bejibun-storage)
![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/Bejibun-Framework/bejibun-storage?display_name=tag&include_prereleases)

</div>

# Storage for Bejibun
Storage for Bejibun Framework.

## Usage

### Installation
Install the package.

```bash
# Using Bun
bun add @bejibun/storage

# Using Bejibun
bun ace install @bejibun/storage
```

### Configuration
The configuration file automatically executed if you are using `ace`.

Or

Add `storage.ts` inside config directory on your project if doesn't exist.

```bash
config/storage.ts
```

```ts
import App from "@bejibun/app";
import StorageDiskDriverEnum from "@/enums/StorageDiskDriverEnum";

const config: Record<string, any> = {
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
```

You can pass the value with environment variables.

### How to Use
How to use tha package.

#### Standard Use
```ts
import Storage from "@bejibun/core/facades/Storage";

await Storage.exists("path/to/your/file.ext"); // Check if the file exists
await Storage.missing("path/to/your/file.ext"); // Check if the file doesn't exists
await Storage.get("path/to/your/file.ext"); // Get data content
await Storage.put("path/to/your/file.ext", "content"); // Store content to file
await Storage.copy("source/file.ext", "destination/file.ext"); // Copy file
await Storage.move("source/file.ext", "destination/file.ext"); // Move file
await Storage.delete("path/to/your/file.ext"); // Delete file
await Storage.metadata("path/to/your/file.ext"); // Retrieve complete file metadata and statistics
await Storage.size("path/to/your/file.ext"); // Get the file size in bytes
await Storage.mimeType("path/to/your/file.ext"); // Get the file MIME type
await Storage.lastModified("path/to/your/file.ext"); // Get the file's last modification date
```

#### With Specified Disk
```ts
import Storage from "@bejibun/core/facades/Storage";

await Storage.disk("public").exists("path/to/your/file.ext");
await Storage.disk("public").missing("path/to/your/file.ext");
await Storage.disk("public").get("path/to/your/file.ext");
await Storage.disk("public").put("path/to/your/file.ext", "content");
await Storage.disk("public").copy("source/file.ext", "destination/file.ext");
await Storage.disk("public").move("source/file.ext", "destination/file.ext");
await Storage.disk("public").delete("path/to/your/file.ext");
await Storage.disk("public").metadata("path/to/your/file.ext");
await Storage.disk("public").size("path/to/your/file.ext");
await Storage.disk("public").mimeType("path/to/your/file.ext");
await Storage.disk("public").lastModified("path/to/your/file.ext");
```

#### New Disk at Runtime
```ts
import Storage from "@bejibun/core/facades/Storage";

await Storage.build({
    driver: "local", // "local" | StorageDiskDriverEnum.Local
    root: App.Path.storagePath("custom")
}).exists("path/to/your/file.ext");
await Storage.build({
    driver: "local",
    root: App.Path.storagePath("custom")
}).missing("path/to/your/file.ext");
await Storage.build({
    driver: "local",
    root: App.Path.storagePath("custom")
}).get("path/to/your/file.ext");
await Storage.build({
    driver: "local",
    root: App.Path.storagePath("custom")
}).put("path/to/your/file.ext", "content");
await Storage.build({
    driver: "local",
    root: App.Path.storagePath("custom")
}).copy("source/file.ext", "destination/file.ext");
await Storage.build({
    driver: "local",
    root: App.Path.storagePath("custom")
}).move("source/file.ext", "destination/file.ext");
await Storage.build({
    driver: "local",
    root: App.Path.storagePath("custom")
}).delete("path/to/your/file.ext");
await Storage.build({
    driver: "local",
    root: App.Path.storagePath("custom")
}).metadata("path/to/your/file.ext");
await Storage.build({
    driver: "local",
    root: App.Path.storagePath("custom")
}).size("path/to/your/file.ext");
await Storage.build({
    driver: "local",
    root: App.Path.storagePath("custom")
}).mimeType("path/to/your/file.ext");
await Storage.build({
    driver: "local",
    root: App.Path.storagePath("custom")
}).lastModified("path/to/your/file.ext");
```

## ☕ Support / Donate

If you find this project helpful and want to support it:

[![Donate](https://img.shields.io/badge/Donate-Support%20Me-orange?style=for-the-badge)](https://donate.bejibun.com)

Or you can buy this `$BJBN (Bejibun)` tokens [here](https://pump.fun/coin/CQhbNnCGKfDaKXt8uE61i5DrBYJV7NPsCDD9vQgypump).