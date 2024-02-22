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
  };
  post_problem: Empty;
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
  get_contests: Empty;
  post_contest: Empty;
}

interface ApiBody {
  get_problem: Empty;
  get_problems: Empty;
  post_problem: ProblemType;
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
  post_contest: ContestType;
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
  get_contests: ContestDatabaseType[];
  post_contest: ApiMessage;
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
  get_contests: {
    path: "/contests",
    method: "GET",
  },
  post_contest: {
    path: "/contest",
    method: "POST",
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
