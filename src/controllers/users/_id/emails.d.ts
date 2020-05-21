/// <reference types="express" />
import { Request, Response } from "@staart/server";
export declare class UserEmailsController {
    getEmails(req: Request, res: Response): Promise<{
        data: import(".prisma/client").emails[];
        hasMore: boolean;
        next: number | undefined;
    }>;
    putEmails(req: Request, res: Response): Promise<{
        added: import(".prisma/client").emails;
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
    getEmail(req: Request, res: Response): Promise<import(".prisma/client").emails | null>;
    postResend(req: Request, res: Response): Promise<{
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
    deleteEmail(req: Request, res: Response): Promise<{
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
}
