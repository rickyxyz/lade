export interface UserType {
  id: string;
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
