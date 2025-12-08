CREATE TABLE "group" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"bio" text NOT NULL,
	"slug" text NOT NULL,
	"image" text,
	"objectKey" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "group_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "group_member" (
	"user_id" text NOT NULL,
	"role" text DEFAULT 'USER' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "group_member_user_id_user_id_pk" PRIMARY KEY("user_id","user_id"),
	CONSTRAINT "unique_group_user" UNIQUE("user_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "pinned_post" (
	"user_id" text PRIMARY KEY NOT NULL,
	"post_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "group_id" uuid;--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "is_pinned" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "group_member" ADD CONSTRAINT "group_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pinned_post" ADD CONSTRAINT "pinned_post_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pinned_post" ADD CONSTRAINT "pinned_post_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "group_slug_idx" ON "group" USING btree ("slug");--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "post_group_created_idx" ON "post" USING btree ("group_id","createdAt");