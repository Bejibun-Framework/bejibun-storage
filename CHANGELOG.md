# Changelog
All notable changes to this project will be documented in this file.

---

## [v0.1.11](https://github.com/Bejibun-Framework/bejibun-storage/compare/v0.1.1...v0.1.11) - 2026-09-04

### 🩹 Fixes
- Fixed `StorageBuilder.missing` which used a double negation (`!(await driver.missing(...))`) and therefore returned `exists` instead of the correct "missing" result

### 📖 Changes
#### Performance
- `StorageBuilder` now loads and caches the storage config once via a lazy `loadConfig()` (module-level `cachedConfig`), instead of reading `storage.ts` from disk with `fs.existsSync` + `require()` on every `new StorageBuilder()`
- Replaced the `@bejibun/utils` `defineValue`/`isEmpty` calls with native nullish coalescing (`??`) and truthiness checks in `StorageBuilder`, `StorageLocalBuilder`, and `StorageS3Builder`
- `StorageLocalBuilder` caches the resolved `root` once (validated in the constructor) and resolves paths through a single helper instead of re-validating on every operation
- `StorageS3Builder` validates the required S3 fields once in the constructor and reuses the plain config, instead of re-running the validation getter on every access

#### Docs
- Added missing `@returns` annotations (with descriptions) to every `Storage` facade method, matching the cache and limiter facade style; aligned the `@param`/`@returns` JSDoc format with the sibling packages
- Re-exported the `StorageException` classes from the package root (`@/exceptions/index`) for consistency with the cache and limiter entry points
- Standardized `StorageBuilder` config handling to the same lazy `loadConfig()` pattern used by `CacheBuilder`

### 🧪 Tests
- Added unit test suite (17 tests across 1 file in `tests/unit`) covering `StorageBuilder` input validation (empty path/content/source/destination rejections across `exists`, `missing`, `metadata`, `size`, `mimeType`, `lastModified`, `get`, `put`, `copy`, `move`, `delete`) and the `Storage` facade delegation, with silenced logger output
- Added an integration test suite (7 tests across 1 file in `tests/integration`) exercising the real local disk driver end to end against a temporary directory: `put`/`exists`/`missing`/`size`/`get`, `metadata`/`lastModified`, `copy`, `move`, and `delete`
- Added `test` (unit) and `test:integration` scripts and added `tests` to tsconfig `exclude` so compiled output never lands in `tests/`

### ⚡ Benchmarks
- Added benchmark suite comparing baseline (`@bejibun/storage@0.1.1`) vs the optimized build, covering `construction`, `exists`, `get`, and `delete` hot paths against a temporary local disk; full results are written to `benchmarks/README.md` between the `BENCHMARK` markers
- Also added a cold-start suite spawning 30 fresh OS processes per variant and measuring full process time and import time
- Throughput results on the local disk backend: `construction` **26.64x** (40.0 vs 1.5ms, ~13.3M ops/s), `exists` 1.85x (117.2 vs 63.2ms), `get` 3.50x (74.7 vs 21.3ms), `delete` ~1.03x (3896.7 vs 3775.0ms, I/O bound); cold start ~1.02x

### 📦 Dependencies

- Bumped [`@bejibun/app`](https://github.com/Bejibun-Framework/bejibun-app) from `^0.1.25` to `^0.1.26`
- Bumped [`@bejibun/logger`](https://github.com/Bejibun-Framework/bejibun-logger) from `^0.1.23` to `^0.2.1`
- Bumped [`@bejibun/utils`](https://github.com/Bejibun-Framework/bejibun-utils) from `^0.1.29` to `^0.1.30`
- Bumped `@types/bun` (devDependency) from `^1.3.14` to `^1.4.0`
- Bumped `eslint` (devDependency) from `^10.8.1` to `^10.9.1`
- Bumped `globals` (devDependency) from `^17.11.0` to `^17.12.0`
- Bumped `tsc-alias` (devDependency) from `^1.9.2` to `^1.9.4`
- Bumped `typescript-eslint` (devDependency) from `^8.67.0` to `^8.69.0`

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))

**Full Changelog**: https://github.com/Bejibun-Framework/bejibun-storage/blob/master/CHANGELOG.md

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