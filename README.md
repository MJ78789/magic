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
