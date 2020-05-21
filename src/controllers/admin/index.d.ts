/// <reference types="express" />
import { Request, Response } from "@staart/server";
export declare class AdminController {
    getOrganizations(req: Request, res: Response): Promise<{
        data: import(".prisma/client").organizations[];
        hasMore: boolean;
        next: number | undefined;
    }>;
    getUsers(req: Request, res: Response): Promise<{
        data: import(".prisma/client").users[];
        hasMore: boolean;
        next: number | undefined;
    }>;
    getServerLogs(req: Request, res: Response): Promise<any>;
    getPaymentEvents(req: Request, res: Response): Promise<any>;
    info(): Promise<{
        success: boolean;
        message: string;
    }>;
}
