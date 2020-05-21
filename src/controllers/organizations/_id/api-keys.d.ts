/// <reference types="express" />
import { Request, Response } from "@staart/server";
export declare class OrganizationApiKeysController {
    getUserApiKeys(req: Request, res: Response): Promise<{
        data: import(".prisma/client").api_keys[];
        hasMore: boolean;
        next: number | undefined;
    }>;
    putUserApiKeys(req: Request, res: Response): Promise<{
        added: import(".prisma/client").api_keys;
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
    getUserApiKey(req: Request, res: Response): Promise<import(".prisma/client").api_keys | null>;
    patchUserApiKey(req: Request, res: Response): Promise<{
        updated: import(".prisma/client").api_keys;
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
    deleteUserApiKey(req: Request, res: Response): Promise<{
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
    getUserApiKeyLogs(req: Request, res: Response): Promise<any>;
}
