/// <reference types="express" />
import { Request, Response } from "@staart/server";
export declare class UserIdentitiesController {
    getUserIdentities(req: Request, res: Response): Promise<{
        data: import(".prisma/client").identities[];
        hasMore: boolean;
        next: number | undefined;
    }>;
    createUserIdentity(req: Request, res: Response): Promise<{
        added: import(".prisma/client").identities;
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
    connectUserIdentity(req: Request, res: Response): Promise<{
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
    getUserIdentity(req: Request, res: Response): Promise<import(".prisma/client").identities | null>;
    deleteUserIdentity(req: Request, res: Response): Promise<{
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
}
