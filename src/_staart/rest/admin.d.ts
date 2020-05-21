import { coupon_codesUpdateInput } from "@prisma/client";
export declare const getAllOrganizationForUser: (tokenUserId: string, queryParams: any) => Promise<{
    data: import(".prisma/client").organizations[];
    hasMore: boolean;
    next: number | undefined;
}>;
export declare const getAllUsersForUser: (tokenUserId: string, queryParams: any) => Promise<{
    data: import(".prisma/client").users[];
    hasMore: boolean;
    next: number | undefined;
}>;
export declare const getAllCouponsForUser: (tokenUserId: string, queryParams: any) => Promise<{
    data: import(".prisma/client").coupon_codes[];
    hasMore: boolean;
    next: number | undefined;
}>;
export declare const getCouponForUser: (tokenUserId: string, couponId: string) => Promise<import(".prisma/client").coupon_codes | null>;
export declare const updateCouponForUser: (tokenUserId: string, couponId: string, data: coupon_codesUpdateInput) => Promise<import(".prisma/client").coupon_codes>;
export declare const deleteCouponForUser: (tokenUserId: string, couponId: string) => Promise<import(".prisma/client").coupon_codes>;
export declare const generateCouponForUser: (tokenUserId: string, body: any) => Promise<string | import(".prisma/client").coupon_codes>;
export declare const getPaymentEventsForUser: (tokenUserId: string, body: any) => Promise<any>;
/**
 * Get an API key
 */
export declare const getServerLogsForUser: (tokenUserId: string, query: {
    range?: string;
    from?: string;
}) => Promise<any>;
