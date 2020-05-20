import {
  RESOURCE_DELETED,
  RESOURCE_UPDATED,
  respond,
  RESOURCE_CREATED,
} from "@staart/messages";
import {
  ClassMiddleware,
  Controller,
  Delete,
  Get,
  Put,
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
  createLocationForOrganization,
  getAllLocationsForOrganization,
  getLocationForOrganization,
  updateLocationForOrganization,
  deleteLocationForOrganization,
} from "../../../ara/services/crud/locations";

@ClassMiddleware(authHandler)
export class OrganizationLocationsController {
  @Put()
  @Middleware(
    validator(
      {
        type: Joi.string()
          .allow("VIDEO_CALL", "PHONE_CALL", "IN_PERSON")
          .only()
          .required(),
        value: Joi.string().required(),
        data: Joi.string(),
      },
      "body"
    )
  )
  async createOrganizationLocation(req: Request, res: Response) {
    const id = await organizationUsernameToId(req.params.id);
    joiValidate(
      {
        id: Joi.string().required(),
      },
      { id }
    );
    const added = await createLocationForOrganization(
      localsToTokenOrKey(res),
      id,
      req.body
    );
    return { ...respond(RESOURCE_CREATED), added };
  }

  @Get()
  async getOrganizationLocations(req: Request, res: Response) {
    const id = await organizationUsernameToId(req.params.id);
    joiValidate({ id: Joi.string().required() }, { id });
    return getAllLocationsForOrganization(
      localsToTokenOrKey(res),
      id,
      req.query
    );
  }

  @Get(":locationId")
  async getOrganizationLocation(req: Request, res: Response) {
    const id = await organizationUsernameToId(req.params.id);
    const locationId = req.params.locationId;
    joiValidate(
      {
        id: Joi.string().required(),
        locationId: Joi.string().required(),
      },
      { id, locationId }
    );
    return getLocationForOrganization(localsToTokenOrKey(res), id, locationId);
  }

  @Patch(":locationId")
  @Middleware(
    validator(
      {
        type: Joi.string()
          .allow("VIDEO_CALL", "PHONE_CALL", "IN_PERSON")
          .only(),
        data: Joi.string(),
        value: Joi.string(),
      },
      "body"
    )
  )
  async patchOrganizationLocation(req: Request, res: Response) {
    const id = await organizationUsernameToId(req.params.id);
    const locationId = req.params.locationId;
    joiValidate(
      {
        id: Joi.string().required(),
        locationId: Joi.string().required(),
      },
      { id, locationId }
    );
    const updated = await updateLocationForOrganization(
      localsToTokenOrKey(res),
      id,
      locationId,
      req.body
    );
    return { ...respond(RESOURCE_UPDATED), updated };
  }

  @Delete(":locationId")
  async deleteOrganizationLocation(req: Request, res: Response) {
    const id = await organizationUsernameToId(req.params.id);
    const locationId = req.params.locationId;
    joiValidate(
      {
        id: Joi.string().required(),
        locationId: Joi.string().required(),
      },
      { id, locationId }
    );
    await deleteLocationForOrganization(
      localsToTokenOrKey(res),
      id,
      locationId
    );
    return respond(RESOURCE_DELETED);
  }
}
