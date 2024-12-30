CREATE TABLE "summaries" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "summaries_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
