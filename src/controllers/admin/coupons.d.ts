/// <reference types="express" />
import { Request, Response } from "@staart/server";
export declare class AdminCouponController {
    getCoupons(req: Request, res: Response): Promise<{
        data: import(".prisma/client").coupon_codes[];
        hasMore: boolean;
        next: number | undefined;
    }>;
    createCoupon(req: Request, res: Response): Promise<{
        added: string | import(".prisma/client").coupon_codes;
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
    getCoupon(req: Request, res: Response): Promise<import(".prisma/client").coupon_codes | null>;
    updateCoupon(req: Request, res: Response): Promise<import(".prisma/client").coupon_codes>;
    deleteCoupon(req: Request, res: Response): Promise<import(".prisma/client").coupon_codes>;
}
