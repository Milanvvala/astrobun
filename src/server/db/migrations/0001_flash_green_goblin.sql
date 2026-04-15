CREATE TABLE `todos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`completed` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT '"2026-03-16T01:41:20.103Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2026-03-16T01:41:20.103Z"' NOT NULL
);
