CREATE TABLE `notificacoes` (
	`id` varchar(36) NOT NULL DEFAULT (uuid()),
	`type` varchar(50) NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` varchar(255) NOT NULL,
	`read` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`usuario_id` varchar(36) NOT NULL,
	CONSTRAINT `notificacoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `notificacoes` ADD CONSTRAINT `notificacoes_usuario_id_usuarios_id_fk` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE no action ON UPDATE no action;