import {Env} from "./index";

export type Fetch = {
    pathReg: RegExp;
    methods: string[];
    handlers: ((request: RequestData) => Response | Promise<Response>)[];
};

export type Obj = {
    [propName: string]: string
}

export interface RequestData {
    request: Request
    env: Env
    method: string
    params?: Obj
    query?: Obj
    url: string
}

export const targets: Fetch[] = [];
export const targetPaths: RegExp[] = [];

export function register(...clazz: any[]) {
}

export const defaultHeaders = {
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    }
}

export function stringify(json: any): string {
    return JSON.stringify(json);
}

export function response(json: any): Response {
    return new Response(stringify(json), defaultHeaders);
}

export function errorResponse(message: string, code: number, data: any): Response {
    return new Response(errorStr(message, code, data),
        {status: code, headers: defaultHeaders.headers});
}

export function errorJson(message: string, code: number, data: any): Object {
    return {"error": {"message": message, "data": data, "code": code}}
}

export function errorStr(message: string, code: number, data: any): string {
    return stringify(errorJson(message, code, data))
}

export function CUSTOM(path: string, ...methods: string[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        logDebug(`Adding handler for path "${path.toString()}" for methods ${JSON.stringify(methods)}`)

        //Code from itty-router
        const regex = RegExp(`^${('' + path)
            .replace(/(\/?)\*/g, '($1.*)?')                             // trailing wildcard
            .replace(/(\/$)|((?<=\/)\/)/, '')                           // remove trailing slash or double slash from joins
            .replace(/:(\w+)(\?)?(\.)?/g, '$2(?<$1>[^/]+)$2$3')         // named params
            .replace(/\.(?=[\w(])/, '\\.')                              // dot in path
            .replace(/\)\.\?\(([^\[]+)\[\^/g, '?)\\.?($1(?<=\\.)[^\\.') // optional image format
        }/*$`);

        if (targetPaths.includes(regex)) {
            const t = targets.find(value => value.pathReg === regex);
            if (t == undefined) {
                logError("Target path cache doesn't match target list! Possible unauthorized modification of the API!")
                return;
            }

            if (!t.handlers.includes(descriptor.value)) {
                t.handlers.push(descriptor.value);
            }

            for (const method of methods) {
                if (t.methods.includes(method.toUpperCase())) {
                    logError(`Target path "${path.toString()}" already has method "${method.toString().toUpperCase()}" handled! Skipping!`)
                    continue;
                } else {
                    t.methods.push(method);
                }
            }
        }

        targetPaths.push(regex);
        targets.push({pathReg: regex, methods: methods, handlers: [descriptor.value]})
    }
}

export function GET(path: string) {
    return CUSTOM(path, "GET");
}

export function HEAD(path: string) {
    return CUSTOM(path, "HEAD");
}

export function POST(path: string) {
    return CUSTOM(path, "POST");
}

export function PUT(path: string) {
    return CUSTOM(path, "PUT");
}

export function DELETE(path: string) {
    return CUSTOM(path, "DELETE");
}

export function CONNECT(path: string) {
    return CUSTOM(path, "CONNECT");
}

export function OPTIONS(path: string) {
    return CUSTOM(path, "OPTIONS");
}

export function TRACE(path: string) {
    return CUSTOM(path, "TRACE");
}

export function PATCH(path: string) {
    return CUSTOM(path, "PATCH");
}

export function ALL(path: string) {
    return CUSTOM(path, "ALL");
}

export function logDebug(data: any) {
    console.info("FTM API [DEBUG]: ", data);
}

export function logInfo(data: any) {
    console.info("FTM API [INFO]: ", data);
}

export function logWarn(data: any) {
    console.warn("FTM API [WARN]: ", data);
}

export function logError(data: any) {
    console.info("FTM API [ERROR]: ", data);
}
