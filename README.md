# Business Card

A personal business-card site built with React and Vite.

## Develop / Build

**Package manager:** npm (use `package-lock.json`; do not commit `yarn.lock` or `pnpm-lock.yaml`)

```bash
# Install dependencies
npm ci

# Start dev server with HMR
npm run dev

# Lint
npm run lint

# Production build (output → dist/)
npm run build

# Preview production build locally
npm run preview
```

## Environment variables

No environment variables are required to run this project.

## CI

GitHub Actions runs `npm run lint` and `npm run build` on every push and pull request to `main` (see [`.github/workflows/ci.yml`](.github/workflows/ci.yml)).

Deployments to GitHub Pages are triggered automatically on push to `main` via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
