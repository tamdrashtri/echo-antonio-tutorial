"use client"

import { useQuery, useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";

export default function Page() {
  const users = useQuery(api.users.getMany);
  const add = useMutation(api.users.add);

  return (
    <>
    <Authenticated>
    <div className="flex flex-col items-center justify-center min-h-svh">
        <p>apps/web</p>
        <UserButton />
        <div className="max-w-sm w-full mx-auto">
          {JSON.stringify(users, null, 2)}
          <Button size="sm" onClick={() => add()}>
            Add
          </Button>
        </div>
    </div>
    </Authenticated>
    <Unauthenticated>
      <p>Must be signed in</p>
      <SignInButton />
    </Unauthenticated>
    </>
  )
}
