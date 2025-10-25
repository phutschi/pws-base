import { z } from "zod";

import { posts } from "@repo/db/schema";
import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";
import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/trpc";
import { logger } from "~/shared/lib/logger";

type Post = InferSelectModel<typeof posts>;

export const postsRouter = createTRPCRouter({
	hello: publicProcedure
		.input(z.object({ text: z.string() }))
		.query(({ input }): { greeting: string } => {
			return {
				greeting: `Hello ${input.text}`,
			};
		}),

	create: protectedProcedure
		.input(z.object({ name: z.string().min(1) }))
		.mutation(async ({ ctx, input }): Promise<void> => {
			await ctx.db.insert(posts).values({
				name: input.name,
				userId: ctx.user.id,
			});
		}),

	getLatest: protectedProcedure.query(async ({ ctx }): Promise<Post | null> => {
		logger.info("Getting latest post", { userId: ctx.user.id });

		if (!ctx.user.id) {
			logger.error("User ID is required", { userId: ctx.user.id });
			throw new TRPCError({ code: "UNAUTHORIZED" });
		}

		const post = await ctx.db.query.posts.findFirst({
			where: eq(posts.userId, ctx.user.id),
			orderBy: [desc(posts.createdAt)],
		});

		return post ?? null;
	}),
});
