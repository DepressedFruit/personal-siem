import { WatchersConfigOptions } from '../lib/config';
import { LoggingFunction } from '../lib/logging';

export interface WatcherPluginProps {
    logger: LoggingFunction,
    options: WatchersConfigOptions,
    next: Function,
}