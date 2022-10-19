import {GET, RequestData} from "./core";

export class API {
    @GET("/v1/*?")
    removed(request: RequestData): Response {
        return new Response("The API v1 has been deprecated and removed!"); //TODO: json
    }

    @GET("/v2/helloworld")
    helloWorld(request: RequestData): Response {
        return new Response("Hello world!"); //TODO: json
    }
}