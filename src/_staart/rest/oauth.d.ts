import ClientOAuth2 from "client-oauth2";
import { Locals } from "../interfaces/general";
export declare const loginWithOAuth2Service: (service: string, name: string, email: string, locals: Locals) => Promise<import("../helpers/jwt").LoginResponse>;
export declare const salesforce: {
    client: ClientOAuth2;
    callback: (url: string, locals: Locals) => Promise<import("../helpers/jwt").LoginResponse>;
};
export declare const github: {
    client: ClientOAuth2;
    callback: (url: string, locals: Locals) => Promise<import("../helpers/jwt").LoginResponse>;
};
export declare const facebook: {
    client: ClientOAuth2;
    callback: (url: string, locals: Locals) => Promise<import("../helpers/jwt").LoginResponse>;
};
export declare const google: {
    client: ClientOAuth2;
    callback: (url: string, locals: Locals) => Promise<{}>;
};
export declare const microsoft: {
    client: ClientOAuth2;
    callback: (url: string, locals: Locals) => Promise<import("../helpers/jwt").LoginResponse>;
};
