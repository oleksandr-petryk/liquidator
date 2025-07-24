CREATE TABLE "session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" varchar(2048) NOT NULL,
	"picture_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_picture_id_user_id_fk" FOREIGN KEY ("picture_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization" ADD CONSTRAINT "organization_picture_id_pictures_id_fk" FOREIGN KEY ("picture_id") REFERENCES "public"."pictures"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_request" ADD CONSTRAINT "password_reset_request_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team" ADD CONSTRAINT "team_picture_id_pictures_id_fk" FOREIGN KEY ("picture_id") REFERENCES "public"."pictures"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_to_user" ADD CONSTRAINT "team_to_user_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_to_user" ADD CONSTRAINT "team_to_user_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_picture_id_pictures_id_fk" FOREIGN KEY ("picture_id") REFERENCES "public"."pictures"("id") ON DELETE no action ON UPDATE no action;