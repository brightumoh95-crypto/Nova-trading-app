# Nova Trading Modification Log

This document records every project-level modification made after the initial Deriv template architecture inspection.

## Files added

- `ARCHITECTURE_INSPECTION.md`
  - Records ZIP hash, architecture map, reusable engine components, license/branding constraints, and modification plan.
- `.gitignore`
  - Excludes `node_modules/`, build outputs, coverage, and environment files including `.env.production`.
- `src/pages/nova/nova-pages.tsx`
  - Adds premium Nova product surfaces: portfolio, AI assistant, strategy manager, account manager, analytics, settings, and executive dashboard hero.
  - Reads existing MobX stores and Deriv/account/run-panel state; does not create a duplicate trading engine.
- `src/pages/nova/nova-pages.scss`
  - Adds mobile-first premium trading-platform styling, glass panels, smooth hover motion, responsive grids.

## Files changed

- `brand.config.json`
  - Rebrands white-label fields from placeholder/Deriv-facing app name to Nova Trading.
  - Keeps Deriv OAuth/WebSocket endpoint configuration intact because those are required provider integration points.
- `index.html`
  - Updates title, meta description, OpenGraph title/description, and favicon to Nova Trading branding.
- `src/constants/bot-contents.ts`
  - Extends tab IDs and tab indices to include portfolio, AI assistant, strategies, accounts, analytics, and settings.
- `src/pages/main/main.tsx`
  - Adds lazy-loaded Nova pages to the existing tab system.
  - Preserves Dashboard, Bot Builder, Charts, Tutorials, RunPanel, chart modal, trading view modal, and all existing bot execution surfaces.
- `src/pages/dashboard/dashboard.tsx`
  - Adds the Nova executive dashboard hero above the original load/build bot panel.
  - Keeps the original dashboard cards, announcements, info panel, and onboarding tour.
- `src/app/app-content.jsx`
  - Changes the account initialization loading copy to Nova Trading while preserving API initialization and provider logic.
- `src/utils/site-config.ts`
  - Changes generic website display constants to Nova Trading.

## Engine preservation proof

No modifications were made to these core trading engine paths:

- `src/external/bot-skeleton/services/tradeEngine/**`
- `src/external/bot-skeleton/scratch/**`
- `src/external/bot-skeleton/services/api/appId.js`
- `src/external/bot-skeleton/services/api/api-base.ts`
- `src/external/deriv-core/auth/oauth.ts`
- `src/services/derivws-accounts.service.ts`

The Nova UI reads existing stores and routes users back into the existing Bot Builder rather than rewriting strategy execution.

## Production notes

- Deriv App ID, redirect URIs, and optional Google Drive credentials must be configured at deployment time via environment variables.
- `.env.production` exists locally from the uploaded template but is ignored and not committed.
- No live-trading gates were removed or bypassed.
