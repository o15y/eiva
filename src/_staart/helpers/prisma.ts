import { PrismaClient } from "@prisma/client";
import { cleanup } from "@staart/server";
import { complete, success } from "@staart/errors";
import { getConfig } from "@staart/config";

export const prisma = new PrismaClient({
  log: ["info", "warn"],
});

cleanup(() => {
  complete("Gracefully exiting Staart API app");
  prisma.disconnect().then(() => success("Disconnected database connection"));
});

export const queryParamsToSelect = (queryParams: any) => {
  const data: any = {};

  ["first", "last", "skip"].forEach((i: string) => {
    if (
      typeof queryParams[i] === "string" &&
      !isNaN(parseInt(queryParams[i]))
    ) {
      data[i] = parseInt(queryParams[i]);
    }
  });

  ["before", "after"].forEach((i: string) => {
    if (
      typeof queryParams[i] === "string" &&
      !isNaN(parseInt(queryParams[i]))
    ) {
      data[i] = {
        id: parseInt(queryParams[i]),
      };
    }
  });

  ["select", "include"].forEach((i: string) => {
    if (typeof queryParams[i] === "string") {
      queryParams[i]
        .split(",")
        .map((j: string) => j.trim())
        .forEach((j: string) => {
          data[i] = data[i] || {};
          data[i][j] = true;
        });
    }
  });

  const orderBy = queryParams.orderBy;
  if (typeof orderBy === "string") {
    const orders = orderBy.split(",").map((i: string) => i.trim());
    orders.forEach((order) => {
      data.orderBy = data.orderBy || {};
      data.orderBy[order.split(":")[0]] =
        order.includes(":") && order.split(":")[1] === "desc" ? "desc" : "asc";
    });
  }

  /**
   * Temporary fixes for @prisma/* beta 7
   * New pagination removes `first`, `last`, `before`, `after`
   * in favor of `cursor` and `take`
   * @source https://github.com/prisma/prisma/releases/tag/2.0.0-beta.7
   */
  if (typeof data.first !== "undefined") {
    data.take = data.first;
    delete data.first;
  }
  if (typeof data.last !== "undefined") {
    data.take = data.last;
    delete data.last;
  }
  if (typeof data.before !== "undefined") {
    data.cursor = data.before;
    delete data.before;
  }
  if (typeof data.after !== "undefined") {
    data.cursor = data.after;
    delete data.after;
  }
  if (typeof data.skip === "undefined") {
    data.skip = 1;
  }

  return data;
};

export const paginatedResult = <T>(
  data: T,
  { first, last }: { first?: number; last?: number }
) => {
  const dataArray = (data as any) as { id: number }[];
  const hasMore = dataArray.length >= (first || last || Infinity);
  return {
    data,
    hasMore,
    next: hasMore ? dataArray[dataArray.length - 1].id : undefined,
  };
};
