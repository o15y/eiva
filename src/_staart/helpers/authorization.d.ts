import { OrgScopes, UserScopes, SudoScopes } from "../interfaces/enum";
import { ApiKeyResponse, AccessTokenResponse } from "./jwt";
import { users, organizations, memberships } from "@prisma/client";
/**
 * Whether a user has authorization to perform an action
 */
export declare const can: (user: string | users | ApiKeyResponse | AccessTokenResponse, action: OrgScopes | UserScopes | SudoScopes, targetType: "user" | "organization" | "membership" | "sudo", target?: string | users | memberships | organizations | undefined) => Promise<boolean>;
