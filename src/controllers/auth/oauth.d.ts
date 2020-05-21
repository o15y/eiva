/// <reference types="express" />
import { Request, Response } from "@staart/server";
export declare class AuthOAuthController {
    getOAuthUrlSalesforce(req: Request, res: Response): Promise<void>;
    getOAuthCallbackSalesforce(req: Request, res: Response): Promise<void | Response<any>>;
    getOAuthUrlGitHub(req: Request, res: Response): Promise<void>;
    getOAuthCallbackGitHub(req: Request, res: Response): Promise<void | Response<any>>;
    getOAuthUrlMicrosoft(req: Request, res: Response): Promise<void>;
    getOAuthCallbackMicrosoft(req: Request, res: Response): Promise<void | Response<any>>;
    getOAuthUrlGoogle(req: Request, res: Response): Promise<void>;
    getOAuthCallbackGoogle(req: Request, res: Response): Promise<void | Response<any>>;
    getOAuthUrlFacebook(req: Request, res: Response): Promise<void>;
    getOAuthCallbackFacebook(req: Request, res: Response): Promise<void | Response<any>>;
}
