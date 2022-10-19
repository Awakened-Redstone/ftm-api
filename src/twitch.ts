import {GET, RequestData} from "./core";

export class Twitch {
    @GET("/v2/twitch/user/:user")
    async users(request: RequestData): Promise<Response> {
        const headers = {
            headers: {
                'Authorization': `Bearer ${request.env.TWITCH_AUTH}`,
                'Client-Id': `${request.env.TWITCH_CLIENT_ID}`
            }
        }

        // @ts-ignore
        const user = request.params.user;
        const userValidate = RegExp("^[a-zA-Z\\d]\\w{0,24}$");
        let search = "";

        if (!request.query || !request.query.type) {
            if (parseInt(user)) search = `?id=${user}`;
            else if (user.match(userValidate)) search = `?login=${user}`;
            else return new Response("Invalid user inserted!", {status: 400}); //TODO: json
        } else {
            if (request.query.type === "login" || request.query.type === "user" && user.match(userValidate)) search = `?login=${user}`;
            else if (request.query.type === "id") search = `?id=${user}`;
            else return new Response("Invalid search type!", {status: 400}); //TODO: json
        }
        const url = `https://api.twitch.tv/helix/users${search}`
        return fetch(url, headers);
    }

    @GET("/v2/twitch/badges/:id")
    async badges(request: RequestData): Promise<Response> {
        const headers = {
            headers: {
                'Authorization': `Bearer ${request.env.TWITCH_AUTH}`,
                'Client-Id': `${request.env.TWITCH_CLIENT_ID}`
            }
        }

        // @ts-ignore
        const id = request.params.id;
        if (!parseInt(id)) return new Response("Not a valid user ID!", {status: 400}); //TODO: json
        const url = `https://api.twitch.tv/helix/chat/badges?broadcaster_id=${id}`;
        return fetch(url, headers);
    }
}