import { ProblemTopicType, ProblemType, SolvedType, UserType } from "@/types";
import { api } from "@/utils";
import { AxiosResponse } from "axios";

type Empty = Record<string, never>;

interface ApiMessage {
  message: string;
}

interface ApiParams {
  get_problem: {
    id: string;
  };
  get_problems: {
    topic?: string;
    subTopic?: string;
    sort?: string;
    sortBy?: "asc" | "desc";
    page?: number;
  };
  post_problem: Empty;
  patch_problem: Empty;
  get_solved: {
    userId: string;
    problemId: string;
  };
  post_solved: Empty;
  get_user: {
    uid: string;
  };
  post_user: Empty;
  get_topics: Empty;
}

interface ApiBody {
  get_problem: Empty;
  get_problems: Empty;
  post_problem: ProblemType;
  patch_problem: ProblemType;
  get_solved: Empty;
  post_solved: {
    id: string;
    answer: any;
  };
  get_user: Empty;
  post_user: UserType;
  get_topics: Empty;
}

interface ApiReturn {
  get_problem: ProblemType;
  get_problems: {
    data: ProblemType[];
    pagination: {
      total_records: number;
      next_page: number;
      current_page: number;
      prev_page: number;
      total_pages: number;
    };
  };
  post_problem: ApiMessage;
  patch_problem: ApiMessage;
  get_solved: SolvedType;
  post_solved: ApiMessage;
  get_user: UserType;
  post_user: ApiMessage;
  get_topics: {
    topics: ProblemTopicType[];
    subTopics: ProblemTopicType[];
  };
}

const ROUTES = {
  get_problem: {
    path: "/problem",
    method: "GET",
  },
  get_problems: {
    path: "/problems",
    method: "GET",
  },
  post_problem: {
    path: "/problem",
    method: "POST",
  },
  patch_problem: {
    path: "/problem",
    method: "PATCH",
  },
  get_solved: {
    path: "/solved",
    method: "GET",
  },
  post_solved: {
    path: "/problem/answer",
    method: "POST",
  },
  get_user: {
    path: "/user",
    method: "GET",
  },
  post_user: {
    path: "/user",
    method: "POST",
  },
  get_topics: {
    path: "/topics",
    method: "GET",
  },
};

export async function API<X extends keyof typeof ROUTES>(
  type: X,
  config: {
    params?: ApiParams[X];
    body?: ApiBody[X];
  }
) {
  const { method, path } = ROUTES[type];
  const { params, body } = config;

  return api({
    method,
    url: path,
    params,
    data: body,
  }).then((result) => result as AxiosResponse<ApiReturn[X], any>);
}
