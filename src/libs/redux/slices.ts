import {
  ProblemTopicLinkType,
  ProblemTopicType,
  SolvedMapType,
  UserMapType,
  UserType,
} from "@/types";
import {
  SliceCaseReducers,
  ValidateSliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";

type ReducerType<T> = ValidateSliceCaseReducers<
  T | null,
  SliceCaseReducers<T | null>
>;

interface UserActionMapType {
  update_user: UserType;
  reset_user: undefined | null;
}

interface SolvedActionMapType {
  update_solveds: SolvedMapType;
  reset_solveds: undefined | Record<string, never>;
}

interface TopicActionMapType {
  update_topics: ProblemTopicLinkType;
  reset_topics: undefined | Record<string, never>;
}

type ReducerRawType<X> = {
  [Y in keyof X]: (
    state: X[Y],
    action: {
      payload: X[Y];
      type: string;
    }
  ) => void;
};

export const userReducer: ReducerRawType<UserActionMapType> = {
  update_user(state, action) {
    state = action.payload;
    return state;
  },
  reset_user(state) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    state = null;
    return state;
  },
};

export const solvedReducer: ReducerRawType<SolvedActionMapType> = {
  update_solveds: (state, action) => {
    const value = {
      ...(state ?? {}),
      ...action.payload,
    };
    state = value;
    return value;
  },
  reset_solveds(state) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    state = {};
    return state;
  },
};

export const topicsReducer: ReducerRawType<TopicActionMapType> = {
  update_topics: (state, action) => {
    const value = {
      ...(state ?? {}),
      ...action.payload,
    };
    state = value;
    return value;
  },
  reset_topics(state) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    state = undefined;
    return state;
  },
};

const userSlice = createSlice({
  name: "user",
  initialState: null as UserType | null,
  reducers: userReducer as unknown as ReducerType<UserType>,
});

const solvedSlice = createSlice({
  name: "solveds",
  initialState: {} as SolvedMapType | null,
  reducers: solvedReducer as unknown as ReducerType<SolvedMapType>,
});

const topicsSlice = createSlice({
  name: "topics",
  initialState: {} as ProblemTopicLinkType | null,
  reducers: topicsReducer as unknown as ReducerType<ProblemTopicLinkType>,
});

const reducer = {
  user: userSlice.reducer,
  solveds: solvedSlice.reducer,
  // topics: topicsSlice.reducer,
};

export const action = {
  ...userSlice.actions,
  ...solvedSlice.actions,
  // ...topicsSlice.actions,
};

export type ActionTypes = UserActionMapType & SolvedActionMapType;

export type ActionKeyTypes = keyof ActionTypes;

export default reducer;
