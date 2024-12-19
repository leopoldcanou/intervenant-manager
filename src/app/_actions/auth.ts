"use server";

import { signIn } from "@/auth";
import { redirect } from "next/navigation";

export async function handleSignIn(formData: FormData) {
  await signIn("credentials", {
    ...Object.fromEntries(formData)
  });
  redirect("/");
} 