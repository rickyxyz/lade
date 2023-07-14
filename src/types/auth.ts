export interface UserType {
  id: string;
  username: string;
  role?: string;
  joinDate: number;
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
