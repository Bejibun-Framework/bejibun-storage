# Changelog
All notable changes to this project will be documented in this file.

---

## [v0.1.1](https://github.com/Bejibun-Framework/bejibun-storage/compare/v0.1.0...v0.1.1) - 2026-08-20

### 🩹 Fixes
- Fix missing `options` in `Storage.put()`

### 📖 Changes
#### Tooling
- Added `prettier` + `.prettierrc.json` / `.prettierignore` and an `eslint.config.js` (flat config, `typescript-eslint`) for consistent formatting/linting across `src`
- Added `bun run format`, `bun run eslint`, and `bun run lint` scripts; `bun run build` now runs `lint` before compiling
- `alias` script now runs `tsc-alias` directly instead of via `bunx`

### 📦 Dependencies

- Bumped `tsc-alias` (devDependency) from `^1.8.16` to `^1.9.2`
- Added `@eslint/js` (devDependency) `^10.0.1`
- Added `eslint` (devDependency) `^10.8.1`
- Added `eslint-config-prettier` (devDependency) `^10.1.8`
- Added `globals` (devDependency) `^17.11.0`
- Added `prettier` (devDependency) `^3.9.6`
- Added `typescript` (devDependency) `^6.0.3`
- Added `typescript-eslint` (devDependency) `^8.67.0`

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-storage/blob/master/CHANGELOG.md

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