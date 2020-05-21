/**
 * Confirm a meeting from guest
 * @param token - JWT for verification
 * @param organizationId - Organization ID
 * @param meetingId - Meeting ID
 * @param data - Body data
 */
export declare const confirmMeetingForGuest: (organizationId: string, meetingId: string, data: {
    token: string;
    guestName: string;
    guestEmail: string;
    guestTimezone: string;
    duration: number;
    selectedDatetime: Date;
}) => Promise<{
    queued: boolean;
}>;
