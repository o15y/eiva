import { Webhooks } from "../interfaces/enum";
import { webhooks } from "@prisma/client";
export declare const queueWebhook: (organizationId: string, webhook: Webhooks, data?: any) => void;
export declare const receiveWebhookMessage: () => Promise<0 | 1 | undefined>;
export declare const fireSingleWebhook: (webhook: webhooks, hookType: Webhooks, data?: any) => Promise<import("axios").AxiosResponse<any>>;
