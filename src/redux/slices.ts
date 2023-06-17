import { UserType } from "@/types";
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
  update_user: (state, action) => {
    state = action.payload;
    return state;
  },
  reset_user(state) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    state = null;
    return state;
  },
};

const userSlice = createSlice({
  name: "user",
  initialState: null as UserType | null,
  reducers: userReducer as unknown as ReducerType<UserType>,
});

const reducer = {
  user: userSlice.reducer,
};

export const action = {
  ...userSlice.actions,
};

const reducerNames = {};

export type ActionTypes = UserActionMapType;

export type ActionKeyTypes = keyof ActionTypes;

export default reducer;
