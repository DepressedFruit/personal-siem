import { WatcherPluginProps } from '../watcher';
export interface WatcherOptions {
    interval: number,
    application: string,
}

export interface WindowsEventLoggerProps extends WatcherPluginProps {
    options: WatcherOptions,
}