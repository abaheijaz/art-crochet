# crochet-and-art-web

A personal gallery site to document, display, and share crochet projects and art patterns.

## Cloudflare Pages deployment

This workspace is configured for manual Cloudflare Pages deploys with Wrangler.

### Commands

- `npm run cf:build` builds the production site into `dist/art-crochet/browser`.
- `npm run cf:dev` builds the site and serves it locally through Cloudflare Pages.
- `npm run cf:deploy` builds and deploys the site to the Cloudflare Pages project `art-crochet`.

### First deployment

1. Log in once if needed with `npx wrangler login`.
2. Create the Pages project in Cloudflare if it does not already exist.
3. Run `npm run cf:deploy` from the repo root.

SPA route refreshes are handled through the `public/_redirects` file, which is copied into the Pages output during the Angular build.
