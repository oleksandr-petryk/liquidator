ALTER TABLE "session" ADD COLUMN "refresh_token_hash" varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "token";