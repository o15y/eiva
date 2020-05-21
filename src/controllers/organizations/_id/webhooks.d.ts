/// <reference types="express" />
import { Request, Response } from "@staart/server";
export declare class OrganizationWebhooksController {
    getOrganizationWebhooks(req: Request, res: Response): Promise<{
        data: import(".prisma/client").webhooks[];
        hasMore: boolean;
        next: number | undefined;
    }>;
    putOrganizationWebhooks(req: Request, res: Response): Promise<{
        added: import(".prisma/client").webhooks;
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
    getOrganizationWebhook(req: Request, res: Response): Promise<import(".prisma/client").webhooks | null>;
    patchOrganizationWebhook(req: Request, res: Response): Promise<{
        updated: import(".prisma/client").webhooks;
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
    deleteOrganizationWebhook(req: Request, res: Response): Promise<{
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
}
