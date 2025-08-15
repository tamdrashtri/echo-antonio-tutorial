import {v} from "convex/values";
import {action} from "../_generated/server";
import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
})

export const validate = action({
    args: {
        organizationId: v.string(),
    },
    handler: async (_, args) => {
        try {
            // We only need to know if the organization exists; don't return the Clerk object
            await clerkClient.organizations.getOrganization({ organizationId: args.organizationId });
            return { valid: true } as const;
        } catch (error) {
            return { valid: false as const, reason: "organization_not_found" as const };
        }
    }
})