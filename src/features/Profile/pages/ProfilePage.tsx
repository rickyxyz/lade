"use client";
import { useCallback, useEffect, useState } from "react";
import { PageTemplate } from "@/templates";
import { SolvedPublicType, UserType } from "@/types";
import { API } from "@/api";
import { ProfileCard } from "../components/ProfileCard";
import { ProfileLastSolved } from "../components/ProfileLastSolved";

interface ProfilePageProps {
  id: string;
  self?: UserType;
}

export function ProfilePage({ id, self }: ProfilePageProps) {
  const [user, setUser] = useState<UserType | null>(null);
  const [solveds, setSolveds] = useState<SolvedPublicType[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingSolved, setLoadingSolved] = useState(true);

  const handleGetUser = useCallback(() => {
    if (self && id === self.id) {
      setUser(self);
    } else {
      API("get_user", {
        params: {
          id,
        },
      })
        .then(({ data: result }) => {
          setUser(result);
        })
        .catch(() => {
          /**
           * @todo
           * show feedback
           */
        })
        .finally(() => {
          setLoadingUser(false);
        });

      API("get_solveds", {
        params: {
          userId: id,
        },
      })
        .then(({ data: result }) => {
          setSolveds(result);
        })
        .catch(() => {
          /**
           * @todo
           * show feedback
           */
        })
        .finally(() => {
          setLoadingSolved(false);
        });
    }
  }, [id, self]);

  useEffect(() => {
    handleGetUser();
  }, [handleGetUser]);

  return (
    <PageTemplate title={user ? user.id : "User Profile"}>
      <div className="flex flex-col lg:flex-row gap-8">
        <ProfileCard user={user} loading={loadingUser} />
        <ProfileLastSolved solveds={solveds} loading={loadingSolved} />
      </div>
    </PageTemplate>
  );
}
