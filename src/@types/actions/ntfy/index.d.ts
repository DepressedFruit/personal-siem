import { Action, ActionPluginProps } from '../../lib/action';

export interface NtfyAction extends Action {
    options: EmailActionOptions,
}

export interface NtfyActionPluginProps extends ActionPluginProps {
    action: NtfyAction,
}

export interface NtfyActionOptions {
    url: string,
    topic: string,
    auth?: {
        user: string,
        password: string,
    },
}