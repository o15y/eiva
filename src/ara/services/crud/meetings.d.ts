import { meetingsUpdateInput } from "@prisma/client";
import { ApiKeyResponse } from "../../../_staart/helpers/jwt";
export declare const getAllMeetingsForOrganization: (tokenUserId: string | ApiKeyResponse, organizationId: string, queryParams: any) => Promise<{
    data: import(".prisma/client").meetings[];
    hasMore: boolean;
    next: number | undefined;
}>;
export declare const getMeetingForOrganization: (tokenUserId: string | ApiKeyResponse, organizationId: string, meetingId: string) => Promise<import(".prisma/client").meetings | null>;
export declare const updateMeetingForOrganization: (tokenUserId: string | ApiKeyResponse, organizationId: string, meetingId: string, data: meetingsUpdateInput) => Promise<import(".prisma/client").meetings>;
export declare const deleteMeetingForOrganization: (tokenUserId: string | ApiKeyResponse, organizationId: string, meetingId: string) => Promise<import(".prisma/client").meetings>;
export declare const getMeetingIncomingEmailsForOrganization: (tokenUserId: string | ApiKeyResponse, organizationId: string, meetingId: string, queryParams: any) => Promise<{
    data: import(".prisma/client").incoming_emails[];
    hasMore: boolean;
    next: number | undefined;
}>;
export declare const getMeetingIncomingEmailForOrganization: (tokenUserId: string | ApiKeyResponse, organizationId: string, meetingId: string, incomingEmailId: string) => Promise<import(".prisma/client").incoming_emails | null>;
