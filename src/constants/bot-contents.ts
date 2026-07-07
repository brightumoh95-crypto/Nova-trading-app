type TTabsTitle = {
    [key: string]: string | number;
};

type TDashboardTabIndex = {
    [key: string]: number;
};

export const tabs_title: TTabsTitle = Object.freeze({
    WORKSPACE: 'Workspace',
    CHART: 'Chart',
});

export const DBOT_TABS: TDashboardTabIndex = Object.freeze({
    DASHBOARD: 0,
    BOT_BUILDER: 1,
    CHART: 2,
    TUTORIAL: 3,
    PORTFOLIO: 4,
    AI_ASSISTANT: 5,
    STRATEGIES: 6,
    ACCOUNTS: 7,
    ANALYTICS: 8,
    SETTINGS: 9,
});

export const MAX_STRATEGIES = 10;

export const TAB_IDS = [
    'id-dbot-dashboard',
    'id-bot-builder',
    'id-charts',
    'id-tutorials',
    'id-nova-portfolio',
    'id-nova-ai-assistant',
    'id-nova-strategies',
    'id-nova-accounts',
    'id-nova-analytics',
    'id-nova-settings',
];

export const DEBOUNCE_INTERVAL_TIME = 500;
