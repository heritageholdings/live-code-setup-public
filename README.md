# Heritage live-coding interview: setup check

Run this at least **48 hours before** your session to make sure your machine is ready. It holds nothing about the exercise: you get that repository when the session starts. The exercise is a TypeScript project with a SQLite database and hosted services.

## Requirements

- macOS, Linux, or Windows with WSL2 (work in the WSL2 Linux shell)
- Node.js **22.14 or newer**, ideally an LTS (22 or 24). Node 25 and later no longer ship Corepack, so on macOS install `node@22`, not `node`
- pnpm 11, through Corepack (below)
- Git

## Install

**macOS**: `brew install node@22 git`, then follow brew's note to put `node@22` on your PATH.

**Linux**: install Node 22.14+ (nvm, fnm or your package manager) and git.

**Windows**: run `wsl --install`. Inside WSL2, install Node with nvm or fnm and git with apt. Don't use the Windows versions: `which node` must print a Linux path, not `/mnt/c/...`. Keep the repo in the Linux filesystem too.

Then enable pnpm:

```sh
npm i -g corepack@latest && corepack enable   # add sudo if Node came from apt or dnf
```

Confirm both before running the check, since it can't start without them:

```sh
node -v    # v22.14 or newer; if not, install a newer Node
pnpm -v    # 11.x; if missing, re-run the Corepack line
```

## Run the check

```sh
git clone https://github.com/heritageholdings/live-code-setup-public.git && cd live-code-setup-public
pnpm install
pnpm setup:check
```

It takes a few seconds. In order, it:

1. Checks Node and pnpm.
2. Opens an in-memory SQLite database with Node's built-in `node:sqlite` and runs a query.

It ends with `All good` when everything passes. A failed step prints `✗` and how to fix it.

## If it fails

- Apply the printed fix and run it again. Repeating it is safe.
- `node:sqlite` missing: install Node 22.14 or newer.
- Still stuck: send the full output to your recruiter before the session, not during it.

## AI tool

Bring your own AI coding tool (Claude Code, Codex, Cursor or another). Install it, log in now, and make sure you have enough quota for a 2-hour session.

No subscription? Tell your recruiter ahead of time. Heritage pays for one month of a plan and refunds it through PayPal.
