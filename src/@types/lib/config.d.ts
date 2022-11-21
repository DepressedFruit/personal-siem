export type ConfigFiles = 'settings' | 'watchers';

export type ConfigMode = 'agent' | 'pooler' | 'manager';
export interface SettingsConfig {
    mode: ConfigMode,
};

export type WatchersConfigOptions = {
    [name: string]: any,
} | null | undefined;

export interface WatchersConfig {
    name: string,
    enabled: boolean,
    watcher: string,
    options: WatchersConfigOptions,
};