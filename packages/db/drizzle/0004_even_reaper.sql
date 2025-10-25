ALTER TABLE "pws-base_session" ADD COLUMN "token" text NOT NULL;--> statement-breakpoint
ALTER TABLE "pws-base_session" ADD COLUMN "updatedAt" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "pws-base_user" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "pws-base_session" ADD CONSTRAINT "pws-base_session_token_unique" UNIQUE("token");