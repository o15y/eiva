/// <reference types="express" />
import { Request, Response } from "@staart/server";
export declare class AuthController {
    register(req: Request, res: Response): Promise<{
        resendToken: string | undefined;
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
    login(req: Request, res: Response): Promise<import("../../_staart/helpers/jwt").LoginResponse>;
    twoFactor(req: Request, res: Response): Promise<{
        token: string;
        refresh: string | undefined;
    }>;
    postVerifyToken(req: Request): Promise<{
        verified: boolean;
        data: any;
    }>;
    postRefreshToken(req: Request, res: Response): Promise<{
        token: string;
        refresh: string | undefined;
    }>;
    postLogout(req: Request, res: Response): Promise<{
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
    postResetPasswordRequest(req: Request, res: Response): Promise<{
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
    postResetPasswordRecover(req: Request, res: Response): Promise<{
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
    resendEmail(req: Request, res: Response): Promise<{
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
    getImpersonate(req: Request, res: Response): Promise<import("../../_staart/helpers/jwt").LoginResponse>;
    getApproveLocation(req: Request, res: Response): Promise<import("../../_staart/helpers/jwt").LoginResponse>;
    postVerifyEmail(req: Request, res: Response): Promise<{
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
}
