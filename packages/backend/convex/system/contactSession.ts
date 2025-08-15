import {internalQuery} from "../_generated/server";
import {v} from "convex/values";

export const getOne = internalQuery({
    args: {
        contactSessionId: v.id("contactSessions"),
    },
    handler: async (ctx, args) => {
        const contactSession = await ctx.db.get(args.contactSessionId);
        return contactSession;
    }
}) 