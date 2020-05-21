/// <reference types="express" />
import { Request, Response } from "@staart/server";
export declare class OrganizationDomainsController {
    getUserDomains(req: Request, res: Response): Promise<{
        data: import(".prisma/client").domains[];
        hasMore: boolean;
        next: number | undefined;
    }>;
    putUserDomains(req: Request, res: Response): Promise<{
        added: import(".prisma/client").domains;
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
    getUserDomain(req: Request, res: Response): Promise<import(".prisma/client").domains | null>;
    patchUserDomain(req: Request, res: Response): Promise<{
        updated: import(".prisma/client").domains;
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
    deleteUserDomain(req: Request, res: Response): Promise<{
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
    verifyOrganizationDomain(req: Request, res: Response): Promise<import(".prisma/client").domains>;
}
