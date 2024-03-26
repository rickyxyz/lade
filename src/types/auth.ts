export interface UserType {
  id: string;
  uid: string;
  email: string;
  role?: string;
  joinDate: string;
}

export type UserMapType = Record<string, UserType>;

export interface SignUpFormType {
  email: string;
  username: string;
  password: string;
}

export interface LoginFormType {
  email: string;
  password: string;
}

export type ContentViewType = "view" | "edit";
export type ContentEditType = "create" | "edit";
export type ContentAccessType = "viewer" | "author" | "admin";

export type RoleType = "guest" | "user" | "admin";
export type LinkPermissionType = "guest+" | "user+" | RoleType;
