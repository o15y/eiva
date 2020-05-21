/// <reference types="node" />
import { EventType, Tokens } from "../interfaces/enum";
import { Locals } from "../interfaces/general";
import { access_tokensCreateInput, access_tokensUpdateInput, users, api_keysCreateInput, api_keysUpdateInput } from "@prisma/client";
/**
 * Generate a new JWT
 */
export declare const generateToken: (payload: string | object | Buffer, expiresIn: string | number, subject: Tokens) => Promise<string>;
export interface TokenResponse {
    id: string;
    ipAddress?: string;
}
export interface ApiKeyResponse {
    id: string;
    organizationId: string;
    scopes: string;
    jti: string;
    sub: Tokens.API_KEY;
    exp: number;
    ipRestrictions?: string;
    referrerRestrictions?: string;
}
export interface AccessTokenResponse {
    id: string;
    userId: string;
    scopes: string;
    jti: string;
    sub: Tokens.ACCESS_TOKEN;
    exp: number;
}
/**
 * Verify a JWT
 */
export declare const verifyToken: <T>(token: string, subject: Tokens) => Promise<T>;
/**
 * Generate a new coupon JWT
 */
export declare const couponCodeJwt: (amount: number, currency: string, description?: string | undefined, expiresAt?: string | undefined) => Promise<string>;
/**
 * Generate a new email verification JWT
 */
export declare const emailVerificationToken: (id: string) => Promise<string>;
/**
 * Generate a new email verification JWT
 */
export declare const resendEmailVerificationToken: (id: string) => Promise<string>;
/**
 * Generate a new password reset JWT
 */
export declare const passwordResetToken: (id: number) => Promise<string>;
/**
 * Generate a new login JWT
 */
export declare const loginToken: (user: users) => Promise<string>;
/**
 * Generate a new 2FA JWT
 */
export declare const twoFactorToken: (user: users) => Promise<string>;
/**
 * Generate an API key JWT
 */
export declare const apiKeyToken: (apiKey: api_keysCreateInput | api_keysUpdateInput) => Promise<string>;
/**
 * Generate an access token
 */
export declare const accessToken: (accessToken: access_tokensCreateInput | access_tokensUpdateInput) => Promise<string>;
/**
 * Generate a new approve location JWT
 */
export declare const approveLocationToken: (id: number, ipAddress: string) => Promise<string>;
/**
 * Generate a new refresh JWT
 */
export declare const refreshToken: (id: number) => Promise<string>;
export declare const postLoginTokens: (user: users, locals: Locals, refreshTokenString?: string | undefined) => Promise<{
    token: string;
    refresh: string | undefined;
}>;
export interface LoginResponse {
    twoFactorToken?: string;
    token?: string;
    refresh?: string;
    [index: string]: string | undefined;
}
/**
 * Get the token response after logging in a user
 */
export declare const getLoginResponse: (user: users, type: EventType, strategy: string, locals: Locals) => Promise<LoginResponse>;
/**
 * Check if a token is invalidated in Redis
 * @param token - JWT
 */
export declare const checkInvalidatedToken: (token: string) => Promise<void>;
/**
 * Invalidate a JWT using Redis
 * @param token - JWT
 */
export declare const invalidateToken: (token: string) => Promise<void>;
export declare const checkIpRestrictions: (apiKey: ApiKeyResponse, locals: Locals) => void;
export declare const checkReferrerRestrictions: (apiKey: ApiKeyResponse, domain: string) => void;
