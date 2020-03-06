import {
  Controller,
  Get,
  Middleware,
  Request,
  Response,
  ChildControllers
} from "@staart/server";
import { stripeWebhookAuthHandler } from "../../helpers/middleware";
import { StripeLocals } from "../../interfaces/general";
import { WebhooksInboundController } from "./inbound";

@Controller("webhooks")
@ChildControllers([new WebhooksInboundController()])
export class WebhooksController {
  @Get("stripe")
  @Middleware(stripeWebhookAuthHandler)
  async stripeWebhook(req: Request, res: Response) {
    const locals = res.locals as StripeLocals;
    console.log("Received Stripe event", locals.stripeEvent);
    return { hello: "world" };
  }
}
