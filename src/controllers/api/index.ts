import {
  Controller,
  Get,
  Post,
  Middleware,
  Request,
  Response,
} from "@staart/server";
import { joiValidate, Joi } from "@staart/validate";
import { AddressObject } from "mailparser";
import { authHandler, validator } from "../../_staart/helpers/middleware";
import { classifyTokens } from "../../ara/services/classify";
import { smartTokensFromText } from "../../ara/services/tokenize";
import { parseEmail } from "../../ara/services/parse";
import { organizationUsernameToId } from "../../_staart/helpers/utils";
import {
  trackOutgoingEmail,
  getPublicMeetingDetails,
  trackAnalyticsEvent,
} from "../../ara/rest";
import { ApiKeyResponse } from "../../_staart/helpers/jwt";
import { confirmMeetingForGuest } from "../../ara/services/crud/confirm-meeting";
import { safeRedirect } from "../../_staart/helpers/utils";
import { googleCalendarClient } from "../../ara/services/calendar-connection";
import { BASE_URL } from "../../config";
import { stringify } from "querystring";

export class ApiController {
  @Post("classify")
  @Middleware(authHandler)
  async classify(req: Request) {
    const text: string[] = req.body.text;
    joiValidate({ text: Joi.array().required() }, { text });
    return classifyTokens(text, () => {});
  }

  @Post("parse-email")
  @Middleware(authHandler)
  async parseEmail(req: Request) {
    const text: string = req.body.text;
    joiValidate({ text: Joi.array().required() }, { text });
    return parseEmail(text);
  }

  @Post("smart-tokenize")
  @Middleware(authHandler)
  async smartTokenize(req: Request) {
    const text: string = req.body.text;
    const from: AddressObject = req.body.from;
    joiValidate(
      { text: Joi.string().required(), from: Joi.object() },
      { text, from }
    );
    return smartTokensFromText(text, from);
  }

  @Post("perform-action")
  @Middleware(authHandler)
  async performAction(req: Request, res: Response) {
    const token: ApiKeyResponse = res.locals.token;
    const text: string = req.body.text;
    const organizationId = token.organizationId;
    joiValidate(
      {
        text: Joi.string().required(),
        organizationId: Joi.string().required(),
      },
      { text, organizationId }
    );
    return {};
    // return performAction(organizationId, req.body, text, () => {});
  }

  @Get("read-receipt")
  @Middleware(validator({ token: Joi.string() }, "query"))
  async readReceiptEmail(req: Request, res: Response) {
    const token = req.query.token as string;
    trackOutgoingEmail(token)
      .then(() => {})
      .catch(() => {});
    res.writeHead(200, { "Content-Type": "image/gif" });
    res.end(
      Buffer.from("R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=", "base64"),
      "binary"
    );
  }

  @Get("meeting-page/:username/:id")
  @Middleware(
    validator(
      { username: Joi.string().required(), id: Joi.string().required() },
      "params"
    )
  )
  @Middleware(validator({ jwt: Joi.string().required() }, "query"))
  async getMeetingDetails(req: Request) {
    return getPublicMeetingDetails(
      req.params.username,
      req.params.id,
      req.query.jwt
    );
  }

  @Post("confirm-meeting/:organizaionId/:meetingId")
  @Middleware(
    validator(
      {
        token: Joi.string().required(),
        guestName: Joi.string().required(),
        guestEmail: Joi.string().required(),
        guestTimezone: Joi.string().required(),
        duration: Joi.number().required(),
        selectedDatetime: Joi.any().required(),
      },
      "body"
    )
  )
  async confirmMeeting(req: Request) {
    const id = await organizationUsernameToId(req.params.id);
    return confirmMeetingForGuest(id, req.params.meetingId, req.body);
  }

  @Post("track/:index")
  async track(req: Request, res: Response) {
    const index = req.params.index;
    const data = req.body;
    joiValidate(
      {
        index: Joi.string().required(),
        data: Joi.object().required(),
      },
      { index, data }
    );
    trackAnalyticsEvent(res.locals, index, data)
      .then(() => {})
      .catch(() => {});
    return { queued: true };
  }

  @Get("calendar-connection/google")
  async getOAuthUrlGoogleCalendar(req: Request, res: Response) {
    safeRedirect(req, res, googleCalendarClient.client.code.getUri());
  }

  @Get("calendar-connection/google/callback")
  async getOAuthCallbackGoogleCalendar(req: Request, res: Response) {
    return googleCalendarClient.callback(
      `${BASE_URL}/auth${req.path}?${stringify(req.query)}`
    );
  }
}
