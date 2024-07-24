export const API_FAIL_MESSAGE = "fail";
export const API_SUCCESS_MESSAGE = "ok";

export const API_MESSAGE: Record<number, string> = {
  200: "Ok",
  201: "Created",
  204: "No content",
  400: "Bad request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not found",
  500: "Internal server error",
};

export type ApiMessageCode = (typeof API_MESSAGE)[number];
