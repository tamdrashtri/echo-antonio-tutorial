import {mutation, query} from "../_generated/server";
import {ConvexError, v} from "convex/values";
import { supportAgent } from "../system/ai/agents/supportAgent";
import { saveMessage } from "@convex-dev/agent";
import { components } from "../_generated/api";

export const getOne = query({
    args: {
        conversationId: v.id("conversations"),
        contactSessionId: v.id("contactSessions"),
    },
    handler: async (ctx, args) => {
        const session = await ctx.db.get(args.contactSessionId);
        if (!session || session.expiredAt < Date.now()) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Contact session is invalid",
            });
        }
        const conversation = await ctx.db.get(args.conversationId);
        if (!conversation) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Conversation not found",
            });
        }
        return {
            _id: conversation._id,
            threadId: conversation.threadId,
            status: conversation.status,
        }
    }
})

export const create = mutation({
    args: {
        organizationId: v.string(),
        contactSessionId: v.id("contactSessions"),
    },
    handler: async (ctx, args) => {
        const session = await ctx.db.get(args.contactSessionId);
        if (!session || session.expiredAt < Date.now()) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Contact session is invalid",
            });
        }
        const {threadId} = await supportAgent.createThread(ctx, {
            userId: args.organizationId,
        });
        await saveMessage(ctx, components.agent, {
            threadId,
            message: {
                role: "assistant",
                content: "Hello! How can I help you today?",
            }
        });
        const conversationId = await ctx.db.insert("conversations", {
            organizationId: args.organizationId,
            contactSessionId: args.contactSessionId,
            status: "unresolved",
            threadId,
        });
        return {conversationId};

    }
})