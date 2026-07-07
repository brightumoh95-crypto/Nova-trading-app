import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import './nova-pages.scss';

type NovaPageProps = {
    page: 'portfolio' | 'assistant' | 'strategies' | 'accounts' | 'analytics' | 'settings';
    onBuildStrategy?: () => void;
};

const strategyCards = [
    { name: 'D’Alembert Shield', risk: 'Balanced', note: 'Uses the bundled D’Alembert XML/risk flow.' },
    { name: 'Martingale Guard', risk: 'High discipline', note: 'Preserves stake-limit templates before execution.' },
    { name: 'Oscar’s Grind Max-Stake', risk: 'Risk capped', note: 'Uses existing max-stake XML strategy patterns.' },
];

const NovaMetric = ({ label, value, tone }: { label: string; value: string; tone?: string }) => (
    <article className={`nova-metric ${tone ? `nova-metric--${tone}` : ''}`}>
        <span>{label}</span>
        <strong>{value}</strong>
    </article>
);

const NovaPanel = ({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) => (
    <section className='nova-panel'>
        <div className='nova-panel__heading'>
            <span>{eyebrow}</span>
            <h2>{title}</h2>
        </div>
        {children}
    </section>
);

export const NovaExecutiveDashboard = observer(({ onBuildStrategy }: { onBuildStrategy?: () => void }) => {
    const store = useStore();
    const client = store?.client;
    const runPanel = store?.run_panel;
    const strategyCount = store?.load_modal?.dashboard_strategies?.length ?? 0;
    const accountCount = client?.account_list?.length ?? 0;
    const activeLogin = client?.loginid || localStorage.getItem('active_loginid') || 'Not connected';
    const balance = client?.balance ? `${client.balance} ${client.currency || ''}` : 'Connect account';

    return (
        <section className='nova-dashboard-hero'>
            <div className='nova-dashboard-hero__copy'>
                <span className='nova-kicker'>Nova Trading Command Center</span>
                <h1>Professional automated trading, powered by the Deriv engine.</h1>
                <p>
                    Nova keeps the original OAuth, WebSocket, Blockly strategy execution, proposals,
                    purchases, account switching, and risk-management templates intact while upgrading the
                    trading workspace into a premium dashboard.
                </p>
                <div className='nova-dashboard-hero__actions'>
                    <button type='button' onClick={onBuildStrategy}>Build strategy</button>
                    <span>{runPanel?.is_running ? 'Bot running' : 'Engine standing by'}</span>
                </div>
            </div>
            <div className='nova-dashboard-hero__glass' aria-label='Nova trading status'>
                <NovaMetric label='Active account' value={activeLogin} />
                <NovaMetric label='Balance' value={balance} tone='success' />
                <NovaMetric label='Saved strategies' value={String(strategyCount)} />
                <NovaMetric label='Discovered accounts' value={String(accountCount)} />
            </div>
        </section>
    );
});

const PortfolioPage = observer(() => {
    const store = useStore();
    const client = store?.client;
    const accounts = client?.account_list ?? [];
    return (
        <NovaPanel eyebrow='Portfolio' title='Multi-account portfolio'>
            <div className='nova-grid'>
                <NovaMetric label='Current login' value={client?.loginid || 'Not connected'} />
                <NovaMetric label='Balance' value={client?.balance ? `${client.balance} ${client.currency || ''}` : '—'} tone='success' />
                <NovaMetric label='Account mode' value={client?.is_virtual ? 'Demo' : client?.is_logged_in ? 'Real' : 'Guest'} />
            </div>
            <div className='nova-list'>
                {(accounts.length ? accounts : [{ loginid: 'Demo-ready', currency: 'USD', is_virtual: 1 }]).map((account: any) => (
                    <div className='nova-list__row' key={account.loginid}>
                        <strong>{account.loginid}</strong>
                        <span>{account.currency || 'USD'} · {account.is_virtual ? 'Demo' : 'Real'}</span>
                    </div>
                ))}
            </div>
        </NovaPanel>
    );
});

const AssistantPage = () => (
    <NovaPanel eyebrow='AI Assistant' title='Strategy co-pilot'>
        <div className='nova-assistant'>
            <p><strong>Nova AI is wired as a safe advisory layer.</strong> It can explain blocks, suggest risk checks, and prepare strategy ideas without bypassing the existing Blockly execution engine.</p>
            <div className='nova-prompt-card'>Analyze my strategy for over-risking before I run it.</div>
            <div className='nova-prompt-card'>Suggest a demo-safe version of a D’Alembert bot.</div>
            <div className='nova-prompt-card'>Explain why a proposal or purchase failed.</div>
        </div>
    </NovaPanel>
);

const StrategiesPage = ({ onBuildStrategy }: { onBuildStrategy?: () => void }) => (
    <NovaPanel eyebrow='Strategy Manager' title='Reusable strategy vault'>
        <div className='nova-card-grid'>
            {strategyCards.map(card => (
                <article className='nova-strategy-card' key={card.name}>
                    <span>{card.risk}</span>
                    <h3>{card.name}</h3>
                    <p>{card.note}</p>
                    <button type='button' onClick={onBuildStrategy}>Open in Bot Builder</button>
                </article>
            ))}
        </div>
    </NovaPanel>
);

const AccountsPage = observer(() => {
    const store = useStore();
    const client = store?.client;
    return (
        <NovaPanel eyebrow='Account Manager' title='Dynamic Deriv account discovery'>
            <div className='nova-status-stack'>
                <div><strong>OAuth:</strong> PKCE callback flow preserved.</div>
                <div><strong>Discovery:</strong> DerivWS accounts service remains the account source.</div>
                <div><strong>Switching:</strong> Existing account switcher and WebSocket regeneration remain active.</div>
                <div><strong>Session:</strong> Logout clears OAuth, local/session storage, WebSocket singleton, and cached accounts.</div>
                <div><strong>Current:</strong> {client?.loginid || 'Not connected'}</div>
            </div>
        </NovaPanel>
    );
});

const AnalyticsPage = observer(() => {
    const store = useStore();
    const runPanel = store?.run_panel;
    return (
        <NovaPanel eyebrow='Analytics' title='Execution analytics'>
            <div className='nova-grid'>
                <NovaMetric label='Bot state' value={runPanel?.is_running ? 'Running' : 'Stopped'} />
                <NovaMetric label='Contract stage' value={String(runPanel?.contract_stage || 'Not running')} />
                <NovaMetric label='Open contract' value={runPanel?.has_open_contract ? 'Yes' : 'No'} />
                <NovaMetric label='Sell requested' value={runPanel?.is_sell_requested ? 'Yes' : 'No'} />
            </div>
        </NovaPanel>
    );
});

const SettingsPage = () => (
    <NovaPanel eyebrow='Settings' title='Production controls'>
        <div className='nova-status-stack'>
            <div><strong>Brand:</strong> Nova Trading configuration is managed in <code>brand.config.json</code>.</div>
            <div><strong>OAuth:</strong> Deriv App ID and redirect URI remain environment-driven.</div>
            <div><strong>Sessions:</strong> Sensitive tokens stay in runtime browser storage; environment files are git-ignored.</div>
            <div><strong>Compatibility:</strong> Deriv API naming is retained where required by the engine.</div>
            <div><strong>Scalability:</strong> Static SPA build served from <code>dist/</code>; WebSocket work remains provider-side.</div>
        </div>
    </NovaPanel>
);

const NovaPages = observer(({ page, onBuildStrategy }: NovaPageProps) => {
    if (page === 'portfolio') return <PortfolioPage />;
    if (page === 'assistant') return <AssistantPage />;
    if (page === 'strategies') return <StrategiesPage onBuildStrategy={onBuildStrategy} />;
    if (page === 'accounts') return <AccountsPage />;
    if (page === 'analytics') return <AnalyticsPage />;
    return <SettingsPage />;
});

export default NovaPages;
