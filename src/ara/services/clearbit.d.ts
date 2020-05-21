export interface ClearbitResponse {
    person?: {
        id: string;
        name?: {
            fullName?: string;
            givenName?: string;
            familyName?: string;
        };
        timeZone?: string;
    };
    company?: {
        id: string;
        name?: string;
        legalName?: string;
        timeZone?: string;
    };
}
export declare const getClearbitPersonFromEmail: (email: string) => Promise<ClearbitResponse>;
