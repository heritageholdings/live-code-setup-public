import { spawnSync } from "node:child_process";
import { formatResult, runChecks, summarize } from "./checks.ts";

const pnpm = spawnSync("pnpm", ["--version"], { encoding: "utf8" });

const results = await runChecks({
  nodeVersion: process.version,
  pnpmVersion: pnpm.status === 0 ? pnpm.stdout.trim() : null,
});
for (const result of results) console.log(formatResult(result));

console.log(`\n${summarize(results)}`);
process.exit(results.every((result) => result.ok) ? 0 : 1);
