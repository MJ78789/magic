# MagicSuccess Thailand Profile Website

Static brand and content hub built with HTML, CSS, JavaScript, JSON, and Markdown.

## Preview locally

Open `index.html` directly, or run:

```bash
python3 -m http.server 8080 --directory magic-success-profile
```

Then visit `http://localhost:8080`.

## Structure

- `index.html` — content, SEO metadata, and page sections
- `youtube.html` — YouTube library with Podcast, Shorts, and Videos filters
- `content.html` / `article.html` — article library and Markdown reader
- `data/videos.json` — generated YouTube data with a mock fallback before the first sync
- `scripts/sync-youtube.mjs` — server-side playlist sync (API key stays in GitHub Secrets)
- `data/articles.json` / `content/*.md` — article manifest and content
- `assets/css/styles.css` — responsive navy/cream/gold design
- `assets/js/main.js` — mobile navigation and reveal effects
- `assets/images/magicsuccess-logo.jpg` — Canonical MagicSuccess Thailand logo v2

The `Sync YouTube Library` GitHub Action refreshes the three curated playlists every six
hours and can also be run manually. Add `YOUTUBE_API_KEY` as a repository Actions secret;
the key is never included in the generated site. Analytics-ready custom events are included,
but no external analytics provider, cookies, backend, or form submission is enabled.

## MVP features and GitHub Pages boundary

The public build includes unified in-browser search, an FAQ/prompt starter library,
verified-product catalog architecture (intentionally empty), legal/trust pages, content
governance, consent management, a branded 404, manifest/service worker basics, generated
sitemap, and unavailable states for services that need secrets.

GitHub Pages serves static files only. It cannot securely validate Google identity tokens,
set server-only sessions, query GA Data API, keep a database, or protect Admin/Member data.
`server/index.js` is a separately hosted Worker-style API boundary; it is not active merely
because it is copied into the static build. Never put its environment values in HTML or JS.

## Checks and build

```bash
npm test
npm run check
npm run build
```

`build` regenerates article pages and `sitemap.xml`, then assembles `dist/`. The site check
validates public metadata, local links, the exact FAQ completion count and prompt framework,
and asserts that the MVP contains no unverified product listing.

## Backend prerequisites (not configured)

- Google OAuth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `OAUTH_REDIRECT_URI`, and a
  strong `SESSION_SECRET`. Validate issuer, audience, nonce, state, expiry and
  `email_verified`; issue only short-lived `HttpOnly; Secure; SameSite=Lax` sessions.
- Admin: `ADMIN_EMAIL_ALLOWLIST=sakunchinnasee@gmail.com`. Authorization is evaluated on
  every server request from the verified session; the allowlist is absent from frontend JS.
- Storage: `SESSIONS` and `DB` bindings, per-user ownership checks, retention, export/delete,
  CSRF/replay controls, rate limits, immutable audit records, backup and migrations.
- Analytics: `GA_PROPERTY_ID` and `GOOGLE_SERVICE_ACCOUNT_JSON`; preserve consent and show
  real freshness. Never substitute sample KPIs.
- Newsletter: approved endpoint/token with consent, double opt-in and unsubscribe.
- Affiliate and payments: verified provider credentials only after program, compliance,
  tax, delivery, refund, webhook and privacy workflows are approved.

Before deployment, confirm the official privacy contact, OAuth consent screen/origins,
analytics retention, monitoring provider, Shopee terms and reviewer, official PPRM source,
newsletter provider and payment/tax workflow. Keep each service unavailable until its
integration and security tests pass.
