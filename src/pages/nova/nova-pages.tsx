import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import './nova-pages.scss';

type NovaPageProps = {
    page: 'portfolio' | 'assistant' | 'strategies' | 'accounts' | 'analytics' | 'settings';
    onBuildStrategy?: () => void;
};

const strategyCards = [
    { name: 'D’Alembert Shield', risk: 'Balanced', note: 'A steady strategy template for controlled stake progression.' },
    { name: 'Martingale Guard', risk: 'High discipline', note: 'A guided strategy template with clear stake limits before launch.' },
    { name: 'Oscar’s Grind Max-Stake', risk: 'Risk capped', note: 'A disciplined template designed around capped exposure.' },
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
                    Build, test, and manage automated trading strategies from a polished workspace designed
                    for clear account control, faster setup, and safer demo-first strategy practice.
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
            <p><strong>Nova AI helps you plan with discipline.</strong> It can explain strategy blocks, suggest risk checks, and prepare demo-safe trading ideas before you run them.</p>
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
        <NovaPanel eyebrow='Account Manager' title='Connected trading accounts'>
            <div className='nova-status-stack'>
                <div><strong>Account access:</strong> Log in securely with Deriv to view eligible trading accounts.</div>
                <div><strong>Discovery:</strong> Nova Trading lists the accounts available to your profile after login.</div>
                <div><strong>Switching:</strong> Choose the account you want to prepare, test, or run strategies with.</div>
                <div><strong>Session:</strong> Logging out clears this browser session on the current device.</div>
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
    <NovaPanel eyebrow='Settings' title='Workspace preferences'>
        <div className='nova-status-stack'>
            <div><strong>Brand:</strong> Nova Trading keeps your workspace focused and easy to navigate.</div>
            <div><strong>Login:</strong> Connect securely with Deriv when you are ready to manage accounts.</div>
            <div><strong>Sessions:</strong> You can log out at any time to clear the active browser session.</div>
            <div><strong>Practice first:</strong> Use demo accounts to test every strategy before considering real-money trading.</div>
            <div><strong>Control:</strong> Review risk settings, account mode, and strategy status before each run.</div>
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
