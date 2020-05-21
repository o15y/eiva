/// <reference types="express" />
import { Request, Response } from "@staart/server";
export declare class OrganizationController {
    put(req: Request, res: Response): Promise<{
        added: import(".prisma/client").organizations;
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
}
