ALTER TABLE "account_verification" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP AT TIME ZONE 'UTC';--> statement-breakpoint
ALTER TABLE "organization" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP AT TIME ZONE 'UTC';--> statement-breakpoint
ALTER TABLE "password_reset_request" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP AT TIME ZONE 'UTC';--> statement-breakpoint
ALTER TABLE "pictures" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP AT TIME ZONE 'UTC';--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP AT TIME ZONE 'UTC';--> statement-breakpoint
ALTER TABLE "team" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP AT TIME ZONE 'UTC';--> statement-breakpoint
ALTER TABLE "team_to_user" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP AT TIME ZONE 'UTC';--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP AT TIME ZONE 'UTC';