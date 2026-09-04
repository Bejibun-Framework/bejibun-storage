console.log = () => {};
console.error = () => {};

const {default: Storage} = await import("@bejibun-baseline/storage");
const {default: StorageBuilder} = await import("@bejibun-baseline/storage/builders/StorageBuilder");

const ITERATIONS = 20_000;
const WARMUP = 500;
const root = `${process.env.TMPDIR ?? "/tmp"}/bejibun-storage-bench-baseline`;
const disk = {driver: "local", root};

await Bun.write(`${root}/.keep`, "");

const buildMs = measureConstructor();
const existsMs = await measureExists();
const getMs = await measureGet();
const deleteMs = await measureDelete();

process.stdout.write(`${buildMs}|${existsMs}|${getMs}|${deleteMs}\n`);

function measureConstructor() {
    for (let i = 0; i < WARMUP; i++) {
        void new StorageBuilder();
    }
    const t0 = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
        void new StorageBuilder();
    }
    return performance.now() - t0;
}

async function measureExists() {
    for (let i = 0; i < WARMUP; i++) {
        await Storage.build(disk).exists(`${root}/bench:key-old`);
    }
    const t0 = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
        await Storage.build(disk).exists(`${root}/bench:key:${i % 1000}`);
    }
    return performance.now() - t0;
}

async function measureGet() {
    await Storage.build(disk).put(`${root}/bench:get`, "bench-value");
    for (let i = 0; i < WARMUP; i++) {
        await Storage.build(disk).get(`${root}/bench:get`);
    }
    const t0 = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
        await Storage.build(disk).get(`${root}/bench:get`);
    }
    return performance.now() - t0;
}

async function measureDelete() {
    for (let i = 0; i < WARMUP; i++) {
        const f = `${root}/bench:del:${i}`;
        await Bun.write(f, "x");
        await Storage.build(disk).delete(f);
    }
    const t0 = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
        const f = `${root}/bench:del:${i % 200}`;
        await Bun.write(f, "x");
        await Storage.build(disk).delete(f);
    }
    return performance.now() - t0;
}
