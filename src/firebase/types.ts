import { ProblemDatabaseType, UserType } from "@/types";

export interface CrudPathPropertyType {
  type: OperationType;
  collection: string;
  group?: boolean;
}

export interface CrudMapPathToParams {
  get_problem: GetDataType;
  get_problems: Record<string, never>;
  set_problem: SetDataType<ProblemDatabaseType>;
  update_problem: UpdateDataType<Partial<ProblemDatabaseType>>;
  get_user: GetDataType;
  set_user: SetDataType<UserType>;
  update_user: UpdateDataType<Partial<UserType>>;
}

export interface CrudMapOperationToParams<X = unknown> {
  create: SetDataType<X>;
  read: GetDataType;
  update: UpdateDataType<X>;
  delete: unknown;
}

export type OperationType = keyof CrudMapOperationToParams;

export interface CrudMapPathToReturnTypes {
  get_problem: ProblemDatabaseType;
  get_problems: ProblemDatabaseType[];
  set_problem: { id: string };
  get_user: UserType;
  set_user: { id: string };
}

export type CrudParamsType<K extends keyof CrudMapPathToParams> =
  CrudMapPathToParams[K];

export type CrudReturnType<K extends keyof CrudMapPathToParams> =
  K extends keyof CrudMapPathToReturnTypes
    ? CrudMapPathToReturnTypes[K]
    : never;

export type CrudPathType =
  | keyof CrudMapPathToParams
  | keyof CrudMapPathToReturnTypes;

export const CRUD_PATH_PROPERTIES: Record<CrudPathType, CrudPathPropertyType> =
  {
    get_problem: {
      type: "read",
      collection: "problems",
    },
    get_problems: {
      type: "read",
      collection: "problems",
      group: true,
    },
    set_problem: {
      type: "create",
      collection: "problems",
    },
    update_problem: {
      type: "update",
      collection: "problems",
    },
    get_user: {
      type: "read",
      collection: "users",
    },
    set_user: {
      type: "create",
      collection: "users",
    },
    update_user: {
      type: "update",
      collection: "users",
    },
  };

interface GetDataType {
  id: string;
}

export type SetDataType<X> = {
  id?: string;
  data: X;
};

export type UpdateDataType<X> = {
  id: string;
  data: X;
};
