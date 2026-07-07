# Nova Trading Verification Report

## Environment

- Node used by runner: `v24.15.0`
- Package required engine: `20.x`
- npm used by runner: `11.12.1`

## Commands executed

1. `python3 -m json.tool brand.config.json`
   - Result: passed; brand config is valid JSON.

2. `npm install --legacy-peer-deps`
   - Result: completed.
   - Notes: npm reported Node engine warning because the package declares Node `20.x` while this runner uses Node `24.15.0`.
   - npm audit summary from install: 27 vulnerabilities reported by dependency tree: 10 moderate, 17 high. No `npm audit fix --force` was applied because that can introduce breaking changes to the Deriv template engine.

3. `npm run type-check`
   - Initial result: failed on `src/pages/nova/nova-pages.tsx` because `contract_stage` can be number|string.
   - Fix applied: cast displayed contract stage to `String(...)`.
   - Final result: passed.

4. `npm run build`
   - Result: passed.
   - Output directory: `dist/`
   - Build warning retained from upstream/template Sass: adjacent compound selector deprecation in `src/components/shared_ui/input/input.scss`.
   - Rsbuild warnings retained from upstream/template config: package module type and deprecated `source.alias` config.

5. `npm test -- --runInBand`
   - Initial result: 30 suites passed, 1 suite failed.
   - Failure reason: `LogoMark` tests still expected Deriv display text/letter after Nova rebrand.
   - Fix applied: update expectations to `Nova Trading` and fallback badge `N`.
   - Final result: 31 test suites passed; 340 tests passed; 1 todo; 341 total tests.
   - Console warnings/errors remain from existing tests: React `act(...)` warnings, jsdom navigation not implemented, React Router future flags, and mocked translation redirect fallback. They did not fail the suite.

6. Local dev HTTP smoke check
   - Command: `npm run dev -- --host 0.0.0.0`
   - Port proof: `0.0.0.0:4003` listening under `rsbuild-node`.
   - `curl -I http://127.0.0.1:4003/` returned `HTTP/1.1 200 OK`.
   - HTML contained Nova title/meta copy and loaded `/static/js/index.js` plus `/static/css/index.css`.
   - Browser navigation timed out after 60 seconds in the automation harness, likely due external/client initialization scripts; raw HTTP service response was verified.

## Engine preservation verification

Core Deriv trading engine paths were not modified:

- `src/external/bot-skeleton/services/tradeEngine/**`
- `src/external/bot-skeleton/scratch/**`
- `src/external/bot-skeleton/services/api/appId.js`
- `src/external/bot-skeleton/services/api/api-base.ts`
- `src/external/deriv-core/auth/oauth.ts`
- `src/services/derivws-accounts.service.ts`

Nova pages consume existing stores and route into existing Bot Builder execution flow; no new direct trade submission path was added.

## Remaining deployment blockers

Deployment to Contabo VPS and GitHub push require user-provided/confirmed targets:

- GitHub repository URL or permission to create one under the authenticated account.
- Contabo VPS SSH target/user/path.
- Domain/subdomain and reverse proxy preference.
- Production Deriv OAuth app ID/redirect URI configuration.
- Confirmation whether to deploy staging first or production.
