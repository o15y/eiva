/// <reference types="express" />
import { Request, Response } from "@staart/server";
import dns from "dns";
import { ApiKeyResponse } from "./jwt";
import { users } from "@prisma/client";
/**
 * Make s single property optional
 * @source https://stackoverflow.com/a/54178819/1656944
 */
export declare type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
/**
 * Delete any sensitive information for a user like passwords and tokens
 */
export declare const deleteSensitiveInfoUser: (user: users) => users;
export declare const organizationUsernameToId: (id: string) => Promise<string>;
export declare const userUsernameToId: (id: string, tokenUserId?: string | undefined) => Promise<string>;
export declare const localsToTokenOrKey: (res: Response) => string | ApiKeyResponse;
export declare const safeRedirect: (req: Request, res: Response, url: string) => void | Response<any>;
export declare const getCodeFromRequest: (req: Request) => any;
/**
 * MySQL columns which are booleans
 */
export declare const boolValues: string[];
/**
 * MySQL columns which are datetime values
 */
export declare const dateValues: string[];
/**
 * MySQL columns which are JSON values
 */
export declare const jsonValues: string[];
/**
 * MySQL columns which are read-only
 */
export declare const readOnlyValues: string[];
/**
 * MySQL columns which are for int IDs
 */
export declare const IdValues: string[];
export declare const removeFalsyValues: (value: any) => any;
export declare const includesDomainInCommaList: (commaList: string, value: string) => boolean;
export declare const dnsResolve: (hostname: string, recordType: "A" | "AAAA" | "ANY" | "CNAME" | "MX" | "NAPTR" | "NS" | "PTR" | "SOA" | "SRV" | "TXT") => Promise<Array<string> | Array<dns.MxRecord> | Array<dns.NaptrRecord> | dns.SoaRecord | Array<dns.SrvRecord> | Array<Array<string>> | Array<dns.AnyRecord>>;
export declare const queryToParams: (req: Request) => {
    [index: string]: number | {
        [index: string]: string | boolean;
    };
};
