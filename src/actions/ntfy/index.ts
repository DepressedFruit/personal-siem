import { NtfyActionPluginProps } from '../../@types/actions/ntfy';

export default async function({
    hostname,
    action,
    decoded,
    logger,
}: NtfyActionPluginProps): Promise<void> {
    const {
        url,
        topic,
        auth,
    } = action.options;

    const serviceUrl: string = `${url}/${topic}`;
    let headers: RequestInit['headers'] = {};
    if(auth) {
        const authBuffer: Buffer = Buffer.from(`${auth.user}:${auth.password}`);
        const base64Auth = authBuffer.toString('base64');
        headers = {
            'Authorizaton': `Basic ${base64Auth}`
        };
    }

    try {
        const request = await fetch(serviceUrl, {
            method: 'POST',
            headers,
            body: `[${hostname}] ${decoded.description}`,
        });

        const requestJson = await request.json();
    } catch (err) {
        logger.error(`[ntfy] ${err}`)
    }
}