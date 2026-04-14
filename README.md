# EverMedia Vault — Frontend

Static marketing and product UI for **EverMedia Vault**: Turn Real Web3 Data into Trusted Knowledge. Built with the Next.js App Router and exported as a fully static site (`out/`) for simple hosting on any CDN or object storage.

## Tech stack

| Area        | Choice                          |
| ----------- | ------------------------------- |
| Framework   | Next.js 14 (App Router)         |
| Language    | TypeScript                      |
| Styling     | Tailwind CSS                    |
| Motion      | Framer Motion                   |
| HTTP client | `fetch` + shared config (`lib/`) |

## Requirements

- **Node.js** 18.x or newer (LTS recommended)
- A running **backend** that exposes the public API under `{API_ORIGIN}/api/v1` (see [Environment](#environment))

## Getting started

### Install dependencies

Using npm:

```bash
npm install
```

Using pnpm:

```bash
pnpm install
```

### Environment

Create a `.env` file in the project root (never commit secrets; this file is gitignored). The app reads **client-safe** variables only:

| Variable                     | Description                                                                 |
| ---------------------------- | --------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL`   | Backend **origin** only (no path), e.g. `http://127.0.0.1:8000` or your API URL |

If `NEXT_PUBLIC_API_BASE_URL` is unset in the browser on `localhost` / `127.0.0.1`, the client falls back to `http://127.0.0.1:8000` for local development.

`next.config.mjs` preloads `NEXT_PUBLIC_API_BASE_URL` from `.env` so static export builds can inline public env as needed.

### Development

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001). The dev server proxies page navigation; API calls go to the configured backend origin.

### Production build (static export)

This project uses `output: 'export'`. A production build emits static HTML, JS, and assets into **`out/`**:

```bash
npm run build
```

Preview the export locally with any static file server, for example:

```bash
npx serve out
```

Deploy the contents of `out/` to your host (e.g. Vercel, Netlify, S3 + CloudFront, Nginx).

### Lint

```bash
npm run lint
```

Runs Next.js ESLint (includes TypeScript-aware rules).

## Repository layout

```text
app/           # Routes, layout, and UI components (App Router)
config/        # API paths, env helpers, timeouts
lib/           # HTTP client and shared types for API responses
public/        # Static assets (images, etc.)
```

Key integrations:

- **`config/env.ts`** — Resolves `NEXT_PUBLIC_API_BASE_URL` (including `window.__PUBLIC_ENV__` injected in `app/layout.tsx` for static builds).
- **`lib/request.ts`** — Typed helpers for alliance members, media list, and related endpoints.

## API assumptions

The frontend expects a backend that serves routes such as:

- `GET {NEXT_PUBLIC_API_BASE_URL}/api/v1/alliance/members`
- Media listing and related endpoints used by the vault records UI

Adjust `config/api.ts` if your API prefix or paths differ.

## License

This repository is **private** (`"private": true` in `package.json`). Add a `LICENSE` file at the root if you intend to distribute the code.

## Links

- [Next.js documentation](https://nextjs.org/docs)
- [Static exports (`output: 'export'`)](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
