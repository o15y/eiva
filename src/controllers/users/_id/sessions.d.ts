/// <reference types="express" />
import { Request, Response } from "@staart/server";
export declare class UserSessionsController {
    getUserSessions(req: Request, res: Response): Promise<{
        data: import(".prisma/client").sessions[];
        hasMore: boolean;
        next: number | undefined;
    }>;
    getUserSession(req: Request, res: Response): Promise<import(".prisma/client").sessions | null>;
    deleteUserSession(req: Request, res: Response): Promise<{
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
}
