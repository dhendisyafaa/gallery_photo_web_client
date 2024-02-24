"use client";

import FormEditProfileUser from "@/components/form/formEditProfileUser";
import { useUserData } from "@/hooks/useUserData";
import { useUserByUsername } from "../api/resolver/userResolver";

export default function ProfileForm() {
  const { username } = useUserData();
  const { data: profileUser, isLoading } = useUserByUsername(username);
  if (isLoading) return <p>load...</p>;

  const profile = profileUser.data.data;

  return <FormEditProfileUser profile={profile} />;
}
