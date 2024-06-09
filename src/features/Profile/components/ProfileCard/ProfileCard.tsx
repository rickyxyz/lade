import Image from "next/image";
import { Card, Paragraph } from "@/components";
import { UserType } from "@/types";

interface ProfileCardProps {
  user: UserType | null;
  loading?: boolean;
}

export function ProfileCard({ user, loading }: ProfileCardProps) {
  return (
    <Card className="flex flex-col items-center justify-center lg:min-w-[320px] lg:max-w-[320px]">
      {!loading && user ? (
        <>
          <Image
            className="mb-6"
            src="/user.svg"
            width={128}
            height={128}
            alt="User Profile Picture"
          />
          <Paragraph size="l" weight="semibold">
            {user.name ?? user.id}
          </Paragraph>
          <Paragraph>{user.id}</Paragraph>
        </>
      ) : (
        <>
          <div className="skeleton w-1/2 h-4"></div>
        </>
      )}
    </Card>
  );
}
