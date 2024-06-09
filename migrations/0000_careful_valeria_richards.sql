CREATE TABLE `links` (
	`id` integer PRIMARY KEY NOT NULL,
	`project_id` integer,
	`link_type` text NOT NULL,
	`url` text,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `profile` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`github_url` text,
	`linkedin_url` text,
	`portfolio_url` text,
	`other_url` text
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `links_id_unique` ON `links` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `projects_id_unique` ON `projects` (`id`);