import { SettingsConfig } from './@types/lib/config';

import { readConfig } from './lib/config';
import agent from './mode/agent';

async function main(args: string[]): Promise<void> {
    const SETTINGS_CONFIG: SettingsConfig = await readConfig('settings') as SettingsConfig;
    switch(SETTINGS_CONFIG.mode) {
        case 'manager':
            // For the future.
            console.log('Manager mode.');
            break;
        
        case 'pooler':
            // For the future.
            console.log('Pooler mode.');
            break;
        
        default:
        case 'agent':
            agent();
            break;
    }
}

if(require.main === module) {
    const args: string[] = process.argv.slice(2);
    main(args);
}