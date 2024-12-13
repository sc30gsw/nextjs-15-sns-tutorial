ALTER TABLE "likes" ALTER COLUMN "post_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "likes" ADD COLUMN "reply_id" text;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_reply_id_replies_id_fk" FOREIGN KEY ("reply_id") REFERENCES "public"."replies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "likes_reply_idx" ON "likes" USING btree ("reply_id");--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_target_check" CHECK (post_id IS NOT NULL OR reply_id IS NOT NULL);--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_exclusive_check" CHECK (NOT (post_id IS NOT NULL AND reply_id IS NOT NULL));