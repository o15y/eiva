import { HTTPError } from "../interfaces/general";
/**
 * Parse default errors and send a safe string
 */
export declare const safeError: (error: string) => HTTPError;
/**
 * Send an HTTPError object
 */
export declare const sendError: (error: string) => HTTPError;
