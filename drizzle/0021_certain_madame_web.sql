CREATE TABLE "member_to_role" (
	"member_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "member_to_role_role_id_member_id_pk" PRIMARY KEY("role_id","member_id")
);
--> statement-breakpoint
ALTER TABLE "member" DROP CONSTRAINT "member_role_id_role_id_fk";
--> statement-breakpoint
ALTER TABLE "member" ADD COLUMN "is_default" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "permission" ADD COLUMN "organization_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "member_to_role" ADD CONSTRAINT "member_to_role_member_id_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_to_role" ADD CONSTRAINT "member_to_role_role_id_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."role"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "permission" ADD CONSTRAINT "permission_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" DROP COLUMN "role_id";--> statement-breakpoint
ALTER TABLE "role" DROP COLUMN "permissions";--> statement-breakpoint
ALTER TABLE "role" ADD CONSTRAINT "unique_role_organization" UNIQUE("name","organization_id");