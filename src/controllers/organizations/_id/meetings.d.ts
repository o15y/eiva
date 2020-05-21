/// <reference types="express" />
import { Request, Response } from "@staart/server";
export declare class OrganizationMeetingsController {
    getOrganizationMeetings(req: Request, res: Response): Promise<{
        data: import(".prisma/client").meetings[];
        hasMore: boolean;
        next: number | undefined;
    }>;
    getOrganizationMeeting(req: Request, res: Response): Promise<import(".prisma/client").meetings | null>;
    patchOrganizationMeeting(req: Request, res: Response): Promise<{
        updated: import(".prisma/client").meetings;
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
    deleteOrganizationMeeting(req: Request, res: Response): Promise<{
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
    getOrganizationMeetingEmails(req: Request, res: Response): Promise<{
        data: import(".prisma/client").incoming_emails[];
        hasMore: boolean;
        next: number | undefined;
    }>;
    getOrganizationMeetingEmail(req: Request, res: Response): Promise<import(".prisma/client").incoming_emails | null>;
}
