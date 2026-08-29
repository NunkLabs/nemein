# TetriBASS Server

This repository contains the game server and web client in one unified setup. The web client previously lived in [NunkLabs/nemein-client](https://github.com/NunkLabs/nemein-client); it now lives in `src/web` and shares this repository's package management, build, and deployment workflow.

## Requirements

- Node.js 18 or newer
- [pnpm](https://pnpm.io/installation)

## Development

Install dependencies:

```bash
pnpm install
```

Start the server and Vite development server:

```bash
pnpm dev
```

Open `http://localhost:3000`. Vite proxies WebSocket requests at `/ws` to the game server on `http://localhost:8080`.

## Production

Build the server and web client, then start the server:

```bash
pnpm start
```

One Node.js process listens on `http://localhost:8080`. It serves the built client from `dist/web` and handles WebSocket upgrades at `/ws`.

Run checks. `pnpm check` reports formatting and lint problems, `pnpm fix` applies the fixable ones:

```bash
pnpm check
pnpm build
pnpm test
```

## Project structure

```text
.
├── dist
│   ├── server       # Compiled server
│   └── web          # Built web client
├── src
│   ├── core         # Game logic
│   ├── utils
│   ├── web          # React and Vite client
│   ├── websocket
│   ├── index.ts     # Server entry point
│   └── server.ts    # HTTP and WebSocket server
└── test
    ├── classic
    └── nemein
```
