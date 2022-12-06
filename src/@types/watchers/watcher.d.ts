import { WatchersConfigOptions } from '../lib/config';
import { DecoderNextProps } from '../lib/decoder';
import { LoggingFunction } from '../lib/logging';

export interface WatcherPluginProps {
    logger: LoggingFunction,
    options: WatchersConfigOptions,
    next: (DecoderNextProps) => Promise<void>,
};

export interface WatcherPlugin {
    default: (WatcherPluginProps) => Promise<void>,
}