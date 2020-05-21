import { Locals } from "../interfaces/general";
import { users, access_tokensUpdateInput, access_tokensCreateInput, identitiesCreateInput, membershipsUpdateInput } from "@prisma/client";
import { ApiKeyResponse } from "../helpers/jwt";
export declare const getUserFromIdForUser: (userId: string, tokenUserId: string, queryParams: any) => Promise<users>;
export declare const updateUserForUser: (tokenUserId: string, updateUserId: string, data: users, locals: Locals) => Promise<users>;
export declare const updatePasswordForUser: (tokenUserId: string, updateUserId: string, oldPassword: string, newPassword: string, locals: Locals) => Promise<users>;
export declare const deleteUserForUser: (tokenUserId: string, updateUserId: string, locals: Locals) => Promise<void>;
export declare const getMembershipsForUser: (tokenUserId: string, dataUserId: string, queryParams: any) => Promise<{
    data: import(".prisma/client").memberships[];
    hasMore: boolean;
    next: number | undefined;
}>;
export declare const getAllDataForUser: (tokenUserId: string, userId: string) => Promise<(users & {
    emails: import(".prisma/client").emails[];
    access_tokens: import(".prisma/client").access_tokens[];
    approved_locations: import(".prisma/client").approved_locations[];
    backup_codes: import(".prisma/client").backup_codes[];
    identities: import(".prisma/client").identities[];
    memberships: import(".prisma/client").memberships[];
    sessions: import(".prisma/client").sessions[];
}) | null>;
export declare const enable2FAForUser: (tokenUserId: string, userId: string) => Promise<{
    qrCode: string;
}>;
export declare const verify2FAForUser: (tokenUserId: string, userId: string, verificationCode: number) => Promise<string[]>;
export declare const disable2FAForUser: (tokenUserId: string, userId: string) => Promise<users>;
export declare const regenerateBackupCodesForUser: (tokenUserId: string, userId: string) => Promise<string[]>;
export declare const getUserAccessTokensForUser: (tokenUserId: string, userId: string, queryParams: any) => Promise<{
    data: import(".prisma/client").access_tokens[];
    hasMore: boolean;
    next: number | undefined;
}>;
export declare const getUserAccessTokenForUser: (tokenUserId: string, userId: string, accessTokenId: string) => Promise<import(".prisma/client").access_tokens | null>;
export declare const updateAccessTokenForUser: (tokenUserId: string, userId: string, accessTokenId: string, data: access_tokensUpdateInput, locals: Locals) => Promise<import(".prisma/client").access_tokens>;
export declare const createAccessTokenForUser: (tokenUserId: string, userId: string, accessToken: access_tokensCreateInput, locals: Locals) => Promise<import(".prisma/client").access_tokens>;
export declare const deleteAccessTokenForUser: (tokenUserId: string, userId: string, accessTokenId: string, locals: Locals) => Promise<import(".prisma/client").access_tokens>;
export declare const getUserSessionsForUser: (tokenUserId: string, userId: string, queryParams: any) => Promise<{
    data: import(".prisma/client").sessions[];
    hasMore: boolean;
    next: number | undefined;
}>;
export declare const getUserSessionForUser: (tokenUserId: string, userId: string, sessionId: string) => Promise<import(".prisma/client").sessions | null>;
export declare const deleteSessionForUser: (tokenUserId: string, userId: string, sessionId: string, locals: Locals) => Promise<import(".prisma/client").sessions>;
export declare const getUserIdentitiesForUser: (tokenUserId: string, userId: string, queryParams: any) => Promise<{
    data: import(".prisma/client").identities[];
    hasMore: boolean;
    next: number | undefined;
}>;
export declare const createUserIdentityForUser: (tokenUserId: string, userId: string, identity: identitiesCreateInput) => Promise<import(".prisma/client").identities>;
export declare const connectUserIdentityForUser: (tokenUserId: string, userId: string, service: string, url: string) => Promise<void>;
export declare const getUserIdentityForUser: (tokenUserId: string, userId: string, identityId: string) => Promise<import(".prisma/client").identities | null>;
export declare const deleteIdentityForUser: (tokenUserId: string, userId: string, identityId: string, locals: Locals) => Promise<import(".prisma/client").identities>;
export declare const addInvitationCredits: (invitedBy: string, newUserId: string) => Promise<void>;
export declare const getAllEmailsForUser: (tokenUserId: string, userId: string, queryParams: any) => Promise<{
    data: import(".prisma/client").emails[];
    hasMore: boolean;
    next: number | undefined;
}>;
export declare const getEmailForUser: (tokenUserId: string, userId: string, emailId: string) => Promise<import(".prisma/client").emails | null>;
export declare const resendEmailVerificationForUser: (tokenUserId: string, userId: string, emailId: string) => Promise<void>;
export declare const addEmailToUserForUser: (tokenUserId: string, userId: string, email: string, locals: Locals) => Promise<import(".prisma/client").emails>;
export declare const deleteEmailFromUserForUser: (tokenUserId: string, userId: string, emailId: string, locals: Locals) => Promise<import(".prisma/client").emails>;
export declare const getMembershipDetailsForUser: (userId: string, membershipId: string) => Promise<(import(".prisma/client").memberships & {
    user: users;
    organization: import(".prisma/client").organizations;
}) | null>;
export declare const deleteMembershipForUser: (tokenUserId: string | ApiKeyResponse, membershipId: string, locals: Locals) => Promise<void | import(".prisma/client").memberships>;
export declare const updateMembershipForUser: (userId: string | ApiKeyResponse, membershipId: string, data: membershipsUpdateInput, locals: Locals) => Promise<import(".prisma/client").memberships>;
