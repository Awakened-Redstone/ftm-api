/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import {GET, register, RequestData, targets} from "./core";
import {Twitch} from "./twitch";
import {API} from "./api";

export interface Env {
    TWITCH_AUTH: string;
    TWITCH_CLIENT_ID: string;
    // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
    // MY_KV_NAMESPACE: KVNamespace;
    //
    // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
    // MY_DURABLE_OBJECT: DurableObjectNamespace;
    //
    // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
    // MY_BUCKET: R2Bucket;
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        register(Twitch, API);
        let response, match, url = new URL(request.url), requestData: RequestData = {request: request, env: env, method: request.method, url: request.url};
        requestData.query = Object.fromEntries(url.searchParams)
        for (const {pathReg, methods, handlers} of targets) {
            if ((methods.includes(request.method.toUpperCase()) || methods.includes('ALL')) && (match = url.pathname.match(pathReg))) {
                requestData.params = match.groups
                for (const handler of handlers) {
                    if ((response = await handler(requestData)) !== undefined) return response;
                }
            }
        }
        return new Response(`Invalid ${request.method.toUpperCase()} request!`, {status: 404});
    }
};
