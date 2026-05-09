# CI and Deploy Setup

Pool Cleaning Dude now has two GitHub Actions workflows:

- `.github/workflows/ci.yml` runs on pull requests and checks TypeScript, lint, the Next.js build, and the OpenNext Cloudflare bundle.
- `.github/workflows/deploy.yml` runs only on pushes to `main`, deploys with the existing `npm run cf:deploy` script, then runs `scripts/smoke.sh` against production.

## Required GitHub Secrets

Add these repository secrets in GitHub under Settings -> Secrets and variables -> Actions:

| Secret | Value |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | A scoped Cloudflare API token for deploying the `poolcleaningdude` Worker. |
| `CLOUDFLARE_ACCOUNT_ID` | `a674fb068af8a009d9efe474a27b01b1` |

Use a scoped Cloudflare token, not the Global API Key. Restrict it to the Cloudflare account above and the `poolcleaningdude.com` zone.

Recommended token permissions:

- Account -> Workers Scripts -> Edit
- Zone -> Workers Routes -> Edit

If Cloudflare rejects the deploy for missing permissions, add only the exact permission named in the Wrangler error, scoped to this account or zone.

## How To Test

1. Add the two repository secrets.
2. Open a pull request. The `CI` workflow should run without deploying.
3. Merge a no-op commit to `main` when ready to arm deployment.
4. Confirm the `Deploy` workflow runs, deploys the Worker, and passes the production smoke test.

The smoke test checks:

- `/`
- `/contact-us`
- `/services`
- `/areas/wayne-pa`
- `/pool-opening`

The route `/services/weekly-maintenance` is not currently a live PCD URL, so the smoke test uses `/pool-opening` as the fifth production route.

## Rollback

If a deploy succeeds but production needs to be rolled back, use Wrangler from a machine with Cloudflare credentials:

```bash
npx wrangler rollback --name poolcleaningdude
```

Then rerun the smoke test:

```bash
SMOKE_BASE_URL=https://poolcleaningdude.com bash scripts/smoke.sh
```
