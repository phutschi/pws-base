import { z } from "zod";

import { posts } from "@repo/db/schema";
import { desc } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/trpc";

type Post = InferSelectModel<typeof posts>;

export const postsRouter = createTRPCRouter({
	hello: publicProcedure
		.input(z.object({ text: z.string() }))
		.query(({ input }): { greeting: string } => {
			return {
				greeting: `Hello ${input.text}`,
			};
		}),

	create: publicProcedure
		.input(z.object({ name: z.string().min(1) }))
		.mutation(async ({ ctx, input }): Promise<void> => {
			await ctx.db.insert(posts).values({
				name: input.name,
			});
		}),

	getLatest: publicProcedure.query(async ({ ctx }): Promise<Post | null> => {
		const post = await ctx.db.query.posts.findFirst({
			orderBy: [desc(posts.createdAt)],
		});

		return post ?? null;
	}),
});
