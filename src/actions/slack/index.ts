import request from 'request';

import { ActionPluginProps } from "../../@types/lib/action";

export default async function({
    action,
    decoded
}: ActionPluginProps): Promise<void> {
    const data = {
        blocks: [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `personal-siem: ${decoded.description}`,
                },
            },
        ],
    };

    const {
        url,
    } = action.options;

    request.post({
        url,
        form: JSON.stringify(data),
    }, (err, response, body) => {});
}