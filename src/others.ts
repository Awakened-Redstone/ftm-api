import {OPTIONS, RequestData} from "./core";

export class Others {
    @OPTIONS("*")
    options(request: RequestData): Response {
        return new Response('', {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Max-Age": "3600"
            }
        })
    }
}