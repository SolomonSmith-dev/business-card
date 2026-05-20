# Portfolio Integration Design

**Date:** 2026-05-19
**Scope:** Deploy `business-card` as `solomonsmith.dev/card` and wire it back to the portfolio.

---

## Goal

The digital business card is a networking utility -- a URL you hand out or print as a QR code. It should live under the same domain as the portfolio (`solomonsmith.dev`) so the QR code points to a clean, professional URL. The two repos stay separate; they are joined by a CI deploy step.

---

## Architecture

Two repos, one domain.

- **`business-card`** -- React/Vite. Owns all card source. CI builds and pushes output to the portfolio repo.
- **`SolomonSmith-dev.github.io`** -- Jekyll. Owns `solomonsmith.dev`. Accepts the card's built static files in a `card/` directory that Jekyll does not process.

GitHub Pages serves both from the same repo, so no extra DNS or subdomain configuration is needed.

---

## Changes: `business-card` repo

### 1. Vite base path

`vite.config.js` must set `base: '/card/'` so all bundled asset paths (`/assets/index-xyz.js`, etc.) resolve correctly when served from the sub-path rather than the root.

### 2. "View Portfolio" link

Add a footer link inside `DigitalBusinessCard` pointing to `https://solomonsmith.dev`. Minimal -- matches the existing footer style (small, muted, uppercase). Positioned near the "NFC Enabled" line.

### 3. GitHub Actions deploy workflow

New workflow file: `.github/workflows/deploy-card.yml`

Trigger: push to `main`.

Steps:
1. Checkout `business-card`.
2. Install deps (`npm ci`), run `npm run build`. Output lands in `dist/`.
3. Checkout `SolomonSmith-dev.github.io` into a temp directory using a deploy key (repo secret: `PORTFOLIO_DEPLOY_KEY`).
4. Rsync `dist/` into `card/` in the portfolio repo, replacing previous output.
5. Commit and push. Commit message: `chore: deploy card build [skip ci]`.

The `[skip ci]` tag prevents the portfolio repo's own CI from re-triggering on the automated commit.

**Deploy key setup (one-time, manual):**
- Generate an SSH key pair.
- Add the public key as a Deploy Key on `SolomonSmith-dev.github.io` with write access.
- Add the private key as a repository secret (`PORTFOLIO_DEPLOY_KEY`) on `business-card`.

---

## Changes: `SolomonSmith-dev.github.io` repo

### 1. No Jekyll configuration needed

Jekyll only processes files that contain a YAML front matter block (`---`). Vite's build output (HTML, JS, CSS) has none, so Jekyll copies the `card/` directory to `_site/card/` as static files untouched. No `_config.yml` changes required.

### 2. Optional footer link

Add a one-liner to the Jekyll footer template linking to `/card`:

```
Digital card →
```

Subtle -- same treatment as existing footer links. Not in the nav.

---

## QR Code behavior

The card generates its QR code from `window.location.href` at runtime. No hardcoding needed. Once the card is served at `solomonsmith.dev/card`, the QR code automatically encodes that URL.

---

## Out of scope

- Subdomain (`card.solomonsmith.dev`) -- unnecessary complexity for GitHub Pages.
- Merging repos -- two repos stay separate.
- Portfolio redesign -- Jekyll site is unchanged except for the `exclude` config and optional footer link.
- Nav-level link in the portfolio -- the card is a utility, not a featured section.
