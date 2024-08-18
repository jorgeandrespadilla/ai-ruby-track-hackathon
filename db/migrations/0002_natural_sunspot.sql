ALTER TABLE "complaints_table" ALTER COLUMN "summary" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "complaints_table" ALTER COLUMN "summary" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "complaints_table" ADD COLUMN "product" text NOT NULL;--> statement-breakpoint
ALTER TABLE "complaints_table" ADD COLUMN "sub_product" text;--> statement-breakpoint
ALTER TABLE "complaints_table" ADD COLUMN "rating" text;--> statement-breakpoint
ALTER TABLE "complaints_table" ADD COLUMN "company" text;