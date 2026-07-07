# Nova Trading Deriv Template Architecture Inspection

Source ZIP: `/root/.hermes/cache/documents/doc_d19b3b7779a3_bot-app.zip`

SHA256: `8dea8bb0456eab0ab9ec1257d9f475de4c1294b6bd583e7d385aea46b4bfc94c`

Inspection date: 2026-07-07

## Project shape

- App type: Rsbuild + React + React Router SPA.
- Package name/version: `my-trading-bot` / `0.2.0`.
- Build output: `dist/`.
- Source files in ZIP: 1,634 entries.
- Primary source roots:
  - `src/app`: app bootstrap, router, OAuth callback handling, root providers.
  - `src/components`: layout, run panel, notifications, shared UI, trading modals.
  - `src/pages`: dashboard, bot builder, charts, tutorials.
  - `src/stores`: MobX application, client/account, run-panel, dashboard, strategy stores.
  - `src/external/bot-skeleton`: vendored Nova Trading/Blockly/trading engine.
  - `src/external/deriv-core`: vendored OAuth PKCE/storage/url helpers.
  - `src/services`: DerivWS account discovery and active symbol processing.
  - `src/xml`: bundled starter/risk-management strategy XML templates.

## Reusable core engine — preserve, do not duplicate

These are the core Deriv/Nova engine layers that should remain the foundation:

1. OAuth and session flow
   - `src/app/App.tsx`
   - `src/external/deriv-core/auth/oauth.ts`
   - `src/external/deriv-core/auth/storage.ts`
   - `src/components/shared` OAuth URL helpers

2. Dynamic account discovery and account switching
   - `src/services/derivws-accounts.service.ts`
   - `src/components/layout/header/account-switcher.tsx`
   - `src/stores/client-store.ts`
   - `src/hooks/useAccountSwitching.ts`

3. WebSocket connection and Deriv API singleton
   - `src/external/bot-skeleton/services/api/appId.js`
   - `src/external/bot-skeleton/services/api/api-base.ts`
   - `src/external/bot-skeleton/services/api/api-middleware.js`
   - `src/external/bot-skeleton/services/api/observables/connection-status-stream.ts`

4. Blockly strategy engine and interpreter
   - `src/external/bot-skeleton/scratch/**`
   - `src/external/bot-skeleton/services/tradeEngine/utils/interpreter.js`
   - `src/pages/bot-builder/**`

5. Strategy execution / trade lifecycle
   - `src/external/bot-skeleton/services/tradeEngine/trade/Proposal.js`
   - `src/external/bot-skeleton/services/tradeEngine/trade/Purchase.js`
   - `src/external/bot-skeleton/services/tradeEngine/trade/OpenContract.js`
   - `src/external/bot-skeleton/services/tradeEngine/trade/Sell.js`
   - `src/stores/run-panel-store.ts`
   - `src/components/run-panel/**`

6. Risk-management starter strategies and quick strategy forms
   - `src/xml/*.xml`
   - `src/external/bot-skeleton/examples/xml-examples/risk-management/**`
   - `src/pages/bot-builder/quick-strategy/**`
   - `src/constants/quick-strategies/**`

7. Charting
   - `@deriv-com/smartcharts-champion`
   - `src/adapters/smartcharts-champion/**`
   - `src/pages/chart/**`

## Branding and license constraints

- No top-level `LICENSE` file was present in the uploaded ZIP.
- Because explicit license terms are not included, Deriv package names, API endpoint names, and required technical references must be preserved where they are necessary for operation.
- User-facing brand surfaces can be changed to Nova where white-label configuration exists:
  - `brand.config.json`
  - `index.html` meta/title
  - app logo/name components
  - dashboard/header/user-facing copy
- Technical imports such as `@deriv-com/*`, OAuth hostnames, WebSocket endpoint labels, and API request semantics should remain intact unless a license or vendor instruction permits deeper replacement.

## Modification plan after inspection

- Keep all `src/external/bot-skeleton/**` trading logic intact.
- Keep OAuth/DerivWS/account services intact, only improving presentation and diagnostics if needed.
- Add Nova UI as a shell and pages around the existing app: dashboard, portfolio, AI assistant, strategy manager, account manager, analytics, settings.
- Extend navigation/tabs without removing Bot Builder, Charts, Tutorials, RunPanel, or transaction modals.
- Use brand configuration and CSS variables for Nova identity.
- Document every changed file in `NOVA_MODIFICATIONS.md`.

## Initial blockers / follow-ups

- GitHub remote was not present in the ZIP. A remote must be supplied or created before pushing.
- Contabo VPS deployment target/SSH host/path/process manager must be verified before deployment.
- Deriv App ID/redirect URI values are environment-specific and should not be committed.
