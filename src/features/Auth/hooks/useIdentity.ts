import { crudData } from "@/libs/firebase";
import { useAppDispatch, useAppSelector } from "@/libs/redux";
import { useCallback, useMemo } from "react";

export function useIdentity() {
  const users = useAppSelector("users");
  const dispatch = useAppDispatch();

  const identify = useCallback(
    async (id: string) => {
      if (users && users[id]) {
        return users[id];
      } else {
        const data = await crudData("get_user", {
          id,
        });
        if (data) {
          dispatch("update_users", {
            [id]: data,
          });
        }
        return data;
      }
    },
    [dispatch, users]
  );

  return useMemo(
    () => ({
      identify,
    }),
    [identify]
  );
}
