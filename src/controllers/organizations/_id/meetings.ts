import { RESOURCE_DELETED, RESOURCE_UPDATED, respond } from "@staart/messages";
import {
  ClassMiddleware,
  Controller,
  Delete,
  Get,
  Middleware,
  Patch,
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
  getAllMeetingsForOrganization,
  getMeetingForOrganization,
  updateMeetingForOrganization,
  deleteMeetingForOrganization,
  getMeetingIncomingEmailsForOrganization,
  getMeetingIncomingEmailForOrganization,
} from "../../../ara/services/crud/meetings";

@ClassMiddleware(authHandler)
export class OrganizationMeetingsController {
  @Get()
  async getOrganizationMeetings(req: Request, res: Response) {
    const id = await organizationUsernameToId(req.params.id);
    joiValidate({ id: Joi.string().required() }, { id });
    return getAllMeetingsForOrganization(
      localsToTokenOrKey(res),
      id,
      req.query
    );
  }

  @Get(":meetingId")
  async getOrganizationMeeting(req: Request, res: Response) {
    const id = await organizationUsernameToId(req.params.id);
    const meetingId = req.params.meetingId;
    joiValidate(
      {
        id: Joi.string().required(),
        meetingId: Joi.string().required(),
      },
      { id, meetingId }
    );
    return getMeetingForOrganization(localsToTokenOrKey(res), id, meetingId);
  }

  @Patch(":meetingId")
  @Middleware(
    validator(
      {
        proposedTimes: Joi.string(),
        confirmedTime: Joi.string(),
        duration: Joi.number(),
        meetingType: Joi.string(),
        guests: Joi.string(),
        location: Joi.object(),
      },
      "body"
    )
  )
  async patchOrganizationMeeting(req: Request, res: Response) {
    const id = await organizationUsernameToId(req.params.id);
    const meetingId = req.params.meetingId;
    joiValidate(
      {
        id: Joi.string().required(),
        meetingId: Joi.string().required(),
      },
      { id, meetingId }
    );
    const updated = await updateMeetingForOrganization(
      localsToTokenOrKey(res),
      id,
      meetingId,
      req.body
    );
    return { ...respond(RESOURCE_UPDATED), updated };
  }

  @Delete(":meetingId")
  async deleteOrganizationMeeting(req: Request, res: Response) {
    const id = await organizationUsernameToId(req.params.id);
    const meetingId = req.params.meetingId;
    joiValidate(
      {
        id: Joi.string().required(),
        meetingId: Joi.string().required(),
      },
      { id, meetingId }
    );
    await deleteMeetingForOrganization(localsToTokenOrKey(res), id, meetingId);
    return respond(RESOURCE_DELETED);
  }

  @Get(":meetingId/emails")
  async getOrganizationMeetingEmails(req: Request, res: Response) {
    const id = await organizationUsernameToId(req.params.id);
    const meetingId = req.params.meetingId;
    joiValidate(
      {
        id: Joi.string().required(),
        meetingId: Joi.string().required(),
      },
      { id, meetingId }
    );
    return getMeetingIncomingEmailsForOrganization(
      localsToTokenOrKey(res),
      id,
      meetingId,
      req.query
    );
  }

  @Get(":meetingId/emails/:emailId")
  async getOrganizationMeetingEmail(req: Request, res: Response) {
    const id = await organizationUsernameToId(req.params.id);
    const meetingId = req.params.meetingId;
    const emailId = req.params.emailId;
    joiValidate(
      {
        id: Joi.string().required(),
        meetingId: Joi.string().required(),
        emailId: Joi.string().required(),
      },
      { id, meetingId, emailId }
    );
    return getMeetingIncomingEmailForOrganization(
      localsToTokenOrKey(res),
      id,
      meetingId,
      emailId
    );
  }
}
