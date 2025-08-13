import {v} from "convex/values";
import {query, mutation} from "../_generated/server";

const SESSION_DURATION = 1000 * 60 * 60 * 24; // 1 days

export const create = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        organizationId: v.number(),
        expiredAt: v.number(),
        metadata: v.optional(v.object({
            userAgent: v.optional(v.string()),
            language: v.optional(v.string()),
            languages: v.optional(v.string()),
            platform: v.optional(v.string()),
            vendor: v.optional(v.string()),
            screenResolution: v.optional(v.string()),
            viewportSize: v.optional(v.string()),
            timezone: v.optional(v.string()),
            timezoneOffset: v.optional(v.string()),
            cookieEnabled: v.optional(v.string()),
            referrer: v.optional(v.string()),
            currentUrl: v.optional(v.string()),
        })
    ),
},
    handler: async (ctx, args) => {
        const now = new Date();
        const expiredAt = now.getTime() + SESSION_DURATION;
        const contactSessionid = await ctx.db.insert("contactSessions", {...args, expiredAt});
        return contactSessionid;
    }
})