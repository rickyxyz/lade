import { SolvedMapType, UserMapType, UserType } from "@/types";
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
  update_solved: SolvedMapType;
  reset_solved: undefined | Record<string, never>;
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
  update_solved: (state, action) => {
    const value = {
      ...(state ?? {}),
      ...action.payload,
    };
    state = value;
    return value;
  },
  reset_solved(state) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    state = {};
    return state;
  },
};

const userSlice = createSlice({
  name: "user",
  initialState: null as UserType | null,
  reducers: userReducer as unknown as ReducerType<UserType>,
});

const solvedSlice = createSlice({
  name: "solved",
  initialState: {} as SolvedMapType | null,
  reducers: solvedReducer as unknown as ReducerType<SolvedMapType>,
});

const reducer = {
  user: userSlice.reducer,
  solved: solvedSlice.reducer,
};

export const action = {
  ...userSlice.actions,
  ...solvedSlice.actions,
};

export type ActionTypes = UserActionMapType & SolvedActionMapType;

export type ActionKeyTypes = keyof ActionTypes;

export default reducer;
