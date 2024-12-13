ALTER TABLE "likes" DROP CONSTRAINT "likes_user_id_post_id_pk";--> statement-breakpoint
ALTER TABLE "likes" ADD COLUMN "id" text PRIMARY KEY NOT NULL;--> statement-breakpoint
CREATE INDEX "likes_post_user_unique" ON "likes" USING btree ("post_id","user_id");--> statement-breakpoint
CREATE INDEX "likes_reply_user_unique" ON "likes" USING btree ("reply_id","user_id");