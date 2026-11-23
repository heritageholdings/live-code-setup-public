export type Result = { name: string; ok: boolean; detail?: string; fix?: string };

function parseVersion(version: string): { major: number; minor: number } | null {
  const match = /^v?(\d+)\.(\d+)/.exec(version.trim());
  return match ? { major: Number(match[1]), minor: Number(match[2]) } : null;
}

// pnpm 11 needs Node 22.13 or newer, and Corepack before 22.14 has stale signing keys.
export function checkNode(version: string): Result {
  const parsed = parseVersion(version);
  const ok = !!parsed && (parsed.major > 22 || (parsed.major === 22 && parsed.minor >= 14));
  if (ok) return { name: "Node 22.14+", ok, detail: version };
  return {
    name: "Node 22.14+",
    ok,
    fix: `Found ${version}. Install Node 22.14 or newer, ideally an LTS (22 or 24): \`brew install node@22\`, or nvm/fnm.`,
  };
}

export function checkPnpm(version: string | null): Result {
  if (version) return { name: "pnpm", ok: true, detail: version };
  return {
    name: "pnpm",
    ok: false,
    fix: "Run `npm i -g corepack@latest && corepack enable` (add `sudo` if Node came from apt/dnf; Node 25+ no longer ships Corepack), then re-run. Or `npm i -g pnpm`.",
  };
}

export function formatResult(result: Result): string {
  if (result.ok) return `✓ ${result.name}${result.detail ? ` (${result.detail})` : ""}`;
  return `✗ ${result.name}\n    Fix: ${result.fix ?? "see README"}`;
}

export function summarize(results: Result[]): string {
  const failed = results.filter((result) => !result.ok).length;
  if (failed === 0) return "All good. Your machine is ready.";
  return `${failed} ${failed === 1 ? "check" : "checks"} failed. Apply the fixes above and re-run.`;
}

/** Opens an in-memory SQLite database with Node's built-in module and runs a trivial query. */
export async function checkSqlite(): Promise<Result> {
  const name = "node:sqlite";
  try {
    // getBuiltinModule, not import: Vitest's loader doesn't know node:sqlite.
    const sqlite = process.getBuiltinModule("node:sqlite");
    if (!sqlite) throw new Error("module not found");
    const db = new sqlite.DatabaseSync(":memory:");
    const row = db.prepare("select 1 as one").get() as { one: number } | undefined;
    db.close();
    if (row?.one === 1) return { name, ok: true };
    return { name, ok: false, fix: "SQLite answered an unexpected result. Reinstall Node 22.14 or newer." };
  } catch (error) {
    return {
      name,
      ok: false,
      fix: `Node's built-in node:sqlite is not available (${error instanceof Error ? error.message : error}). Install Node 22.14 or newer.`,
    };
  }
}

export type Deps = {
  nodeVersion: string;
  pnpmVersion: string | null;
};

export async function runChecks(deps: Deps): Promise<Result[]> {
  return [checkNode(deps.nodeVersion), checkPnpm(deps.pnpmVersion), await checkSqlite()];
}
