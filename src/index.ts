/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
    // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
    // MY_KV_NAMESPACE: KVNamespace;
    //
    // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
    // MY_DURABLE_OBJECT: DurableObjectNamespace;
    //
    // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
    // MY_BUCKET: R2Bucket;
}

type Fetch = {
    pathReg: RegExp;
    methods: string[];
    function: (request: Request) => Response;
}

const targets: Fetch[] = []
const targetPaths: RegExp[] = []

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const path = new URL(request.url).pathname;
        for (const target of targets) {
            if ((target.methods.includes(request.method.toUpperCase()) || target.methods.includes('ALL')) && path.match(target.pathReg)) {
                return target.function(request)
            }
        }
        return new Response(`Invalid ${request.method.toUpperCase()} request!`);
    }
};

function method(path: string, ...methods: string[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const regex = RegExp(`^${('' + path)
            .replace(/(\/?)\*/g, '($1.*)?')                             // trailing wildcard
            .replace(/(\/$)|((?<=\/)\/)/, '')                           // remove trailing slash or double slash from joins
            .replace(/:(\w+)(\?)?(\.)?/g, '$2(?<$1>[^/]+)$2$3')         // named params
            .replace(/\.(?=[\w(])/, '\\.')                              // dot in path
            .replace(/\)\.\?\(([^\[]+)\[\^/g, '?)\\.?($1(?<=\\.)[^\\.') // optional image format
        }/*$`)

        if (targetPaths.includes(regex)) {
            targets.find(value => value.pathReg === regex).method
        }

        targets.push({pathReg: regex, method: "GET", "function": descriptor.value})
    }
}

function get(path: string) {
    return method(path, "GET");
}

function post(path: string) {
    return method(path, "POST");
}

function put(path: string) {
    return method(path, "PUT");
}

function remove(path: string) {
    return method(path, "REMOVE");
}

function options(path: string) {
    return method(path, "OPTIONS");
}

class DummyClass {
    @get("/helloworld")
    test(request: Request): Response {
        return new Response("Hello world!");
    }
}

