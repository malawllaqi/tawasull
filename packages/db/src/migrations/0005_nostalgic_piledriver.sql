ALTER TABLE "post_media" DROP CONSTRAINT "post_media_post_id_post_id_fk";
--> statement-breakpoint
ALTER TABLE "post_media" ADD CONSTRAINT "post_media_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;