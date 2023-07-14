import { UserMapType, UserType } from "@/types";
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

interface UsersActionMapType {
  update_users: UserMapType;
  reset_users: undefined | Record<string, never>;
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

export const usersReducer: ReducerRawType<UsersActionMapType> = {
  update_users: (state, action) => {
    const value = {
      ...(state ?? {}),
      ...action.payload,
    };
    state = value;
    return value;
  },
  reset_users(state) {
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

const usersSlice = createSlice({
  name: "users",
  initialState: {} as UserMapType | null,
  reducers: usersReducer as unknown as ReducerType<UserMapType>,
});

const reducer = {
  user: userSlice.reducer,
  users: usersSlice.reducer,
};

export const action = {
  ...userSlice.actions,
  ...usersSlice.actions,
};

export type ActionTypes = UserActionMapType & UsersActionMapType;

export type ActionKeyTypes = keyof ActionTypes;

export default reducer;
