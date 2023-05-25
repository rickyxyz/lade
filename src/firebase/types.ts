import {
  ProblemDatabaseType,
  ProblemType,
  ProblemWithoutIdType,
} from "@/types";

export type OperationType = "read" | "create" | "update" | "delete";

export interface CrudPathPropertyType {
  type: OperationType;
  collection: string;
  group?: boolean;
}

export type CrudPathType =
  | "get_problem"
  | "get_problems"
  | "set_problem"
  | "update_problem";

type CrudMapType = Record<CrudPathType, any>;

export const CRUD_PATH_PROPERTIES: Record<CrudPathType, CrudPathPropertyType> =
  {
    get_problem: {
      type: "read",
      collection: "problem",
    },
    get_problems: {
      type: "read",
      collection: "problem",
      group: true,
    },
    set_problem: {
      type: "create",
      collection: "problem",
    },
    update_problem: {
      type: "update",
      collection: "problem",
    },
  };

export interface CrudMapPathToParams extends CrudMapType {
  get_problem: GetProblemType;
  get_problems: GetProblemsType;
  set_problem: SetProblemType;
}

export interface CrudMapPathToReturnTypes extends CrudMapType {
  get_problem: ProblemType;
  get_problems: ProblemType[];
}

interface GetProblemType {
  id: string;
}

interface GetProblemsType {}

interface SetProblemType {
  data: ProblemDatabaseType;
}
