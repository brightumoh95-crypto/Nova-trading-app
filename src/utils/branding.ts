import brandConfig from '../../brand.config.json';

// Candidate logo paths, in priority order. Respect NEXT_PUBLIC_BASE_PATH so
// subpath deployments such as /nova-staging load the real public/logo asset
// instead of falling back to the letter badge after probing the domain root.
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
const withBasePath = (assetPath: string) => `${basePath}${assetPath}` || assetPath;
export const LOGO_CANDIDATES = ['/logo.png', '/logo.jpg', '/logo.jpeg', '/logo.webp'].map(withBasePath);

/**
 * Resolves the partner app name. The BFF injects NEXT_PUBLIC_DERIV_APP_NAME into
 * .env.production at deploy time (the same var the Next.js templates read); falls back
 * to brand.config.json platform.name, then a sensible default. The live App Builder
 * preview name (PREVIEW_BRANDING) is handled separately via the preview-app-name store.
 */
export function getAppName(): string {
    return process.env.NEXT_PUBLIC_DERIV_APP_NAME || brandConfig?.platform?.name || 'Nova Trading';
}
