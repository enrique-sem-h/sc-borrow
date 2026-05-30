ALTER TABLE `alugueis` DROP FOREIGN KEY `alugueis_id_anuncio_anuncios_id_fk`;
--> statement-breakpoint
ALTER TABLE `alugueis` DROP FOREIGN KEY `alugueis_id_usuario_usuarios_id_fk`;
--> statement-breakpoint
ALTER TABLE `alugueis` MODIFY COLUMN `id_anuncio` varchar(36);--> statement-breakpoint
ALTER TABLE `alugueis` ADD CONSTRAINT `alugueis_id_anuncio_anuncios_id_fk` FOREIGN KEY (`id_anuncio`) REFERENCES `anuncios`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `alugueis` ADD CONSTRAINT `alugueis_id_usuario_usuarios_id_fk` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id`) ON DELETE restrict ON UPDATE no action;