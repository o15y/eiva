/// <reference types="express" />
import { Request, Response } from "@staart/server";
export declare class OrganizationMembershipsController {
    getMemberships(req: Request, res: Response): Promise<{
        data: import(".prisma/client").memberships[];
        hasMore: boolean;
        next: number | undefined;
    }>;
    putMemberships(req: Request, res: Response): Promise<{
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
    getMembership(req: Request, res: Response): Promise<(import(".prisma/client").memberships & {
        user: import(".prisma/client").users;
    }) | null>;
    updateMembership(req: Request, res: Response): Promise<{
        updated: import(".prisma/client").memberships;
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
    deleteMembership(req: Request, res: Response): Promise<{
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
}
