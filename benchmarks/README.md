# Benchmarks

Speed comparison: baseline (previously published npm release `@bejibun/storage@0.1.1`) vs the optimized `@bejibun/storage` in this repo.

## Running

```bash
# Run all benchmarks (installs baseline from npm first)
bun run bench

# Or run individually (after install-deps)
bun run install-deps
bun run coldstart
bun run throughput
```

## Cold Start

Measures package import time by spawning fresh OS processes. Two metrics:

- **Full process time** — spawn → exit (includes Bun boot time)
- **Import** — measured inside the process, isolates the package's own import cost

<!-- BENCHMARK:COLDSTART:START -->

|                             | baseline | optimized | speedup   |
| --------------------------- | -------- | --------- | --------- |
| Full process (spawn → exit) | 23.1ms   | 21.5ms    | **1.07x** |
| Import                      | 15.3ms   | 14.1ms    | **1.09x** |

<!-- BENCHMARK:COLDSTART:END -->

## Throughput

The hot paths touched on every storage operation. `construction` covers `new StorageBuilder()` plus config resolution (no disk I/O). `exists`, `get`, and `delete` run the full facade against a temporary local disk. 20,000 calls each, median of 9 runs.

<!-- BENCHMARK:THROUGHPUT:START -->

| Method         | baseline (0.1.1) | optimized | speedup    | baseline ops/s | optimized ops/s |
| -------------- | ---------------- | --------- | ---------- | -------------- | --------------- |
| `construction` | 35.0ms           | 1.5ms     | **22.90x** | 571,510/s      | 13,086,855/s    |
| `exists`       | 88.7ms           | 52.9ms    | **1.68x**  | 225,468/s      | 377,841/s       |
| `get`          | 54.4ms           | 15.3ms    | **3.54x**  | 367,796/s      | 1,303,802/s     |
| `delete`       | 3320.7ms         | 3226.3ms  | **1.03x**  | 6,023/s        | 6,199/s         |

<!-- BENCHMARK:THROUGHPUT:END -->
