CREATE TABLE IF NOT EXISTS "complaints_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"transcript_id" integer NOT NULL,
	"summary" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transcripts_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"file_url" text,
	"text" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "complaints_table" ADD CONSTRAINT "complaints_table_transcript_id_transcripts_table_id_fk" FOREIGN KEY ("transcript_id") REFERENCES "public"."transcripts_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transcripts_table" ADD CONSTRAINT "transcripts_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users_table" DROP COLUMN IF EXISTS "updated_at";