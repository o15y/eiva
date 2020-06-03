import {
  prisma,
  paginatedResult,
  queryParamsToSelect,
} from "../../../_staart/helpers/prisma";
import { can } from "../../../_staart/helpers/authorization";
import { OrgScopes } from "../../../_staart/interfaces/enum";
import { locationsUpdateInput, locationsCreateInput } from "@prisma/client";
import { INSUFFICIENT_PERMISSION, RESOURCE_NOT_FOUND } from "@staart/errors";
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
    return prisma.locations.create({
      data: {
        ...data,
        organization: { connect: { id: parseInt(organizationId) } },
      },
    });
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
  ) {
    /**
     * Make sure at least 2 locations exist
     * You cannot delete your location without a backup location
     */
    const locations = await prisma.locations.findMany({
      where: { organizationId: parseInt(organizationId) },
      take: 2,
    });
    if (locations.length === 1)
      throw new Error("400/cannot-delete-sole-location");

    /** Make sure this location exists */
    const locationDetails = await prisma.locations.findOne({
      where: { id: parseInt(meetingId) },
    });
    if (!locationDetails) throw new Error(RESOURCE_NOT_FOUND);

    /** Find primary location for this team */
    const primaryLocationId = await prisma.organizations.findOne({
      where: { id: parseInt(organizationId) },
      select: { schedulingLocation: true },
    });

    /** If this is the primary location, set another one */
    if (
      primaryLocationId &&
      primaryLocationId.schedulingLocation === locationDetails.id
    ) {
      const anotherLocation = await prisma.locations.findMany({
        take: 1,
        where: {
          organizationId: parseInt(organizationId),
          id: { not: locationDetails.id },
        },
        orderBy: { id: "desc" },
      });
      if (!anotherLocation.length)
        throw new Error("400/cannot-delete-sole-location");
      await prisma.organizations.update({
        where: { id: parseInt(organizationId) },
        data: { schedulingLocation: anotherLocation[0].id },
      });
    }

    /** Finally, delete this location */
    return prisma.locations.delete({ where: { id: parseInt(meetingId) } });
  }
  throw new Error(INSUFFICIENT_PERMISSION);
};
