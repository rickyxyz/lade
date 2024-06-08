import { ProfilePage } from "@/features/Profile/pages";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  return <ProfilePage id={id} />;
}
