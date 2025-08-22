ALTER TYPE "public"."activity-log-action" RENAME TO "activity_log_action";--> statement-breakpoint
ALTER TABLE "activity_log" RENAME COLUMN "actions" TO "action";--> statement-breakpoint
ALTER TABLE "activity_log" ALTER COLUMN "action" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."activity_log_action";--> statement-breakpoint
CREATE TYPE "public"."activity_log_action" AS ENUM('registration', 'login', 'login_failed_with_invalid_password', 'refresh_tokens', 'refresh_tokens_failed_with_expired_refresh_token', 'refresh_failed_with_old_refresh_token', 'account_verification', 'account_verification_failed_with_wrong_code', 'update_session_name', 'delete_session', 'send_password_reset_email', 'send_password_reset_email_failed_reached_limit', 'reset_password', 'reset_password_failed_with_wrong_code', 'change_password', 'change_password_failed_with_wrong_old_password');--> statement-breakpoint
ALTER TABLE "activity_log" ALTER COLUMN "action" SET DATA TYPE "public"."activity_log_action" USING "action"::"public"."activity_log_action";--> statement-breakpoint
ALTER TABLE "activity_log" ALTER COLUMN "secretContext" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "activity_log" ALTER COLUMN "context" DROP NOT NULL;