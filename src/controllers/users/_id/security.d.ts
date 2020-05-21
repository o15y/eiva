/// <reference types="express" />
import { Request, Response } from "@staart/server";
export declare class UserSecurityController {
    updatePassword(req: Request, res: Response): Promise<{
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
    getUserData(req: Request, res: Response): Promise<(import(".prisma/client").users & {
        emails: import(".prisma/client").emails[];
        access_tokens: import(".prisma/client").access_tokens[];
        approved_locations: import(".prisma/client").approved_locations[];
        backup_codes: import(".prisma/client").backup_codes[];
        identities: import(".prisma/client").identities[];
        memberships: import(".prisma/client").memberships[];
        sessions: import(".prisma/client").sessions[];
    }) | null>;
    getEnable2FA(req: Request, res: Response): Promise<{
        qrCode: string;
    }>;
    postVerify2FA(req: Request, res: Response): Promise<{
        backupCodes: string[];
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
    delete2FA(req: Request, res: Response): Promise<{
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
    getRegenerateBackupCodes(req: Request, res: Response): Promise<{
        backupCodes: string[];
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
}
