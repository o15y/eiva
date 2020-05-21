import { organizations } from "@prisma/client";
import { Locals } from "../_staart/interfaces/general";
/**
 * Safely process an incoming email
 * @param secret - Webhook secret
 * @param objectId - S3 object ID
 */
export declare const processIncomingEmail: (secret: string, objectId: string) => Promise<{
    queued: boolean;
}>;
/**
 * Track the read status of an outgoing email
 * @param jwt - JSON web token for email
 */
export declare const trackOutgoingEmail: (jwt: string) => Promise<import(".prisma/client").incoming_emails>;
/**
 * Get the details of a meeting
 * @param username - Organization username
 * @param meetingId - Meeting ID
 * @param jwt - JWT for meeting
 */
export declare const getPublicMeetingDetails: (username: string, meetingId: string, jwt: string) => Promise<import(".prisma/client").meetings & {
    user: import(".prisma/client").users;
    organization: organizations;
    location: import(".prisma/client").locations;
}>;
/**
 * Tracking for analytics
 * @param index - Index to save record in
 * @param body - Data body
 */
export declare const trackAnalyticsEvent: (locals: Locals, index: string, data: any) => Promise<void>;
