import { locationsUpdateInput, locationsCreateInput } from "@prisma/client";
import { ApiKeyResponse } from "../../../_staart/helpers/jwt";
export declare const getAllLocationsForOrganization: (tokenUserId: string | ApiKeyResponse, organizationId: string, queryParams: any) => Promise<{
    data: import(".prisma/client").locations[];
    hasMore: boolean;
    next: number | undefined;
}>;
export declare const getLocationForOrganization: (tokenUserId: string | ApiKeyResponse, organizationId: string, meetingId: string) => Promise<import(".prisma/client").locations | null>;
export declare const createLocationForOrganization: (tokenUserId: string | ApiKeyResponse, organizationId: string, data: locationsCreateInput) => Promise<import(".prisma/client").locations>;
export declare const updateLocationForOrganization: (tokenUserId: string | ApiKeyResponse, organizationId: string, meetingId: string, data: locationsUpdateInput) => Promise<import(".prisma/client").locations>;
export declare const deleteLocationForOrganization: (tokenUserId: string | ApiKeyResponse, organizationId: string, meetingId: string) => Promise<import(".prisma/client").locations>;
