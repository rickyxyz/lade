"use client";
import { PageTemplate } from "@/templates";
import { ProblemQuery, ProblemType, SolvedPublicType, UserType } from "@/types";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAppSelector } from "@/libs/redux";
import { API } from "@/api";
import { Card, Paragraph } from "@/components";
import Image from "next/image";
import { ProblemDetailTopics } from "@/features/ProblemDetail";
import { timeAgo } from "@/utils";

interface ProfilePageProps {
  id: string;
}

export function ProfilePage({ id }: ProfilePageProps) {
  const [user, setUser] = useState<UserType | null>(null);
  const [solveds, setSolveds] = useState<SolvedPublicType[]>([]);
  const [loading, setLoading] = useState<{
    user: boolean;
    lastSolved: boolean;
  }>({
    user: true,
    lastSolved: true,
  });
  const self = useAppSelector("user");

  const handleGetUser = useCallback(() => {
    if (false && self && id === self.id) {
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
        .catch(() => {})
        .finally(() => {
          setLoading((prev) => ({
            ...prev,
            user: false,
          }));
        });

      API("get_solveds", {
        params: {
          userId: id,
        },
      })
        .then(({ data: result }) => {
          setSolveds(result);
        })
        .catch(() => {})
        .finally(() => {
          setLoading((prev) => ({
            ...prev,
            lastSolved: false,
          }));
        });
    }
  }, [id, self]);

  useEffect(() => {
    handleGetUser();
  }, [handleGetUser]);

  return (
    <PageTemplate title={user ? user.id : "User Profile"}>
      {user && (
        <div className="flex flex-col lg:flex-row gap-8">
          <Card className="flex flex-col items-center justify-center lg:min-w-[320px] lg:max-w-[320px]">
            <Image
              className="mb-8"
              src="/user.svg"
              width={128}
              height={128}
              alt="User Profile Picture"
            />
            <Paragraph size="l" weight="semibold">
              User Name Here
            </Paragraph>
            <Paragraph>{user.id}</Paragraph>
          </Card>
          <Card className="flex-grow flex flex-col gap-4">
            <Paragraph tag="h2" weight="semibold">
              Last Solved
            </Paragraph>
            {solveds.map(
              ({ id, problem: { title, topic, subTopic }, createdAt }) => (
                <div className="flex justify-between items-center" key={id}>
                  <div>
                    <Paragraph>{title}</Paragraph>
                    <ProblemDetailTopics topic={topic} subTopic={subTopic} />
                  </div>
                  <Paragraph>{timeAgo(new Date(createdAt))}</Paragraph>
                </div>
              )
            )}
          </Card>
        </div>
      )}
    </PageTemplate>
  );
}
