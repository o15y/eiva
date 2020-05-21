/// <reference types="express" />
import { Request, Response } from "@staart/server";
export declare class UserMembershipsController {
    getMemberships(req: Request, res: Response): Promise<{
        data: import(".prisma/client").memberships[];
        hasMore: boolean;
        next: number | undefined;
    }>;
    getMembership(req: Request, res: Response): Promise<(import(".prisma/client").memberships & {
        user: import(".prisma/client").users;
        organization: import(".prisma/client").organizations;
    }) | null>;
    deleteMembership(req: Request, res: Response): Promise<{
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
    updateMembership(req: Request, res: Response): Promise<{
        updated: import(".prisma/client").memberships;
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
}
