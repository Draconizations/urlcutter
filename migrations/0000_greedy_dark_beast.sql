CREATE TABLE `long_url` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`short_url_id` integer,
	`created` integer NOT NULL,
	`version_tag` text NOT NULL,
	`long_url` text NOT NULL,
	FOREIGN KEY (`short_url_id`) REFERENCES `short_url`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `short_url` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created` integer NOT NULL,
	`is_public` integer NOT NULL,
	`short_url` text NOT NULL
);
