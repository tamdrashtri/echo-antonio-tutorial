"use client"

import { useQuery, useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

export default function Page() {
  const add = useMutation(api.users.add);

  return (
    <>

    <div className="flex flex-col items-center justify-center min-h-svh">
        <p>apps/web</p>
        <UserButton />
        <OrganizationSwitcher hidePersonal />
        <div className="max-w-sm w-full mx-auto">
          <Button size="sm" onClick={() => add()}>
            Add
          </Button>
        </div>
    </div>
    </>
  )
}
