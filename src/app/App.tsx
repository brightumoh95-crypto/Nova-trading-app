import { lazy, Suspense } from 'react';
import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { cleanupUrl, handleOAuthCallback } from '@/external/deriv-core';
import ChunkLoader from '@/components/loader/chunk-loader';
import LocalStorageSyncWrapper from '@/components/localStorage-sync-wrapper';
import RoutePromptDialog from '@/components/route-prompt-dialog';
import { useAccountSwitching } from '@/hooks/useAccountSwitching';
import { useLanguageFromURL } from '@/hooks/useLanguageFromURL';
import { StoreProvider } from '@/hooks/useStore';
import { isPreviewMode, PREVIEW_BASE_PATH } from '@/utils/is-preview-mode';
import { localize, TranslationProvider } from '@deriv-com/translations';
import CoreStoreProvider from './CoreStoreProvider';
import i18nInstance from './i18n';
import './app-root.scss';

const Layout = lazy(() => import('../components/layout'));
const AppRoot = lazy(() => import('./app-root'));

/**
 * Component wrapper to handle language URL parameter
 * Uses the useLanguageFromURL hook to process language switching
 */
const LanguageHandler = ({ children }: { children: React.ReactNode }) => {
    useLanguageFromURL();
    return <>{children}</>;
};

const getRuntimeBasePath = () => {
    const configuredBasePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
    if (configuredBasePath) return configuredBasePath;
    return isPreviewMode() ? PREVIEW_BASE_PATH : undefined;
};

const getOAuthRedirectUri = () =>
    process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URL ||
    `${window.location.origin}${(getRuntimeBasePath() || '').replace(/\/$/, '')}/auth/deriv/callback`;

const updateOAuthDebug = (updates: Record<string, unknown>) => {
    if (typeof window === 'undefined') return;
    try {
        const current = JSON.parse(localStorage.getItem('nova_oauth_debug') || '{}');
        localStorage.setItem('nova_oauth_debug', JSON.stringify({ ...current, ...updates, lastUpdated: new Date().toISOString() }));
    } catch {
        localStorage.setItem('nova_oauth_debug', JSON.stringify({ ...updates, lastUpdated: new Date().toISOString() }));
    }
};

const routerBasename = getRuntimeBasePath();

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route
            path='/'
            element={
                <Suspense
                    fallback={<ChunkLoader message={localize('Please wait while we connect to the server...')} />}
                >
                    <TranslationProvider defaultLang='EN' i18nInstance={i18nInstance}>
                        <LanguageHandler>
                            <StoreProvider>
                                <LocalStorageSyncWrapper>
                                    <RoutePromptDialog />
                                    <CoreStoreProvider>
                                        <Layout />
                                    </CoreStoreProvider>
                                </LocalStorageSyncWrapper>
                            </StoreProvider>
                        </LanguageHandler>
                    </TranslationProvider>
                </Suspense>
            }
        >
            {/* All child routes will be passed as children to Layout */}
            <Route index element={<AppRoot />} />
            <Route path='auth/deriv/callback' element={<AppRoot />} />
            {/* App Builder embeds the template at /preview — render the same app shell */}
            <Route path='preview' element={<AppRoot />} />
        </Route>
    ),
    { basename: routerBasename }
);

/**
 * Main App component
 *
 * Responsibilities:
 * 1. OAuth callback handling (via vendored deriv-core handleOAuthCallback)
 * 2. Account switching from URL (via useAccountSwitching hook)
 * 3. Router provider setup
 */
function App() {
    // Handle account switching via URL parameter
    useAccountSwitching();

    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const isCallbackPath = window.location.pathname.endsWith('/auth/deriv/callback');
        updateOAuthDebug({
            redirectUri: getOAuthRedirectUri(),
            callbackReceived: isCallbackPath || urlParams.has('code'),
            codeReceived: urlParams.has('code'),
            callbackUrl: window.location.href,
            callbackPath: window.location.pathname,
            callbackState: urlParams.get('state') || '',
        });
        if (!urlParams.has('code')) return;

        const handleCallback = async () => {
            try {
                const authInfo = await handleOAuthCallback(window.location.href, {
                    clientId: process.env.NEXT_PUBLIC_DERIV_APP_ID || '',
                    redirectUri: getOAuthRedirectUri(),
                    scopes: 'trade',
                });

                const { DerivWSAccountsService } = await import('@/services/derivws-accounts.service');
                const accounts = await DerivWSAccountsService.fetchAccountsList(authInfo.access_token);

                if (accounts && accounts.length > 0) {
                    DerivWSAccountsService.storeAccounts(accounts);
                    localStorage.removeItem('active_loginid');
                    localStorage.removeItem('account_type');
                    localStorage.removeItem('authToken');
                    updateOAuthDebug({ accountCallbackReceived: true, accountCount: accounts.length });
                } else {
                    console.error('No accounts returned after authentication');
                }
            } catch (error) {
                console.error('OAuth callback error:', error);
            } finally {
                cleanupUrl(getOAuthRedirectUri());
            }
        };

        handleCallback();
    }, []);

    return <RouterProvider router={router} />;
}

export default App;
