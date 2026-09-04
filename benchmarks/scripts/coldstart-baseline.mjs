const realLog = console.log;
console.log = () => {};

const t0 = performance.now();
await import("@bejibun-baseline/storage");
const t1 = performance.now();

console.log = realLog;
process.stderr.write(String(t1 - t0));
