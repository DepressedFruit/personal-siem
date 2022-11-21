import { WatcherPluginProps } from '../watcher';
export interface WatcherOptions {
    file: string,
}

export interface LogFilePluginProps extends WatcherPluginProps {
    options: WatcherOptions,
}