import { PartialBy } from "../helpers/utils";
import { KeyValue } from "../interfaces/general";
import { users, access_tokens, access_tokensCreateInput, sessionsUpdateInput, usersCreateInput } from "@prisma/client";
/**
 * Get the best available username for a user
 * For example, if the user's name is "Anand Chowdhary"
 * Usernames: "anand", "anand-chowdhary", "anand-chowdhary-a29hi3q"
 * @param name - Name of user
 */
export declare const getBestUsernameForUser: (name: string) => Promise<string>;
/**
 * Check if an organization username is available
 */
export declare const checkUserUsernameAvailability: (username: string) => Promise<boolean>;
/**
 * Create a new user
 */
export declare const createUser: (_user: PartialBy<usersCreateInput, "nickname">) => Promise<users>;
/**
 * Get the details of a user by their email
 */
export declare const getUserByEmail: (email: string, secureOrigin?: boolean) => Promise<users>;
/**
 * Update a user's details
 */
export declare const updateUser: (id: string, user: KeyValue) => Promise<users>;
/**
 * Add a new approved location for a user
 * @param ipAddress - IP address for the new location
 */
export declare const addApprovedLocation: (userId: string | number, ipAddress: string) => Promise<import(".prisma/client").approved_locations>;
/**
 * Check whether a location is approved for a user
 * @param ipAddress - IP address for checking
 */
export declare const checkApprovedLocation: (userId: string | number, ipAddress: string) => Promise<boolean>;
/**
 * Create 2FA backup codes for user
 * We generate 6-digit backup codes for a user
 * and save the hashed version in the database
 * @param count - Number of backup codes to create
 */
export declare const createBackupCodes: (userId: string | number, count?: number) => Promise<string[]>;
/**
 * Create an API key
 */
export declare const createAccessToken: (data: access_tokensCreateInput) => Promise<access_tokens>;
/**
 * Update a user's details
 */
export declare const updateAccessToken: (accessTokenId: string, data: access_tokens) => Promise<access_tokens>;
/**
 * Delete an API key
 */
export declare const deleteAccessToken: (accessTokenId: string) => Promise<access_tokens>;
/**
 * Get the primary email of a user
 * @param userId - User Id
 */
export declare const getUserPrimaryEmail: (userId: string | number) => Promise<import(".prisma/client").emails>;
/**
 * Get the best email to contact a user
 * @param userId - User ID
 */
export declare const getUserBestEmail: (userId: string | number) => Promise<import(".prisma/client").emails>;
/**
 * Update a session based on JWT
 * @param userId - User ID
 * @param sessionJwt - Provided session JWT
 * @param data - Session information to update
 */
export declare const updateSessionByJwt: (userId: number, sessionJwt: string, data: sessionsUpdateInput) => Promise<import(".prisma/client").sessions>;
/**
 * Create a new email for a user
 * @param sendVerification  Whether to send an email verification link to new email
 * @param isVerified  Whether this email is verified by default
 */
export declare const createEmail: (userId: number, email: string, sendVerification?: boolean, sendPasswordSet?: boolean) => Promise<import(".prisma/client").emails>;
/**
 * Send an email verification link
 */
export declare const sendEmailVerification: (id: string | number, email: string, user: users) => Promise<void>;
/**
 * Resend an email verification link
 */
export declare const resendEmailVerification: (id: string | number) => Promise<void>;
/**
 * Get a user object from its ID
 * @param id - User ID
 */
export declare const getUserById: (id: number | string) => Promise<users>;
