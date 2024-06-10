import {
  ContentAccessType,
  LinkPermissionType,
  LoginFormType,
  SignUpFormType,
  UserType,
} from "@/types";

export function validatePassword(password: string) {
  if (password === "") return "Password is required!";
  else if (password.length < 6)
    return "Password must be at least 6 characters.";
  return undefined;
}

export function validateFormSignUp(user: SignUpFormType) {
  const { email = "", password = "", username = "", name } = user;

  const errors: Partial<Record<keyof SignUpFormType, string>> = {};

  if (email === "") errors.email = "Email is required!";

  if (username === "") errors.username = "Username is required!";
  else if (/a-zA-Z0-9/g.test(username))
    errors.username = "Username must be alphanumeric.";
  else if (username.length < 4)
    errors.username = "Username must be at least 4 characters.";
  else if (username.length > 32) errors.username = "Username is too long!";

  if (name && name.length < 3)
    errors.name = "Name must be at least 3 characters.";
  else if (name && name.length > 32) errors.name = "Name is too long!";

  const errorPassword = validatePassword(password);
  if (errorPassword) errors.password = errorPassword;

  return errors;
}

export function validateFormLogin(params: LoginFormType) {
  const { email = "", password = "" } = params;

  const errors: Partial<Record<keyof LoginFormType, string>> = {};

  if (email === "") errors.email = "Email is required!";

  if (password === "") errors.password = "Password is required!";

  return errors;
}

export function getPermissionForContent<
  T extends {
    authorId: string;
  }
>({
  content,
  user,
}: {
  content: T;
  user?: UserType | null;
}): ContentAccessType {
  if (!user || content.authorId !== user.id) return "viewer";

  if (user.role === "admin") return "admin";

  if (content.authorId === user.id) return "author";

  return "viewer";
}

export function checkPermission(
  perm: ContentAccessType,
  leastAllowed?: ContentAccessType
) {
  if (!leastAllowed) return true;

  const order: ContentAccessType[] = ["viewer", "author", "admin"];

  const perm1 = order.indexOf(perm);
  const perm2 = order.indexOf(leastAllowed);

  return perm1 >= perm2;
}

export function checkPermissionLink(
  perm: LinkPermissionType,
  leastAllowed?: LinkPermissionType
) {
  if (!leastAllowed) return true;

  const exclusive = !leastAllowed.endsWith("+");
  const phrase = (
    exclusive ? leastAllowed : leastAllowed.slice(0, -1)
  ) as LinkPermissionType;
  const order: LinkPermissionType[] = ["guest", "user", "admin"];

  const perm1 = order.indexOf(perm);
  const perm2 = order.indexOf(phrase);

  return exclusive ? perm === leastAllowed : perm1 >= perm2;
}
