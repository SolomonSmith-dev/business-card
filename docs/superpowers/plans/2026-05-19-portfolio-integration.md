# Portfolio Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy the digital business card to `solomonsmith.dev/card` by wiring a CI deploy from the `business-card` repo into the `SolomonSmith-dev.github.io` portfolio repo.

**Architecture:** Two repos stay separate. `business-card` builds with Vite (base path `/card/`) and GitHub Actions pushes the output into a `card/` directory in the portfolio repo via SSH deploy key. Jekyll passes through the static files untouched. A "View Portfolio" link on the card and a "card" entry in the portfolio footer connect the two.

**Tech Stack:** React, Vite, GitHub Actions, Jekyll, GitHub Pages, SSH deploy keys

---

## File Map

### `business-card` repo

| File | Change |
|---|---|
| `vite.config.js` | `base: '/business-card/'` → `base: '/card/'` |
| `src/digital-business-card.jsx` | Add "View Portfolio →" link in footer |
| `.github/workflows/deploy.yml` | Replace with cross-repo deploy workflow |

### `SolomonSmith-dev.github.io` repo

| File | Change |
|---|---|
| `_layouts/default.html` | Add `card` link to footer `<ul>` |

---

## Task 1: Update Vite base path

**Files:**
- Modify: `vite.config.js`

- [ ] **Step 1: Update base path**

Open `vite.config.js`. Change `base: '/business-card/'` to `base: '/card/'`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/card/',
})
```

- [ ] **Step 2: Verify the build succeeds**

```bash
npm run build
```

Expected: build completes, `dist/` is created. Check `dist/index.html` -- it should reference assets at `/card/assets/...`, not `/assets/...`.

```bash
grep 'src=' dist/index.html
```

Expected output contains `/card/assets/`:
```
src="/card/assets/index-...js"
```

- [ ] **Step 3: Run tests**

```bash
npm test
```

Expected: all tests pass. The Vitest suite runs under jsdom and does not use Vite's `base`, so no test changes are needed.

- [ ] **Step 4: Commit**

```bash
git add vite.config.js
git commit -m "chore: set vite base path to /card/ for sub-path deployment"
```

---

## Task 2: Add "View Portfolio" link to card

**Files:**
- Modify: `src/digital-business-card.jsx`

- [ ] **Step 1: Add the link below the NFC footer line**

In `src/digital-business-card.jsx`, find the `{/* Footer */}` comment block (near the bottom of the `return`). It currently looks like:

```jsx
{/* Footer */}
<div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 36 }}>
  <div style={{ width: 16, height: 1, background: "rgba(200,30,30,0.2)" }} />
  <span style={{ fontSize: 10, color: "#2a2a2a", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500 }}>NFC Enabled</span>
  <div style={{ width: 16, height: 1, background: "rgba(200,30,30,0.2)" }} />
</div>
```

Add a portfolio link div immediately after it:

```jsx
{/* Footer */}
<div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 36 }}>
  <div style={{ width: 16, height: 1, background: "rgba(200,30,30,0.2)" }} />
  <span style={{ fontSize: 10, color: "#2a2a2a", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500 }}>NFC Enabled</span>
  <div style={{ width: 16, height: 1, background: "rgba(200,30,30,0.2)" }} />
</div>

<div style={{ textAlign: "center", marginTop: 10 }}>
  <a
    href="https://solomonsmith.dev"
    style={{ fontSize: 10, color: "#2a2a2a", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 500, textDecoration: "none" }}
    onMouseEnter={(e) => { e.currentTarget.style.color = "#555"; }}
    onMouseLeave={(e) => { e.currentTarget.style.color = "#2a2a2a"; }}
  >
    View Portfolio →
  </a>
</div>
```

- [ ] **Step 2: Visually verify in dev mode**

```bash
npm run dev
```

Open `http://localhost:5173` in a browser. Scroll to the bottom of the card. The "View Portfolio →" link should appear below the "NFC Enabled" line, very muted, in the same small-caps style. Hovering should lighten it slightly.

