import {defaultHeaders, errorResponse, errorResponseSimple, GET, POST, RequestData, response} from "./core";

export class API {
    @GET("/v1/*?")
    removed(request: RequestData): Response {
        return errorResponse("Gone", 410, {message: "The API v1 has been deprecated and removed!"}); //TODO: json
    }

    @POST("/v2/post")
    post(request: RequestData): Response {
        return response({data: "Received!"});
    }

    @GET("/v2/helloworld")
    helloWorld(request: RequestData): Response {
        return response({data: "Hello world!"});
    }

    @GET("/v2/delay")
    async delay(request: RequestData): Promise<Response> {
        if (!request.query || !request.query.time || !request.query.url) {
            return errorResponseSimple("Missing required query", 400);
        }

        const time = parseInt(request.query.time);
        if (isNaN(time)) {
            return errorResponseSimple("Invalid time", 400);
        }

        try {
            const url = new URL(request.query.url);
            await new Promise(resolve => setTimeout(resolve, time));
            return new Response(null, {
                status: 308, headers: {
                    ...defaultHeaders.headers,
                    "Location": request.query.url
                }
            });
        } catch (e) {
            return errorResponseSimple("Invalid URL", 400);
        }
    }

    @GET("/v2/subathon")
    subathon(request: RequestData): Response {
        return new Response(null, {
            status: 308, headers: {
                ...defaultHeaders.headers,
                "Location": "http://localhost:3000" + new URL(request.url).search
            }
        });
    }
}