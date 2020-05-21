import { KeyValue } from "../interfaces/general";
import { organizationsCreateInput, organizationsUpdateInput, api_keysCreateInput, api_keysUpdateInput, domainsCreateInput, organizations } from "@prisma/client";
/**
 * Check if an organization username is available
 */
export declare const checkOrganizationUsernameAvailability: (username: string) => Promise<boolean>;
export declare const createOrganization: (organization: organizationsCreateInput, ownerId: string) => Promise<organizations>;
export declare const updateOrganization: (id: string | number, organization: organizationsUpdateInput) => Promise<organizations>;
/**
 * Get an API key
 */
export declare const getApiKeyLogs: (apiKeyId: string, query: KeyValue) => Promise<any>;
/**
 * Create an API key
 */
export declare const createApiKey: (apiKey: api_keysCreateInput) => Promise<import(".prisma/client").api_keys>;
/**
 * Update a user's details
 */
export declare const updateApiKey: (apiKeyId: string, data: api_keysUpdateInput) => Promise<import(".prisma/client").api_keys>;
/**
 * Get a domain
 */
export declare const getDomainByDomainName: (domain: string) => Promise<import(".prisma/client").domains>;
export declare const refreshOrganizationProfilePicture: (organizationId: string | number) => Promise<organizations>;
/**
 * Create a domain
 */
export declare const createDomain: (domain: domainsCreateInput) => Promise<import(".prisma/client").domains>;
/**
 * Get a user by their username
 */
export declare const checkDomainAvailability: (username: string) => Promise<boolean>;
/**
 * Get a organization object from its ID
 * @param id - User ID
 */
export declare const getOrganizationById: (id: number | string) => Promise<organizations>;
/**
 * Get a organization object from its username
 * @param username - User's username
 */
export declare const getOrganizationByUsername: (username: string) => Promise<organizations>;
