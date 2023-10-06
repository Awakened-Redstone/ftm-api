import {defaultHeaders, errorResponse, GET, POST, RequestData, response} from "./core";

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