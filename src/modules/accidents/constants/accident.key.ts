import { AccidentFilters } from "../schemas/accident.schema";

export const accidentKeys = {
  all: ["accidents"] as const,
  lists: () => [...accidentKeys.all, "list"] as const,
  list: (filters: AccidentFilters) => [...accidentKeys.lists(), filters] as const,
};