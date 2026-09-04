import {
    afterEach,
    beforeEach,
    describe,
    expect,
    mock,
    test
} from "bun:test";
import StorageBuilder from "../../src/builders/StorageBuilder";
import StorageException from "../../src/exceptions/StorageException";
import Storage from "../../src/facades/Storage";

const log = mock(console.log);
const error = mock(console.error);

beforeEach(() => {
    log.mockReset();
    error.mockReset();
    console.log = log;
    console.error = error;
});

afterEach(() => {
    console.log = console.log;
    console.error = console.error;
});

describe("StorageBuilder", () => {
    test("build applies the disk override and returns the builder", () => {
        const disk = {driver: "local", root: "/tmp"};
        const builder = new StorageBuilder().build(disk);

        expect(builder).toBeInstanceOf(StorageBuilder);
    });

    test("disk selects a disk by name and returns the builder", () => {
        const builder = new StorageBuilder().disk("local");

        expect(builder).toBeInstanceOf(StorageBuilder);
    });

    test("exists throws when the file path is empty", async () => {
        const builder = new StorageBuilder();

        const error: any = await builder.exists("").catch((e) => e);

        expect(error).toBeInstanceOf(StorageException);
        expect(error.message).toBe("The file path is required.");
    });

    test("missing throws when the file path is empty", async () => {
        const builder = new StorageBuilder();

        const error: any = await builder.missing("").catch((e) => e);

        expect(error).toBeInstanceOf(StorageException);
        expect(error.message).toBe("The file path is required.");
    });

    test("metadata throws when the file path is empty", async () => {
        const builder = new StorageBuilder();

        const error: any = await builder.metadata("").catch((e) => e);

        expect(error).toBeInstanceOf(StorageException);
        expect(error.message).toBe("The file path is required.");
    });

    test("size throws when the file path is empty", async () => {
        const builder = new StorageBuilder();

        const error: any = await builder.size("").catch((e) => e);

        expect(error).toBeInstanceOf(StorageException);
        expect(error.message).toBe("The file path is required.");
    });

    test("mimeType throws when the file path is empty", async () => {
        const builder = new StorageBuilder();

        const error: any = await builder.mimeType("").catch((e) => e);

        expect(error).toBeInstanceOf(StorageException);
        expect(error.message).toBe("The file path is required.");
    });

    test("lastModified throws when the file path is empty", async () => {
        const builder = new StorageBuilder();

        const error: any = await builder.lastModified("").catch((e) => e);

        expect(error).toBeInstanceOf(StorageException);
        expect(error.message).toBe("The file path is required.");
    });

    test("get throws when the file path is empty", async () => {
        const builder = new StorageBuilder();

        const error: any = await builder.get("").catch((e) => e);

        expect(error).toBeInstanceOf(StorageException);
        expect(error.message).toBe("The file path is required.");
    });

    test("put throws when the file path or content is empty", async () => {
        const builder = new StorageBuilder();

        const pathError: any = await builder.put("", "x").catch((e) => e);

        expect(pathError).toBeInstanceOf(StorageException);
        expect(pathError.message).toBe("The file path is required.");

        const contentError: any = await builder.put("file.txt", "").catch((e) => e);

        expect(contentError).toBeInstanceOf(StorageException);
        expect(contentError.message).toBe("The content is required.");
    });

    test("copy throws when the source or destination path is empty", async () => {
        const builder = new StorageBuilder();

        const sourceError: any = await builder.copy("", "dst").catch((e) => e);

        expect(sourceError.message).toBe("The source file path is required.");

        const destError: any = await builder.copy("src", "").catch((e) => e);

        expect(destError.message).toBe("The destination file path is required.");
    });

    test("move throws when the source or destination path is empty", async () => {
        const builder = new StorageBuilder();

        const sourceError: any = await builder.move("", "dst").catch((e) => e);

        expect(sourceError.message).toBe("The source file path is required.");

        const destError: any = await builder.move("src", "").catch((e) => e);

        expect(destError.message).toBe("The destination file path is required.");
    });

    test("delete throws when the file path is empty", async () => {
        const builder = new StorageBuilder();

        const error: any = await builder.delete("").catch((e) => e);

        expect(error).toBeInstanceOf(StorageException);
        expect(error.message).toBe("The file path is required.");
    });
});

describe("Storage facade", () => {
    test("build returns a StorageBuilder", () => {
        expect(Storage.build({driver: "local", root: "/tmp"})).toBeInstanceOf(
            StorageBuilder
        );
    });

    test("disk returns a StorageBuilder", () => {
        expect(Storage.disk("local")).toBeInstanceOf(StorageBuilder);
    });

    test("exists throws when the file path is empty", async () => {
        const error: any = await Storage.exists("").catch((e) => e);

        expect(error).toBeInstanceOf(StorageException);
        expect(error.message).toBe("The file path is required.");
    });

    test("put throws when the file path is empty", async () => {
        const error: any = await Storage.put("", "x").catch((e) => e);

        expect(error).toBeInstanceOf(StorageException);
        expect(error.message).toBe("The file path is required.");
    });
});
