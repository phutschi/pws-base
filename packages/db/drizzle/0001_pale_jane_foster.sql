CREATE TABLE "pws-base_account" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"expiresAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pws-base_session" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pws-base_user" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean DEFAULT false NOT NULL,
	"name" text,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "pws-base_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "pws-base_verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pws-base_post" ADD COLUMN "userId" text;--> statement-breakpoint
ALTER TABLE "pws-base_account" ADD CONSTRAINT "pws-base_account_userId_pws-base_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."pws-base_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pws-base_session" ADD CONSTRAINT "pws-base_session_userId_pws-base_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."pws-base_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "pws-base_account" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "account_provider_idx" ON "pws-base_account" USING btree ("providerId","accountId");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "pws-base_session" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "pws-base_user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "pws-base_verification" USING btree ("identifier");--> statement-breakpoint
ALTER TABLE "pws-base_post" ADD CONSTRAINT "pws-base_post_userId_pws-base_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."pws-base_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "created_at_idx" ON "pws-base_post" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "id_created_at_idx" ON "pws-base_post" USING btree ("id","createdAt");--> statement-breakpoint
CREATE INDEX "post_user_id_idx" ON "pws-base_post" USING btree ("userId");