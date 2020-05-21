/// <reference types="express" />
import { Request, Response } from "@staart/server";
export declare class UserAccessTokensController {
    getUserAccessTokens(req: Request, res: Response): Promise<{
        data: import(".prisma/client").access_tokens[];
        hasMore: boolean;
        next: number | undefined;
    }>;
    putUserAccessTokens(req: Request, res: Response): Promise<{}>;
    getUserAccessToken(req: Request, res: Response): Promise<import(".prisma/client").access_tokens | null>;
    patchUserAccessToken(req: Request, res: Response): Promise<{
        updated: import(".prisma/client").access_tokens;
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
    deleteUserAccessToken(req: Request, res: Response): Promise<{
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
}
