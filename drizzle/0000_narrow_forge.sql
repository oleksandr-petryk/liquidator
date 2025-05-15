CREATE TYPE "public"."genres" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TYPE "public"."roles" AS ENUM('member', 'admin', 'owner');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('published', 'draft', 'archived');--> statement-breakpoint
CREATE TABLE "organization" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" "status" DEFAULT 'published',
	"name" varchar(30) NOT NULL,
	"slug" varchar(30) NOT NULL,
	"picture_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "organization_name_unique" UNIQUE("name"),
	CONSTRAINT "organization_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "password_reset_request" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"code" varchar(6) NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pictures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"picture" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "team" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" "status" DEFAULT 'published',
	"name" varchar(30) NOT NULL,
	"picture_id" integer,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "team_to_user" (
	"user_id" uuid NOT NULL,
	"team_id" uuid NOT NULL,
	"role" "roles" DEFAULT 'member',
	"is_favorite" boolean DEFAULT false NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	CONSTRAINT "team_to_user_user_id_team_id_pk" PRIMARY KEY("user_id","team_id")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" "status" DEFAULT 'published',
	"email" varchar(320) NOT NULL,
	"phone_number" varchar(15) NOT NULL,
	"username" varchar(15) NOT NULL,
	"first_name" varchar(35) NOT NULL,
	"last_name" varchar(35) NOT NULL,
	"date_of_birth" timestamp NOT NULL,
	"gender" "genres",
	"picture_id" integer,
	"password" varchar(128) NOT NULL,
	"recovery_email_address" varchar(320) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_phone_number_unique" UNIQUE("phone_number"),
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
