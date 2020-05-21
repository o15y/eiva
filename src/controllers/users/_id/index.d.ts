/// <reference types="express" />
import { Request, Response } from "@staart/server";
export declare class UserController {
    get(req: Request, res: Response): Promise<import(".prisma/client").users>;
    patch(req: Request, res: Response): Promise<{
        updated: import(".prisma/client").users;
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
    delete(req: Request, res: Response): Promise<{
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
}
