CREATE TABLE "notes_db" (
	"id" serial PRIMARY KEY NOT NULL,
	"heading" varchar(100) NOT NULL,
	"content" varchar(500) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
