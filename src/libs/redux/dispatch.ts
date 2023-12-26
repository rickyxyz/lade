// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { ActionKeyTypes, ActionTypes, action } from "./slices";
import { UnknownAction } from "@reduxjs/toolkit";

export function useAppDispatch<X extends ActionKeyTypes>() {
  const dispatch = useDispatch();

  const update = useCallback(
    (path: X, value: ActionTypes[X]) => {
      const dispatcher = action[path];

      dispatch(dispatcher(value) as UnknownAction);
    },
    [dispatch]
  );

  return useMemo(() => update, [update]);
}

export function useAppSelector<X extends keyof RootState>(key: X) {
  const value = useSelector<RootState>((state) => state[key]) as RootState[X];

  return useMemo(() => value, [value]);
}
