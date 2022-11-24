import { hostname } from 'os';

import { WatchersConfig } from '../@types/lib/config';
import { LoggingFunction } from '../@types/lib/logging';
import { WatcherPlugin, WatcherPluginProps } from '../@types/watchers/watcher';
import { Decoded, DecodedGroup, DecoderNextProps, DecoderRules } from '../@types/lib/decoder';
import { ActionProps } from '../@types/lib/action';

import { readConfig } from '../lib/config';
import logger from '../lib/logging';
import { initDecoder } from '../lib/decoder';
import { action } from '../lib/action';

export default async function(): Promise<void> {
    const WATCHERS_CONFIG: WatchersConfig[] = await readConfig('watchers') as WatchersConfig[];
    const LOGGER: LoggingFunction = await logger('agent');
    LOGGER.info(`Initializing Agent for ${hostname()}...`);

    LOGGER.info('Preparing rules...');
    const DECODER = await initDecoder(LOGGER);
    LOGGER.info('Preparing Actions...');
    const ACTIONS = await action();

    WATCHERS_CONFIG.forEach(async (module: WatchersConfig): Promise<void> => {
        if(module.enabled) {
            const WATCHER_LOGGER: LoggingFunction = await logger('watchers', `Watcher: ${module.name}`);
            const props: WatcherPluginProps = {
                logger: WATCHER_LOGGER,
                options: module.options,
                next: async (props: DecoderNextProps): Promise<void> => {

                    const { description, data } = props;
                    const decode: DecodedGroup[] = await DECODER.decode(description);

                    if(decode.length > 0) {
                        const actionProps: ActionProps = {
                            hostname: `${hostname()}`,
                            full_log: description,
                            origin: data,
                            groups: decode,
                        }

                        await ACTIONS(actionProps);
                    }
                },
            };
    
            try {
                const WATCHER_MAIN: WatcherPlugin = await import(`../watchers/${module.watcher}`);
                
                LOGGER.info(`Starting Watcher [${module.watcher}] for [${module.name}]`);
                await WATCHER_MAIN.default(props);
            } catch (error) {
                LOGGER.error(`${error}`);
            }
        }
    });
}