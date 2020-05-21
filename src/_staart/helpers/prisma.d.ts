import { PrismaClient } from "@prisma/client";
export declare const prisma: PrismaClient<{
    log: ("info" | "warn")[];
}, never>;
export declare const queryParamsToSelect: (queryParams: any) => any;
export declare const paginatedResult: <T>(data: T, { first, last }: {
    first?: number | undefined;
    last?: number | undefined;
}) => {
    data: T;
    hasMore: boolean;
    next: number | undefined;
};
