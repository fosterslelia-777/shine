CREATE TABLE "github_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"github_token" text NOT NULL,
	"repo_owner" text DEFAULT 'r73723189-alt' NOT NULL,
	"repo_name" text DEFAULT 'Gnosis-' NOT NULL,
	"auto_sync" text DEFAULT 'false' NOT NULL,
	"last_sync" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"type" text,
	"last_modified" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL
);
