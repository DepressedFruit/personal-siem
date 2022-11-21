import { createReadStream, ReadStream } from 'fs';
import { join } from 'path';

import { ConfigFiles, SettingsConfig, WatchersConfig } from '../@types/lib/config';

async function readConfig(config: ConfigFiles): Promise<SettingsConfig | WatchersConfig[]> {
    const CHUNK_SIZE: number = 10000000;

    const stream: ReadStream = createReadStream(
        join(
            __dirname,
            '../',
            '../',
            'configs',
            `${config}.json`,
        ),
        {
            highWaterMark: CHUNK_SIZE,
        }
    );

    let configString: string[] = [];
    for await(const data of stream) {
        // CONFIG_BUFFER.push(data);
        configString = [
            ...configString,
            data.toString(),
        ];
    }

    // const str: string = new Uint8Array(CONFIG_BUFFER).
    const parsed_config = JSON.parse(configString.join());
    switch(config) {
        case 'watchers':
            return parsed_config as WatchersConfig[];
            break;

        default:
        case 'settings':
            return parsed_config as SettingsConfig;
            break;
    }
}

export {
    readConfig
};