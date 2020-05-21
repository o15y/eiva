import { Locals } from "../interfaces/general";
import { usersCreateInput } from "@prisma/client";
import { PartialBy } from "../helpers/utils";
export declare const validateRefreshToken: (token: string, locals: Locals) => Promise<{
    token: string;
    refresh: string | undefined;
}>;
export declare const invalidateRefreshToken: (token: string, locals: Locals) => Promise<void>;
export declare const login: (email: string, password: string, locals: Locals) => Promise<import("../helpers/jwt").LoginResponse>;
export declare const login2FA: (code: number, token: string, locals: Locals) => Promise<{
    token: string;
    refresh: string | undefined;
}>;
export declare const register: (_user: PartialBy<PartialBy<usersCreateInput, "nickname">, "username">, locals?: Locals | undefined, email?: string | undefined, organizationId?: string | undefined, role?: "OWNER" | "ADMIN" | "RESELLER" | "MEMBER" | undefined, emailVerified?: boolean) => Promise<{
    userId: number;
    resendToken: string | undefined;
}>;
export declare const sendPasswordReset: (email: string, locals?: Locals | undefined) => Promise<void>;
export declare const sendNewPassword: (userId: number, email: string) => Promise<void>;
export declare const verifyEmail: (token: string, locals: Locals) => Promise<import(".prisma/client").emails>;
export declare const updatePassword: (token: string, password: string, locals: Locals) => Promise<void>;
export declare const impersonate: (tokenUserId: string, impersonateUserId: string, locals: Locals) => Promise<import("../helpers/jwt").LoginResponse>;
export declare const approveLocation: (token: string, locals: Locals) => Promise<import("../helpers/jwt").LoginResponse>;
export declare const resendEmailVerificationWithToken: (token: string) => Promise<void>;
