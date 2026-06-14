ALTER TABLE `alugueis` RENAME COLUMN `id_usuario` TO `id_locador`;--> statement-breakpoint
ALTER TABLE `alugueis` DROP FOREIGN KEY `alugueis_id_usuario_usuarios_id_fk`;
--> statement-breakpoint
ALTER TABLE `usuarios` MODIFY COLUMN `rep` float(4,2);--> statement-breakpoint
ALTER TABLE `alugueis` ADD `id_locatario` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `alugueis` ADD CONSTRAINT `alugueis_id_locador_usuarios_id_fk` FOREIGN KEY (`id_locador`) REFERENCES `usuarios`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `alugueis` ADD CONSTRAINT `alugueis_id_locatario_usuarios_id_fk` FOREIGN KEY (`id_locatario`) REFERENCES `usuarios`(`id`) ON DELETE restrict ON UPDATE no action;