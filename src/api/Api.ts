import {
  ContestDatabaseType,
  ContestType,
  ProblemDatabaseType,
  ProblemTopicType,
  ProblemType,
  SolvedPublicType,
  SolvedType,
  UserType,
} from "@/types";
import { Empty, ApiMessage, ApiPagination } from "@/types";
import { api } from "@/utils";
import { addToast } from "@/utils/toast";
import { AxiosResponse } from "axios";

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
  delete_problem: {
    id: number | string;
  };
  get_solved: {
    userId: string;
    problemId: number | string;
  };
  get_solveds: {
    userId: string;
  };
  post_solved: Empty;
  get_user:
    | {
        uid: string;
      }
    | {
        id: string;
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
  delete_contest: {
    id: number | string;
  };
  get_contest: {
    id: number | string;
  };
  patch_contest: Empty;
  post_contest_answer: Empty;
}

interface ApiBody {
  get_problem: Empty;
  get_problems: Empty;
  post_problem: ProblemType;
  post_problems: ProblemType[];
  patch_problem: ProblemType;
  delete_problem: Empty;
  get_solved: Empty;
  get_solveds: Empty;
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
  delete_contest: Empty;
  post_contest_answer: {
    contestId: string;
    problemId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    answer: any;
  };
}

interface ApiReturn {
  get_problem: ProblemType;
  get_problems: {
    data: ProblemDatabaseType[];
    pagination: ApiPagination;
  };
  post_problem: ApiMessage & {
    id: string;
  };
  post_problems: ApiMessage;
  patch_problem: ApiMessage;
  delete_problem: ApiMessage;
  get_solved: SolvedType;
  get_solveds: SolvedPublicType[];
  post_solved: ApiMessage;
  get_user: UserType;
  post_user: ApiMessage;
  get_topics: {
    topics: ProblemTopicType[];
    subTopics: ProblemTopicType[];
  };
  get_contests: {
    data: ContestDatabaseType[];
    pagination: ApiPagination;
  };
  get_contest: ContestDatabaseType;
  post_contest: ApiMessage & {
    id: string;
  };
  patch_contest: ApiMessage;
  delete_contest: ApiMessage;
  post_contest_answer: ApiMessage;
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
  delete_problem: {
    path: "/v1/problem",
    method: "DELETE",
  },
  get_solved: {
    path: "/v1/solved",
    method: "GET",
  },
  get_solveds: {
    path: "/v1/solveds",
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
  delete_contest: {
    path: "/v1/contest",
    method: "DELETE",
  },
  post_contest_answer: {
    path: "/v1/contest/answer",
    method: "POST",
  },
};

export async function API<X extends keyof typeof ROUTES>(
  type: X,
  config: {
    params?: ApiParams[X];
    body?: ApiBody[X];
  },
  callback: {
    onSuccess?: (result: AxiosResponse<ApiReturn[X]>) => void;
    onFail?: (result: AxiosResponse<ApiReturn[X]>) => void;
    showFailMessage?: boolean;
  } = {}
): Promise<AxiosResponse<ApiReturn[X]>> {
  const { method, path } = ROUTES[type];
  const { params, body } = config;
  const { onSuccess, onFail, showFailMessage = true } = callback;

  return (
    (
      api({
        method,
        url: path,
        params,
        data: body,
      }) as Promise<AxiosResponse<ApiReturn[X]>>
    )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((result) => {
        onSuccess && onSuccess(result);
        return result;
      })
      .catch((result) => {
        showFailMessage &&
          addToast({
            text: "Failed to fetch data.",
          });
        onFail && onFail(result);
        return result;
      })
  );
}
