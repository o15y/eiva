import {
  RESOURCE_CREATED,
  RESOURCE_DELETED,
  RESOURCE_UPDATED,
  respond,
} from "@staart/messages";
import {
  ChildControllers,
  ClassMiddleware,
  Controller,
  Delete,
  Get,
  Middleware,
  Patch,
  Put,
  Request,
  Response,
} from "@staart/server";
import { Joi, joiValidate } from "@staart/validate";
import { authHandler, validator } from "../../../_staart/helpers/middleware";
import {
  localsToTokenOrKey,
  organizationUsernameToId,
} from "../../../_staart/helpers/utils";
import {
  deleteOrganizationForUser,
  getAllOrganizationDataForUser,
  getOrganizationForUser,
  newOrganizationForUser,
  updateOrganizationForUser,
} from "../../../_staart/rest/organization";

@ClassMiddleware(authHandler)
export class OrganizationController {
  @Get()
  async get(req: Request, res: Response) {
    const id = await organizationUsernameToId(req.params.id);
    joiValidate({ id: Joi.string().required() }, { id });
    const organization = await getOrganizationForUser(
      localsToTokenOrKey(res),
      id
    );
    return organization;
  }

  @Patch()
  @Middleware(
    validator(
      {
        name: Joi.string(),
        username: Joi.string().regex(/^[a-z0-9\-]+$/i),
        forceTwoFactor: Joi.boolean(),
        autoJoinDomain: Joi.boolean(),
        onlyAllowDomain: Joi.boolean(),
        ipRestrictions: Joi.string(),
        profilePicture: Joi.string(),
        assistantName: Joi.string(),
        assistantSignature: Joi.string(),
        schedulingDays: Joi.string(),
        schedulingTimeStart: Joi.string(),
        schedulingTimeEnd: Joi.string(),
        schedulingPadding: [Joi.string(), Joi.number()],
        schedulingDuration: [Joi.string(), Joi.number()],
        schedulingType: Joi.string(),
        schedulingLocation: [Joi.string(), Joi.number()],
        calendars: Joi.string(),
        customEmailEnabled: Joi.boolean(),
        customEmailAddress: Joi.string(),
        customEmailHost: Joi.string(),
        customEmailPort: Joi.string(),
        customEmailSecure: Joi.boolean(),
        customEmailUsername: Joi.string(),
        customEmailPassword: Joi.string(),
        clearbitApiKey: Joi.string(),
        customCalendarUrl: Joi.string(),
        unsubscribeLink: Joi.boolean(),
        readReceipts: Joi.boolean(),
      },
      "body"
    )
  )
  async patch(req: Request, res: Response) {
    const id = await organizationUsernameToId(req.params.id);
    joiValidate({ id: Joi.string().required() }, { id });
    const updated = await updateOrganizationForUser(
      localsToTokenOrKey(res),
      id,
      req.body,
      res.locals
    );
    return { ...respond(RESOURCE_UPDATED, { resource: "Team" }), updated };
  }

  @Delete()
  async delete(req: Request, res: Response) {
    const organizationId = await organizationUsernameToId(req.params.id);
    joiValidate(
      { organizationId: Joi.string().required() },
      { organizationId }
    );
    await deleteOrganizationForUser(
      res.locals.token.id,
      organizationId,
      res.locals
    );
    return respond(RESOURCE_DELETED);
  }

  @Get("data")
  async getData(req: Request, res: Response) {
    const organizationId = await organizationUsernameToId(req.params.id);
    joiValidate(
      { organizationId: Joi.string().required() },
      { organizationId }
    );
    return getAllOrganizationDataForUser(
      localsToTokenOrKey(res),
      organizationId
    );
  }
}
