CREATE TYPE "public"."user_genders" AS ENUM('male', 'female');--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "gender" SET DATA TYPE "public"."user_genders" USING "gender"::text::"public"."user_genders";--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "name" varchar(64);--> statement-breakpoint
DROP TYPE "public"."use_genders";