import { describe, expect, it } from "vitest";
import { checkNode, checkPnpm, runChecks } from "./checks.ts";

describe("tool checks", () => {
  it("GIVEN a Node version WHEN it is checked THEN only 22.14 or newer passes and a failure names 22.14", () => {
    expect(checkNode("v22.14.0").ok).toBe(true);
    expect(checkNode("v26.7.0").ok).toBe(true);
    expect(checkNode("v22.13.1").ok).toBe(false);
    expect(checkNode("v20.18.0").fix).toMatch(/22\.14/);
  });

  it("GIVEN no pnpm WHEN it is checked THEN it fails with the Corepack fix", () => {
    expect(checkPnpm("11.5.1").ok).toBe(true);
    expect(checkPnpm(null).ok).toBe(false);
    expect(checkPnpm(null).fix).toMatch(/corepack enable/);
  });
});

describe("setup checks", () => {
  it("GIVEN Node 22.14+, and no docker on PATH WHEN the checks run THEN all pass", async () => {
    const results = await runChecks({
      nodeVersion: "v22.14.0",
      pnpmVersion: "11.5.1",
    });
    expect(results.filter((result) => !result.ok)).toEqual([]);
    expect(results.map((result) => result.name)).toEqual(["Node 22.14+", "pnpm", "node:sqlite"]);
  });

  it("GIVEN Node older than 22.14 WHEN the checks run THEN the Node check fails naming 22.14", async () => {
    const results = await runChecks({
      nodeVersion: "v20.18.0",
      pnpmVersion: "11.5.1",
    });
    const node = results.find((result) => result.name === "Node 22.14+");
    expect(node?.ok).toBe(false);
    expect(node?.fix).toMatch(/22\.14/);
  });
});
