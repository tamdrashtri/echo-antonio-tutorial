import {action, query} from "../_generated/server";
import {internal} from "../_generated/api";
import {ConvexError, v} from "convex/values";
import { supportAgent } from "../system/ai/agents/supportAgent";
import { paginationOptsValidator } from "convex/server";


export const create = action({
    args: {
        prompt: v.string(),
        threadId: v.string(),
        contactSessionId: v.id("contactSessions"),
    },
    handler: async (ctx, args) => {
        const contactSession = await ctx.runQuery(
            internal.system.contactSession.getOne,
            {
                contactSessionId: args.contactSessionId,
            }
        )
        if (!contactSession || contactSession.expiredAt < Date.now()) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Contact session is invalid",
            });
        }
        const conversation = await ctx.runQuery(
            internal.system.conversations.getByThreadId,
            {
                threadId: args.threadId,
            }
        )
        if (!conversation) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Conversation not found",
            });
        }
        if (conversation.status === "resolved") {
            throw new ConvexError({
                code: "FORBIDDEN",
                message: "Conversation is resolved",
            });
        }

        const result = await supportAgent.generateText(
            ctx,
            {
                threadId: args.threadId,
            },
            {
                messages: [
                    {
                        role: "user",
                        content: args.prompt,
                    }
                ]
            }
        )

        return result
    }
})

export const getMany = query({
    args: {
        threadId: v.string(),
        paginationOpts: paginationOptsValidator,
        contactSessionId: v.id("contactSessions"),
    },
    handler: async (ctx, args) => {
        const contactSession = await ctx.db.get(args.contactSessionId);
        if (!contactSession || contactSession.expiredAt < Date.now()) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Contact session is invalid",
            });
        }
        const paginated = await supportAgent.listMessages(
            ctx,
            {
                threadId: args.threadId,
                paginationOpts: args.paginationOpts,
            }
        )
        return paginated;
    }
})