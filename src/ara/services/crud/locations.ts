import {
  prisma,
  paginatedResult,
  queryParamsToSelect,
} from "../../../_staart/helpers/prisma";
import { can } from "../../../_staart/helpers/authorization";
import { OrgScopes } from "../../../_staart/interfaces/enum";
import { locationsUpdateInput, locationsCreateInput } from "@prisma/client";
import { INSUFFICIENT_PERMISSION } from "@staart/errors";
import { ApiKeyResponse } from "../../../_staart/helpers/jwt";

export const getAllLocationsForOrganization = async (
  tokenUserId: string | ApiKeyResponse,
  organizationId: string,
  queryParams: any
) => {
  if (
    await can(tokenUserId, OrgScopes.READ_ORG, "organization", organizationId)
  ) {
    return paginatedResult(
      await prisma.locations.findMany({
        where: { organizationId: parseInt(organizationId) },
        ...queryParamsToSelect(queryParams),
      }),
      { first: queryParams.first, last: queryParams.last }
    );
  }
  throw new Error(INSUFFICIENT_PERMISSION);
};

export const getLocationForOrganization = async (
  tokenUserId: string | ApiKeyResponse,
  organizationId: string,
  meetingId: string
) => {
  if (
    await can(tokenUserId, OrgScopes.READ_ORG, "organization", organizationId)
  )
    return prisma.locations.findOne({ where: { id: parseInt(meetingId) } });
  throw new Error(INSUFFICIENT_PERMISSION);
};

export const createLocationForOrganization = async (
  tokenUserId: string | ApiKeyResponse,
  organizationId: string,
  data: locationsCreateInput
) => {
  if (
    await can(tokenUserId, OrgScopes.UPDATE_ORG, "organization", organizationId)
  )
    return prisma.locations.create({ data });
  throw new Error(INSUFFICIENT_PERMISSION);
};

export const updateLocationForOrganization = async (
  tokenUserId: string | ApiKeyResponse,
  organizationId: string,
  meetingId: string,
  data: locationsUpdateInput
) => {
  if (
    await can(tokenUserId, OrgScopes.UPDATE_ORG, "organization", organizationId)
  )
    return prisma.locations.update({
      where: { id: parseInt(meetingId) },
      data,
    });
  throw new Error(INSUFFICIENT_PERMISSION);
};

export const deleteLocationForOrganization = async (
  tokenUserId: string | ApiKeyResponse,
  organizationId: string,
  meetingId: string
) => {
  if (
    await can(tokenUserId, OrgScopes.UPDATE_ORG, "organization", organizationId)
  )
    return prisma.locations.delete({ where: { id: parseInt(meetingId) } });
  throw new Error(INSUFFICIENT_PERMISSION);
};
