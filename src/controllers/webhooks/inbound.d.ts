/// <reference types="express" />
import { Request, Response } from "@staart/server";
export declare class InboundWebhooksController {
    lambdaWebhook(req: Request, res: Response): Promise<{
        queued: boolean;
    }>;
}
