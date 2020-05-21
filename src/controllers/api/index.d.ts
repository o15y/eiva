/// <reference types="express" />
import { Request, Response } from "@staart/server";
export declare class ApiController {
    classify(req: Request): Promise<string>;
    parseEmail(req: Request): Promise<import("mailparser").ParsedMail>;
    smartTokenize(req: Request): Promise<string[]>;
    performAction(req: Request, res: Response): Promise<{}>;
    readReceiptEmail(req: Request, res: Response): Promise<void>;
    getMeetingDetails(req: Request): Promise<import(".prisma/client").meetings & {
        user: import(".prisma/client").users;
        organization: import(".prisma/client").organizations;
        location: import(".prisma/client").locations;
    }>;
    confirmMeeting(req: Request): Promise<{
        queued: boolean;
    }>;
    track(req: Request, res: Response): Promise<{
        queued: boolean;
    }>;
}
