ALTER TABLE "permission" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "role_to_permission" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "permission" CASCADE;--> statement-breakpoint
DROP TABLE "role_to_permission" CASCADE;--> statement-breakpoint
ALTER TABLE "role" ALTER COLUMN "permissions" SET NOT NULL;