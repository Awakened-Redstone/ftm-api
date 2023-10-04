import {GetUsersResponse, TwitchResponse} from "./types/TwitchResponse";
import {errorResponseSimple} from "./core";

export type Predicate = (json: TwitchResponse) => null | Response;

export const JustPassPredicate = function (): null | Response {
    return null;
} as Predicate;

export const GetUsersResponsePredicate = function (json: GetUsersResponse): null | Response {
    if (json.data && json.data.length === 0) {
        return errorResponseSimple("User not found", 404)
    } else {
        return null;
    }
} as Predicate;