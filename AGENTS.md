# Pool Cleaning Dude (PCD) — Agent Instructions

> Read by both Claude Code and Codex. CLAUDE.md just `@`-imports this file.

## What This Is
**Pool Cleaning Dude** — website at `poolcleaningdude.com`. The **maintenance/service sub-brand** of Tri-State Aquatic Solutions. Voice is informal, friendly, no-nonsense — "your pool guy, not a corporation." No contracts, honest pricing, local. **The opposite of TSAS's premium/professional positioning.**

Built with **Next.js 16 + Tailwind 4**, deployed to **Cloudflare Workers** via `@opennextjs/cloudflare` (migrated off Vercel 2026-05-06 after Brandon cancelled Vercel). Replaced the old GoHighLevel funnel site.

## Target Market
- **Primary:** Main Line PA — Gladwyne, Villanova, Haverford, Bryn Mawr, Ardmore, Radnor, Wayne, Berwyn, Malvern, West Chester, Newtown Square, Media, Glen Mills, Chadds Ford
- **Secondary:** Northern Delaware — Hockessin, Greenville, Centreville, Montchanin, Wilmington, Pike Creek, Newark, Yorklyn
- Majority of revenue expected from Main Line PA

## Stack
- **Next.js 16** + **Tailwind CSS 4**
- **Cloudflare Workers** deploy via `@opennextjs/cloudflare` (worker name: `poolcleaningdude`, account `a674fb068af8a009d9efe474a27b01b1` / Mcrbrandon@gmail.com)
- **GitHub:** `https://github.com/brandonbot67/poolcleaningdude`
- **DNS:** Cloudflare nameservers (`scott.ns.cloudflare.com`, `samara.ns.cloudflare.com`); zone ID `53a762f715b8d3b3667b23601281ecf7`. Apex + www attached as Workers Custom Domains — DNS records auto-managed by Cloudflare. **Do not manually edit the apex/www records.**
- **Workers URL:** `https://poolcleaningdude.poolops-bryce.workers.dev` (preview)
- **Secrets on Worker:** `OPENROUTER_API_KEY`, `ANTHROPIC_API_KEY` (set via `wrangler secret put`)
- **GHL sub-account (PCD):** location `GRCLPh6B7KwWCf8PRIUt`
- **GHL login:** `brandonbot67@gmail.com` (NOT `brandon@boothlaunchpad.com` — that has no MX records)

## Analytics (PCD-specific, NOT shared with TSAS)
- **PostHog:** `phc_coeTLrzdu6Sa1QamyXR3ysiKdlagXCT322TPjRDDxUU`
- **GTM:** `GTM-WK69CW77`
- **Meta Pixel:** `1450089306162928` (Pool Cleaning Dude Event Data)
- **GSC:** Verified at `sc-domain:poolcleaningdude.com`, sitemap submitted

## Pages (27 total)
Homepage, services, contact-us, pool-opening, about, 22 area pages.

## Commands
```bash
npm run dev          # Next dev server
npm run build        # Production build (Next.js only)
npm run start        # Production server
npm run lint         # ESLint
npm run cf:build     # OpenNext build for Cloudflare Workers
npm run cf:preview   # Local preview of the Worker bundle (wrangler dev)
npm run cf:deploy    # Deploy to Cloudflare Workers (needs CLOUDFLARE_API_TOKEN env)
```

## Deploy
```bash
export CLOUDFLARE_API_TOKEN=...   # from ~/.zshrc
export CLOUDFLARE_ACCOUNT_ID=a674fb068af8a009d9efe474a27b01b1
npm run cf:build && npm run cf:deploy
```

### CI / Deploy
- Pull requests run `.github/workflows/ci.yml`: `npx tsc --noEmit`, `npm run lint`, `npm run build`, and `npm run cf:build`.
- Pushes to `main` run `.github/workflows/deploy.yml`: `npm run cf:build`, `npm run cf:deploy`, then `scripts/smoke.sh` against `https://poolcleaningdude.com`.
- Required GitHub Actions secrets are documented in `docs/CI-SETUP.md`.
- This configures deploy automation only. Do not run `npm run cf:deploy` unless the task explicitly calls for a real deploy.
- Reusable template extracted from this PCD pattern: `~/shared-brain/templates/cf-workers-ci/`.

## Key files
- `src/lib/config.ts` — site config (phone, address, 22 areas, 6 services, testimonials)
- `src/lib/schema.ts` — JSON-LD generators (LocalBusiness, Service, Breadcrumb)
- `src/lib/areas.ts` — 22 area pages with unique content per location
- `src/components/Analytics.tsx` — GTM, Meta Pixel, PostHog (all PCD-specific)
- `src/components/ContactForm.tsx` — Form → `/api/contact` → GHL upsert
- `src/app/api/contact/route.ts` — GHL contact upsert
- `next.config.ts` — redirects + security headers + OpenNext dev hook
- `wrangler.jsonc` — Cloudflare Worker config (compatibility flags, asset binding)
- `open-next.config.ts` — OpenNext Cloudflare adapter config
- `CONTEXT.md` (4.3K) — living project brain. **Read first.**

## URL conventions (DO NOT change)
- `/contact-us` not `/contact` (matches old site, preserves SEO)
- `/pool-opening` stays
- `/import` (GHL artifact) 301-redirects to `/`
- Dynamic area routes: `/areas/[slug]` with `generateStaticParams` for SSG

## Brand voice rules
- "Your pool guy, not a corporation" — informal
- No contracts, honest pricing emphasis
- Site says "Main Line PA & Northern Delaware" — NEVER "Tri-State" branding (different sub-brand)
- Pool-copy-review gate: every copy change goes through CPO + inground owner + above-ground owner voices

## Autonomy
| Action | Without asking? |
|---|---|
| Edit local components/copy | YES (after pool-copy-review pass) |
| Push to GitHub feature branch | YES |
| Deploy to Cloudflare (`npm run cf:deploy`) | YES; pushes to `main` now auto-deploy via GitHub Actions after CI passes |
| Add new area page | YES if pattern matches existing 22 |
| Change analytics IDs | NO — would lose attribution |
| Modify GHL contact API | YES locally + deploy |
| Touch DNS for `poolcleaningdude.com` apex/www | NO — managed by Workers Custom Domain |

## What NOT to do
- Don't add "Tri-State" branding (different sub-brand positioning)
- Don't use `posthog-js` inline snippet (caused hydration crash; use the npm package)
- Don't POST contact form directly to GHL from client (PII in URL breaks Meta Pixel compliance) — keep the API-route pattern
- Don't break the URL conventions above (SEO equity)

## Open loops
- Pool photos / hero images (need from Brandon)
- Design polish — site is functional but visually basic
- GitHub Actions auto-deploy is wired on push to `main`; reusable sibling-repo template lives at `~/shared-brain/templates/cf-workers-ci/`
- Add `Lead` event tracking on form submit (code exists, needs testing)
- Consider GA4 property via GTM
- **Marlo created spring lead-gen asset set 2026-03-27** — 1 FB concept with A/B hooks targeting "DIY-Tired Dave," $65/visit no-contract positioning. Saved at `~/.openclaw/workspaces/marlo/memory/2026-03-27.md`. Awaits Brandon GO.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
