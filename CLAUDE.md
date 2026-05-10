# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm ci            # Install dependencies
npm run dev       # Dev server with HMR (localhost)
npm run lint      # ESLint
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
npm test          # Run tests (vitest, run-once)
```

No environment variables are required.

## Architecture

This is a single-page React 19 app built with Vite. The entire UI lives in `src/App.jsx` — there are no routes, no state management library, and no component files beyond that one file.

**Key design decisions in `App.jsx`:**

- All contact data is defined in a single `CONTACT` object at the top of the file. Update contact info there only.
- The `VCARD` string is derived from `CONTACT` and drives the `.vcf` download via `handleSaveContact`, which creates a Blob URL on click.
- The `QRCode` component fetches a QR image from an external API (`api.qrserver.com`) using `window.location.href` as the encoded data — it encodes the live page URL, not a hardcoded value.
- All styling is inline (no CSS modules, no Tailwind). `src/App.css` and `src/index.css` provide only global resets; component styles are inline style objects.
- Entrance animations are driven by `useState` + `setTimeout` in `useEffect` (not CSS keyframes). `mounted`, `headerVisible`, and per-`LinkRow` `visible` states control opacity/transform transitions with staggered delays.
- Inline SVGs are defined as components inside the `Icons` object; `public/icons.svg` is not used by the app.
- Google Fonts (`Outfit`, `Cormorant Garamond`) are loaded via a `<link>` tag rendered inside the JSX, not in `index.html`.

## Deployment

- `vite.config.js` sets `base: '/business-card/'` for GitHub Pages hosting under a subpath.
- CI (`ci.yml`) runs lint + tests on PRs to `main`. Deploy (`deploy.yml`) builds and pushes `dist/` to GitHub Pages on merge to `main`.
- Package manager is **npm** — do not commit `yarn.lock` or `pnpm-lock.yaml`.

## ESLint

`no-unused-vars` is configured to ignore names matching `^[A-Z_]` (uppercase-prefixed), which allows the `Icons` object members and `CONTACT`/`VCARD` constants to exist without warnings.