- [ ] **Step 3: Run tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/digital-business-card.jsx
git commit -m "feat: add View Portfolio link to card footer"
```

---

## Task 3: Set up SSH deploy key (manual, one-time)

This task has no code. It configures the credentials that allow GitHub Actions on `business-card` to push into `SolomonSmith-dev.github.io`.

- [ ] **Step 1: Generate an SSH key pair**

Run this locally (do not use a passphrase -- Actions can't enter one):

```bash
ssh-keygen -t ed25519 -C "business-card-deploy" -f ~/.ssh/business_card_deploy -N ""
```

This creates:
- `~/.ssh/business_card_deploy` -- private key (goes into Actions secret)
- `~/.ssh/business_card_deploy.pub` -- public key (goes into portfolio repo)

- [ ] **Step 2: Add the public key to the portfolio repo**

1. Copy the public key: `cat ~/.ssh/business_card_deploy.pub`
2. Go to `github.com/SolomonSmith-dev/SolomonSmith-dev.github.io` → Settings → Deploy keys → Add deploy key
3. Title: `business-card-deploy`
4. Key: paste the public key content
5. Check **Allow write access**
6. Click Add key

- [ ] **Step 3: Add the private key as a secret on `business-card`**

1. Copy the private key: `cat ~/.ssh/business_card_deploy`
2. Go to `github.com/SolomonSmith-dev/business-card` → Settings → Secrets and variables → Actions → New repository secret
3. Name: `PORTFOLIO_DEPLOY_KEY`
4. Value: paste the entire private key (including the `-----BEGIN...` and `-----END...` lines)
5. Click Add secret

- [ ] **Step 4: Clean up local key files**

```bash
rm ~/.ssh/business_card_deploy ~/.ssh/business_card_deploy.pub
```

The keys are now stored securely in GitHub. No local copies needed.

---

## Task 4: Replace deploy workflow with cross-repo deploy

**Files:**
- Modify: `.github/workflows/deploy.yml` (replace contents entirely)

The existing `deploy.yml` deploys the card to its own GitHub Pages space. Replace it with a workflow that builds the card and pushes the output into the portfolio repo's `card/` directory.

- [ ] **Step 1: Replace deploy.yml**

Overwrite `.github/workflows/deploy.yml` with:

```yaml
name: Deploy Card to Portfolio

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Configure SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.PORTFOLIO_DEPLOY_KEY }}" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keyscan github.com >> ~/.ssh/known_hosts

      - name: Clone portfolio repo
        run: |
          GIT_SSH_COMMAND="ssh -i ~/.ssh/deploy_key" \
            git clone git@github.com:SolomonSmith-dev/SolomonSmith-dev.github.io.git portfolio

      - name: Copy card build into portfolio
        run: |
          rm -rf portfolio/card
          cp -r dist portfolio/card

      - name: Commit and push
        run: |
          cd portfolio
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add card/
          if ! git diff --staged --quiet; then
            GIT_SSH_COMMAND="ssh -i ~/.ssh/deploy_key" git commit -m "chore: deploy card build [skip ci]"
            GIT_SSH_COMMAND="ssh -i ~/.ssh/deploy_key" git push
          fi
```

The `git diff --staged --quiet ||` guard ensures the workflow doesn't fail if the build output hasn't changed (i.e., a push that only touched non-card files like the README).

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: replace pages deploy with cross-repo card deploy"
```

---

## Task 5: Add card link to portfolio footer

**Repo:** `SolomonSmith-dev.github.io`

**Files:**
- Modify: `_layouts/default.html`

- [ ] **Step 1: Add card link to the footer `<ul>`**

In `_layouts/default.html`, find the footer `<ul>`:

```html
    <ul>
      <li><a href="mailto:{{ site.email }}">email</a></li>
      <li><a href="https://github.com/{{ site.github_username }}" target="_blank" rel="noopener">github</a></li>
      <li><a href="https://linkedin.com/in/{{ site.linkedin_username }}" target="_blank" rel="noopener">linkedin</a></li>
      <li><button class="term-hint" id="term-hint-btn" title="open terminal">[/]</button></li>
    </ul>
```

Add a `card` link as the last `<li>` before the terminal button:

```html
    <ul>
      <li><a href="mailto:{{ site.email }}">email</a></li>
      <li><a href="https://github.com/{{ site.github_username }}" target="_blank" rel="noopener">github</a></li>
      <li><a href="https://linkedin.com/in/{{ site.linkedin_username }}" target="_blank" rel="noopener">linkedin</a></li>
      <li><a href="/card">card</a></li>
      <li><button class="term-hint" id="term-hint-btn" title="open terminal">[/]</button></li>
    </ul>
```

- [ ] **Step 2: Commit in the portfolio repo**

```bash
cd ~/Projects/SolomonSmith-dev.github.io
git add _layouts/default.html
git commit -m "feat: add card link to footer"
git push
```

---

## Task 6: Verify end-to-end

- [ ] **Step 1: Push business-card to trigger the deploy**

```bash
cd ~/Projects/business-card
git push
```

- [ ] **Step 2: Watch the Actions run**

Go to `github.com/SolomonSmith-dev/business-card/actions`. The "Deploy Card to Portfolio" workflow should appear. Click it to watch the steps. The full run takes ~1-2 minutes.

Expected: all steps green. The "Commit and push" step should show output like:
```
[main abc1234] chore: deploy card build [skip ci]
```

- [ ] **Step 3: Verify the card/ directory appeared in the portfolio repo**

Go to `github.com/SolomonSmith-dev/SolomonSmith-dev.github.io`. Confirm a `card/` directory now exists at the root with an `index.html` and `assets/` subdirectory inside.

- [ ] **Step 4: Wait for GitHub Pages to rebuild (1-3 minutes)**

GitHub Pages automatically rebuilds the Jekyll site when the portfolio repo changes. There is no manual step.

- [ ] **Step 5: Verify the card is live**

Open `https://solomonsmith.dev/card` in a browser. The dark business card should load. Check:
- Contact links work (email, phone, LinkedIn, GitHub)
- "Save Contact" downloads a `.vcf` file
- QR code appears when clicking the QR button -- scan it and confirm it encodes `https://solomonsmith.dev/card`
- "View Portfolio →" link navigates to `https://solomonsmith.dev`

- [ ] **Step 6: Verify the footer link on the portfolio**

Open `https://solomonsmith.dev`. Scroll to the footer. Confirm "card" appears in the link list and navigates to `/card`.
