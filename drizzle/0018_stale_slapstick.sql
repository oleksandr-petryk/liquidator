CREATE TYPE "public"."activity-log-action" AS ENUM('registration', 'login', 'loginFailedWithInvalidPassword', 'refreshTokens', 'refreshTokensFailedWithExpiredRefreshToken', 'refreshFailedWithOldRefreshToken', 'accountVerification', 'accountVerificationFailedWithWrongCode', 'updateSessionName', 'deleteSession', 'sendPasswordResetEmail', 'sendPasswordResetEmailFailedReachedLimit', 'resetPassword', 'resetPasswordFailedWithWrongCode', 'changePassword', 'changePasswordFailedWithWrongOldPassword');--> statement-breakpoint
CREATE TABLE "activity_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"actions" "activity-log-action" NOT NULL,
	"secretContext" jsonb NOT NULL,
	"context" jsonb NOT NULL,
	"client-fingerprint-id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "session" RENAME COLUMN "picture_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "session_picture_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_client-fingerprint-id_client_fingerprint_id_fk" FOREIGN KEY ("client-fingerprint-id") REFERENCES "public"."client_fingerprint"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;