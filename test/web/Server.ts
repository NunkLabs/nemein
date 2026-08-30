import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { brotliCompressSync, gzipSync } from "node:zlib";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createServer } from "../../src/server";

const SCRIPT = `console.log(${JSON.stringify("x".repeat(4096))});\n`;

let origin: string;
let close: () => Promise<void>;

beforeAll(async () => {
  const webRoot = mkdtempSync(join(tmpdir(), "nemein-server-test-"));

  mkdirSync(join(webRoot, "assets"));
  writeFileSync(join(webRoot, "index.html"), "<!doctype html><title>t</title>");
  writeFileSync(join(webRoot, "assets", "app-abcdef12.js"), SCRIPT);
  writeFileSync(
    join(webRoot, "assets", "app-abcdef12.js.br"),
    brotliCompressSync(SCRIPT)
  );
  writeFileSync(
    join(webRoot, "assets", "app-abcdef12.js.gz"),
    gzipSync(SCRIPT)
  );

  const server = createServer({ webRoot });

  await new Promise<void>((resolve) => server.listen(0, resolve));

  const { port } = server.address() as AddressInfo;

  origin = `http://127.0.0.1:${port}`;
  close = () =>
    new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
});

afterAll(() => close());

describe("static asset serving", () => {
  it("serves the brotli sibling to a client that accepts it", async () => {
    const response = await fetch(`${origin}/assets/app-abcdef12.js`, {
      headers: { "accept-encoding": "gzip, deflate, br" },
    });

    expect(response.headers.get("content-encoding")).toBe("br");
    expect(response.headers.get("content-type")).toBe("text/javascript");
    expect(response.headers.get("vary")).toBe("Accept-Encoding");
    expect(await response.text()).toBe(SCRIPT);
  });

  it("falls back to gzip when brotli is not accepted", async () => {
    const response = await fetch(`${origin}/assets/app-abcdef12.js`, {
      headers: { "accept-encoding": "gzip" },
    });

    expect(response.headers.get("content-encoding")).toBe("gzip");
    expect(await response.text()).toBe(SCRIPT);
  });

  it("serves the raw file to a client that accepts no encoding", async () => {
    const response = await fetch(`${origin}/assets/app-abcdef12.js`, {
      headers: { "accept-encoding": "identity" },
    });

    expect(response.headers.get("content-encoding")).toBeNull();
    expect(response.headers.get("content-length")).toBe(
      String(Buffer.byteLength(SCRIPT))
    );
  });

  it("keeps hashed assets immutable and the document revalidated", async () => {
    const asset = await fetch(`${origin}/assets/app-abcdef12.js`);
    const document = await fetch(`${origin}/`);

    expect(asset.headers.get("cache-control")).toBe(
      "public, max-age=31536000, immutable"
    );
    expect(document.headers.get("cache-control")).toBe(
      "no-cache, must-revalidate"
    );
  });
});
