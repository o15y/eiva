/// <reference types="express" />
import { Request, Response } from "@staart/server";
export declare class WebhooksController {
    stripeWebhook(req: Request, res: Response): Promise<{
        hello: string;
    }>;
}
