"use client";
import { handleSignIn } from "@/app/_actions/auth";
import { useTransition } from "react";

export function SignIn() {
  const [isPending, startTransition] = useTransition();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => {
      handleSignIn(formData);
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <label>
        Email
        <input name="email" type="email" />
      </label>
      <label>
        Password
        <input name="password" type="password" />
      </label>
      <button disabled={isPending}>
        {isPending ? "Loading..." : "Sign In"}
      </button>
    </form>
  );
}
