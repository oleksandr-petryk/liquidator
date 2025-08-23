CREATE TYPE "public"."session-status" AS ENUM('expired', 'refreshed', 'deleted');--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "status" "session-status";