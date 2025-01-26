CREATE TABLE "oauth_account" (
	"userId" text NOT NULL,
	"providerId" text NOT NULL,
	"providerUserId" text NOT NULL,
	CONSTRAINT "oauth_account_providerId_providerUserId_pk" PRIMARY KEY("providerId","providerUserId"),
	CONSTRAINT "oauth_account_providerUserId_unique" UNIQUE("providerUserId")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"image" text,
	"partner" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "medium" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message" (
	"id" text PRIMARY KEY NOT NULL,
	"senderId" text NOT NULL,
	"mediumId" text NOT NULL,
	"body" text NOT NULL,
	"timestamp" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "oauth_account" ADD CONSTRAINT "oauth_account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_senderId_user_id_fk" FOREIGN KEY ("senderId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_mediumId_medium_id_fk" FOREIGN KEY ("mediumId") REFERENCES "public"."medium"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_email_index" ON "user" USING btree ("email");