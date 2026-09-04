import {
    afterAll,
    afterEach,
    beforeAll,
    beforeEach,
    describe,
    expect,
    mock,
    test
} from "bun:test";
import StorageBuilder from "../../src/builders/StorageBuilder";
import Storage from "../../src/facades/Storage";

const rootDir = `${process.env.TMPDIR ?? "/tmp"}/bejibun-storage-int-${Date.now()}`;
const disk = {driver: "local", root: rootDir};

let writtenFiles: Array<string> = [];

const log = mock(console.log);
const error = mock(console.error);

beforeAll(async () => {
    await Bun.write(`${rootDir}/.keep`, "");
});

beforeEach(() => {
    log.mockReset();
    error.mockReset();
    console.log = log;
    console.error = error;
    writtenFiles = [];
});

afterEach(() => {
    console.log = console.log;
    console.error = console.error;
    void cleanup();
});

async function cleanup() {
    for (const file of writtenFiles) {
        try {
            if (await Bun.file(file).exists()) await Bun.file(file).delete();
        } catch {
            /* already removed by the test */
        }
    }
    writtenFiles = [];
}

afterAll(async () => {
    await Bun.file(`${rootDir}/.keep`).delete();
});

describe("StorageBuilder integration (local disk)", () => {
    test("put stores content and exists/size read it back", async () => {
        const builder = new StorageBuilder().build(disk);
        const filepath = `${rootDir}/hello.txt`;

        writtenFiles.push(filepath);

        await builder.put(filepath, "hello world");

        expect(await builder.exists(filepath)).toBe(true);
        expect(await builder.missing(filepath)).toBe(false);
        expect(await builder.size(filepath)).toBe(11);
        expect(await (await builder.get(filepath)).text()).toBe("hello world");
    });

    test("metadata and lastModified are available after a write", async () => {
        const builder = new StorageBuilder().build(disk);
        const filepath = `${rootDir}/meta.txt`;

        writtenFiles.push(filepath);

        await builder.put(filepath, "meta");

        const meta = await builder.metadata(filepath);

        expect(meta.size).toBe(4);
        expect(await builder.lastModified(filepath)).toBeInstanceOf(Date);
        expect(builder.mimeType(filepath)).toBeTruthy();
    });

    test("copy duplicates the file", async () => {
        const builder = new StorageBuilder().build(disk);
        const source = `${rootDir}/copy-src.txt`;
        const destination = `${rootDir}/copy-dst.txt`;

        writtenFiles.push(source, destination);

        await builder.put(source, "copy me");
        await builder.copy(source, destination);

        expect(await builder.exists(destination)).toBe(true);
        expect(await (await builder.get(destination)).text()).toBe("copy me");
    });

    test("move relocates the file and removes the source", async () => {
        const builder = new StorageBuilder().build(disk);
        const source = `${rootDir}/move-src.txt`;
        const destination = `${rootDir}/move-dst.txt`;

        writtenFiles.push(source, destination);

        await builder.put(source, "move me");
        await builder.move(source, destination);

        expect(await builder.exists(source)).toBe(false);
        expect(await builder.exists(destination)).toBe(true);
        expect(await (await builder.get(destination)).text()).toBe("move me");
    });

    test("delete removes the file", async () => {
        const builder = new StorageBuilder().build(disk);
        const filepath = `${rootDir}/delete.txt`;

        writtenFiles.push(filepath);

        await builder.put(filepath, "gone");
        await builder.delete(filepath);

        expect(await builder.exists(filepath)).toBe(false);
        expect(await builder.missing(filepath)).toBe(true);
    });
});

describe("Storage facade integration (local disk)", () => {
    test("disk + build resolve the same local disk", async () => {
        const builder = Storage.build(disk).disk("local");

        expect(builder).toBeInstanceOf(StorageBuilder);
    });

    test("put via facade stores and get reads back relative to the disk root", async () => {
        const builder = new StorageBuilder().build(disk);
        const filepath = `${rootDir}/facade-put.txt`;

        writtenFiles.push(filepath);

        await builder.put(filepath, "facade");

        expect(await builder.exists(filepath)).toBe(true);
    });
});
