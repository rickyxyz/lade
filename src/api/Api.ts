import {
  ContestDatabaseType,
  ContestType,
  ProblemDatabaseType,
  ProblemTopicType,
  ProblemType,
  SolvedType,
  UserType,
} from "@/types";
import { api } from "@/utils";
import { AxiosResponse } from "axios";

type Empty = Record<string, never>;

interface ApiMessage {
  message: string;
}

interface ApiParams {
  get_problem: {
    id: number | string;
  };
  get_problems: {
    topic?: string;
    subTopic?: string;
    sort?: string;
    sortBy?: "asc" | "desc";
    page?: number;
    count?: number;
  };
  post_problem: Empty;
  post_problems: Empty;
  patch_problem: Empty;
  get_solved: {
    userId: string;
    problemId: number | string;
  };
  post_solved: Empty;
  get_user: {
    uid: string;
  };
  post_user: Empty;
  get_topics: Empty;
  get_contests: {
    topic?: string;
    subTopic?: string;
    sort?: string;
    sortBy?: "asc" | "desc";
    page?: number;
  };
  post_contest: Empty;
  get_contest: {
    id: number | string;
  };
  patch_contest: Empty;
}

interface ApiBody {
  get_problem: Empty;
  get_problems: Empty;
  post_problem: ProblemType;
  post_problems: ProblemType[];
  patch_problem: ProblemType;
  get_solved: Empty;
  post_solved: {
    id: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    answer: any;
  };
  get_user: Empty;
  post_user: UserType;
  get_topics: Empty;
  get_contests: Empty;
  get_contest: Empty;
  post_contest: ContestType;
  patch_contest: ContestType;
}

interface ApiReturn {
  get_problem: ProblemType;
  get_problems: {
    data: ProblemDatabaseType[];
    pagination: {
      total_records: number;
      next_page: number;
      current_page: number;
      prev_page: number;
      total_pages: number;
    };
  };
  post_problem: ApiMessage & {
    id: string;
  };
  post_problems: ApiMessage;
  patch_problem: ApiMessage;
  get_solved: SolvedType;
  post_solved: ApiMessage;
  get_user: UserType;
  post_user: ApiMessage;
  get_topics: {
    topics: ProblemTopicType[];
    subTopics: ProblemTopicType[];
  };
  get_contests: {
    data: ContestDatabaseType[];
    pagination: {
      total_records: number;
      next_page: number;
      current_page: number;
      prev_page: number;
      total_pages: number;
    };
  };
  get_contest: ContestDatabaseType;
  post_contest: ApiMessage & {
    id: string;
  };
  patch_contest: ApiMessage;
}

const ROUTES = {
  get_problem: {
    path: "/v1/problem",
    method: "GET",
  },
  get_problems: {
    path: "/v1/problems",
    method: "GET",
  },
  post_problem: {
    path: "/v1/problem",
    method: "POST",
  },
  post_problems: {
    path: "/v2/problem",
    method: "POST",
  },
  patch_problem: {
    path: "/v1/problem",
    method: "PATCH",
  },
  get_solved: {
    path: "/v1/solved",
    method: "GET",
  },
  post_solved: {
    path: "/v1/problem/answer",
    method: "POST",
  },
  get_user: {
    path: "/v1/user",
    method: "GET",
  },
  post_user: {
    path: "/v1/user",
    method: "POST",
  },
  get_topics: {
    path: "/v1/topics",
    method: "GET",
  },
  get_contests: {
    path: "/v1/contests",
    method: "GET",
  },
  get_contest: {
    path: "/v1/contest",
    method: "GET",
  },
  post_contest: {
    path: "/v1/contest",
    method: "POST",
  },
  patch_contest: {
    path: "/v1/contest",
    method: "PATCH",
  },
};

export async function API<X extends keyof typeof ROUTES>(
  type: X,
  config: {
    params?: ApiParams[X];
    body?: ApiBody[X];
  }
) {
  console.log("Execute API");
  const { method, path } = ROUTES[type];
  const { params, body } = config;

  return api({
    method,
    url: path,
    params,
    data: body,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }).then((result) => result as AxiosResponse<ApiReturn[X], any>);
}
