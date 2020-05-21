/// <reference types="express" />
import { NextFunction, Request, Response } from "@staart/server";
import { SchemaMap } from "@staart/validate";
/**
 * Handle any errors for Express
 */
export declare const errorHandler: (error: any, req: Request, res: Response, next: NextFunction) => void;
/**
 * Add locals for IP address and user agent
 */
export declare const trackingHandler: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Add locals for a user after verifying their token
 */
export declare const authHandler: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any>>;
/**
 * Brute force middleware
 */
export declare const bruteForceHandler: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary>;
/**
 * Rate limiting middleware
 */
export declare const rateLimitHandler: (req: Request, res: Response, next: NextFunction) => Promise<any>;
/**
 * Speed limiting middleware
 */
export declare const speedLimitHandler: (req: Request, res: Response, next: NextFunction) => Promise<any>;
/**
 * Response caching middleware
 * @param time - Amount of time to cache contenr for
 */
export declare const cachedResponse: (time: string) => (req: Request, res: Response, next: NextFunction) => void;
export declare const validator: (schemaMap: SchemaMap, type: "body" | "params" | "query") => (req: Request, res: Response, next: NextFunction) => void;
/**
 * Handle Stripe's webhook authentication
 */
export declare const stripeWebhookAuthHandler: (req: Request, res: Response, next: NextFunction) => Promise<Response<any> | undefined>;
