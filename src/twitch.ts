import {errorResponse, GET, RequestData} from "./core";
import {Env} from "./index";

async function getToken(env: Env): Promise<string> {
    const cache = caches.default;
    const tokenCache = await cache.match("https://id.twitch.tv/oauth2/token");
    if (!!tokenCache) {
        console.log("token cache")
        const json: {
            access_token?: string
            [others: string]: any
        } = await tokenCache.json();
        if (json["access_token"]) {
            return json["access_token"]
        }
    } else {
        console.log("token kv")
        const token = await env.API_DATA.get("twitch_token");
        if (token) return token;
    }
    return "";
}

async function validate(env: Env) {
    const headers = {
        headers: {
            'Authorization': `Bearer ${await getToken(env)}`,
        }
    }

    const response: Response = await fetch("https://id.twitch.tv/oauth2/validate", headers)
    if (response.status === 401) {
        const data: URLSearchParams = new URLSearchParams();
        data.append("client_id", env.TWITCH_CLIENT_ID)
        data.append("client_secret", env.TWITCH_AUTH)
        data.append("grant_type", "client_credentials")

        const init: RequestInit = {
            method: 'POST',
            body: data
        }

        let response = await fetch("https://id.twitch.tv/oauth2/token", init);
        response = new Response(response.body, response);
        response.headers.append('Cache-Control', 's-maxage=10');

        const cache = caches.default;
        // noinspection ES6MissingAwait
        cache.put("https://id.twitch.tv/oauth2/token", response.clone());
        // @ts-ignore
        // noinspection ES6MissingAwait
        env.API_DATA.put("twitch_token", (await response.json())["access_token"]);
    }
}

async function safeGet(url: string, request: RequestData) {
    let headers = {
        headers: {
            'Authorization': `Bearer ${await getToken(request.env)}`,
            'Client-Id': `${request.env.TWITCH_CLIENT_ID}`
        }
    }

    let response = await fetch(url, headers);
    if (response.status === 401) {
        await validate(request.env);

        headers = {
            headers: {
                'Authorization': `Bearer ${await getToken(request.env)}`,
                'Client-Id': `${request.env.TWITCH_CLIENT_ID}`
            }
        }

        response = await fetch(url, headers);
    }
    return response;
}

export class Twitch {
    @GET("/v2/twitch/user/:user")
    async users(request: RequestData): Promise<Response> {
        // @ts-ignore
        const user = request.params.user;
        const userValidate = RegExp("^[a-zA-Z\\d]\\w{0,24}$");
        let search = "";

        if (!request.query || !request.query.type) {
            if (parseInt(user)) search = `?id=${user}`;
            else if (user.match(userValidate)) search = `?login=${user}`;
            else return errorResponse("Invalid user inserted!", 400);
        } else {
            if (request.query.type === "login" || request.query.type === "user" && user.match(userValidate)) search = `?login=${user}`;
            else if (request.query.type === "id") search = `?id=${user}`;
            else return errorResponse("Invalid search type!", 400);
        }
        const url = `https://api.twitch.tv/helix/users${search}`
        return safeGet(url, request);
    }

    @GET("/v2/twitch/badges/:id")
    async badges(request: RequestData): Promise<Response> {
        // @ts-ignore
        const id = request.params.id;
        if (!parseInt(id)) return errorResponse("Not a valid user ID!", 400);
        const url = `https://api.twitch.tv/helix/chat/badges?broadcaster_id=${id}`;
        return safeGet(url, request);
    }
}