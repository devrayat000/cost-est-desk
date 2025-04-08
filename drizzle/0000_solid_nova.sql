CREATE TABLE `categories` (
	`code` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `items` (
	`code` text PRIMARY KEY NOT NULL,
	`description` text NOT NULL,
	`unit` text NOT NULL,
	`category_code` text NOT NULL,
	FOREIGN KEY (`category_code`) REFERENCES `categories`(`code`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL
);
