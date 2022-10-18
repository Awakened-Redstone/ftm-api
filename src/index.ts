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
        //Code from itty-router
        const regex = RegExp(`^${('' + path)
            .replace(/(\/?)\*/g, '($1.*)?')                             // trailing wildcard
            .replace(/(\/$)|((?<=\/)\/)/, '')                           // remove trailing slash or double slash from joins
            .replace(/:(\w+)(\?)?(\.)?/g, '$2(?<$1>[^/]+)$2$3')         // named params
            .replace(/\.(?=[\w(])/, '\\.')                              // dot in path
            .replace(/\)\.\?\(([^\[]+)\[\^/g, '?)\\.?($1(?<=\\.)[^\\.') // optional image format
        }/*$`)

        if (targetPaths.includes(regex)) {
            const t = targets.find(value => value.pathReg === regex);
            if (t == undefined) {
                error("Target path cache doesn't match target list! Possible unauthorized modification of the API!")
                return;
            }

            if (t.function !== descriptor.value) {
                error("Illegal configuration! Multiple functions set to process the same path!")
            }

            for (const method of methods) {
                if (t.methods.includes(method.toUpperCase())) {
                    error(`Target path "${path.toString()}" already has method "${method.toString().toUpperCase()}" handled! Skipping!`)
                    continue;
                } else {
                    t.methods.push(method);
                }
            }
        }

        targets.push({pathReg: regex, methods: methods, function: descriptor.value})
    }
}

function GET(path: string) {
    return method(path, "GET");
}

function HEAD(path: string) {
    return method(path, "HEAD");
}

function POST(path: string) {
    return method(path, "POST");
}

function PUT(path: string) {
    return method(path, "PUT");
}

function DELETE(path: string) {
    return method(path, "DELETE");
}

function CONNECT(path: string) {
    return method(path, "CONNECT");
}

function OPTIONS(path: string) {
    return method(path, "OPTIONS");
}

function TRACE(path: string) {
    return method(path, "TRACE");
}

function PATCH(path: string) {
    return method(path, "PATCH");
}

function ALL(path: string) {
    return method(path, "ALL");
}

function info(...data: any[]) {
    const newData: any[] = ["FTM API [INFO]: "];
    newData.push(data);
    console.log(newData);
}

function warn(...data: any[]) {
    const newData: any[] = ["FTM API [WARN]: "];
    newData.push(data);
    console.warn(newData);
}

function error(...data: any[]) {
    const newData: any[] = ["FTM API [ERROR]: "];
    newData.push(data);
    console.error(newData);
}

class DummyClass {
    @GET("/helloworld")
    helloWorld(request: Request): Response {
        return new Response("Hello world!");
    }


}

