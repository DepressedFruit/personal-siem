import { join } from 'path';

import { read } from './file';

import { Action, ActionObj, ActionPluginProps, ActionProps, ProcessActionProps } from "../@types/lib/action";
import { Decoded, DecodedGroup } from '../@types/lib/decoder';

let actions: ActionObj[] = [];

async function getActions(): Promise<ActionObj[]> {
    const actionsFile: string = join(
        __dirname,
        '../',
        '../',
        'configs',
        'actions.json',
    );

    const actionsFileString: string = await read(actionsFile);
    let parsedActions: Action[] = JSON.parse(actionsFileString);
    parsedActions = parsedActions.filter(action => action.enabled);

    let allActions: ActionObj[] = [];
    for(let i = 0; i < parsedActions.length; i++) {
        const actionPlugin = await import(`../actions/${parsedActions[i].action}`);
        allActions = [
            ...allActions,
            {
                action: parsedActions[i],
                call: actionPlugin.default,
            }
        ];
    }

    return allActions;
}

export async function action(): Promise<Function> {
    actions = await getActions();
    return async (actionProps: ActionProps): Promise<void> => {
        const {
            hostname,
            full_log,
            origin,
            groups,
            logger,
        } = actionProps;

        actions.forEach(async (actionObj: ActionObj) => {
            groups.forEach(async (group: DecodedGroup) => {
                const processActionProps: ProcessActionProps = {
                    action: actionObj,
                    hostname,
                    full_log,
                    origin,
                    logger,
                    group,
                };

                await processAction(processActionProps);
            });
        });
    };
};

async function processAction(props: ProcessActionProps): Promise<void> {
    const {
        action: actionObj,
        hostname,
        full_log,
        origin,
        logger,
        group,
    } = props;

    group.decoded.forEach(async (decode: Decoded) => {
        const minimumLevel: number = (actionObj.action.level)? actionObj.action.level : 1;
        if(decode.level >= minimumLevel) {
            const ACTION_MAIN = actionObj.call;

            const pluginProps: ActionPluginProps = {
                action: actionObj.action,
                logger,
                hostname,
                full_log,
                origin,
                group: {
                    id: group.group,
                    name: group.name,
                },
                decoded: decode,
            };

            await ACTION_MAIN(pluginProps);
        }
    });
}