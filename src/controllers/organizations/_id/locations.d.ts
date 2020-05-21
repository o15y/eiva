/// <reference types="express" />
import { Request, Response } from "@staart/server";
export declare class OrganizationLocationsController {
    createOrganizationLocation(req: Request, res: Response): Promise<{
        added: import(".prisma/client").locations;
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
    getOrganizationLocations(req: Request, res: Response): Promise<{
        data: import(".prisma/client").locations[];
        hasMore: boolean;
        next: number | undefined;
    }>;
    getOrganizationLocation(req: Request, res: Response): Promise<import(".prisma/client").locations | null>;
    patchOrganizationLocation(req: Request, res: Response): Promise<{
        updated: import(".prisma/client").locations;
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
    deleteOrganizationLocation(req: Request, res: Response): Promise<{
        code: number;
        success: boolean;
        message: string;
        text: string | undefined;
    }>;
}
