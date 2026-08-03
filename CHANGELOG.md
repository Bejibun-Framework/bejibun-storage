# Changelog
All notable changes to this project will be documented in this file.

---

## [v0.1.0](https://github.com/Bejibun-Framework/bejibun-storage/compare/v0.1.0...v0.1.0) - 2026-08-03

### 🩹 Fixes

### 📖 Changes
Initial release of `@bejibun/storage` -- a filesystem abstraction for the Bejibun Framework, providing a single API over local disk and S3-compatible storage.

**Disk drivers:**
- `local` -- reads/writes files on the local filesystem
- `s3` -- reads/writes files to an S3-compatible bucket (endpoint, region, bucket, credentials configurable)
  **`Storage` facade / `StorageBuilder`:**
- `.disk(name)` -- select a configured disk by name
- `.build(disk)` -- use an ad-hoc disk config at runtime, without touching `config/storage.ts`
- `.exists(path)` / `.missing(path)` -- check file presence
- `.metadata(path)` -- get file `Stats` (local) or `S3Stats` (S3)
- `.size(path)` -- get file size in bytes
- `.mimeType(path)` -- detect file MIME type
- `.lastModified(path)` -- get last-modified date
- `.get(path)` -- retrieve a `Bun.BunFile` or `Bun.S3File`
- `.put(path, content, options?)` -- write content to a file
- `.copy(source, destination, options?)` -- copy a file
- `.move(source, destination, options?)` -- move a file
- `.delete(path)` -- delete a file
  **Config:**
- `config/storage.ts` supports a `default` disk plus a `disks` map; ships with `local`, `public`, and `s3` examples
- Per-operation `StorageOptions` cover S3-specific concerns (`acl`, `storageClass`, `partSize`, `queueSize`, `retry`, `virtualHostedStyle`, etc.) as well as local options (`mode`, `createPath`)
- `StorageDiskDriverEnum` (`Local` | `S3`) used to identify the driver per disk
  **Error handling:**
- `StorageException` -- thrown for missing/invalid config, unsupported drivers, and missing required arguments; logs via `@bejibun/logger` before throwing

**Dependencies:**
- `@bejibun/app ^0.1.24`
- `@bejibun/logger ^0.1.22`
- `@bejibun/utils ^0.1.28`

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-storage/blob/master/CHANGELOG.md