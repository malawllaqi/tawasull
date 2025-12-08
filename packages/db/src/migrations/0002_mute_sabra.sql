ALTER TABLE "group_member" DROP CONSTRAINT "unique_group_user";--> statement-breakpoint
ALTER TABLE "group_member" DROP CONSTRAINT "group_member_user_id_user_id_pk";--> statement-breakpoint
ALTER TABLE "group_member" ADD CONSTRAINT "group_member_user_id_group_id_pk" PRIMARY KEY("user_id","group_id");--> statement-breakpoint
ALTER TABLE "group_member" ADD COLUMN "group_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "group_member" ADD CONSTRAINT "group_member_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_member" ADD CONSTRAINT "unique_group_user" UNIQUE("group_id","user_id");