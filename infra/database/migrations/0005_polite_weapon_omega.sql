ALTER TABLE `foto_anuncio` DROP FOREIGN KEY `foto_anuncio_anuncio_id_anuncios_id_fk`;
--> statement-breakpoint
ALTER TABLE `foto_anuncio` ADD CONSTRAINT `foto_anuncio_anuncio_id_anuncios_id_fk` FOREIGN KEY (`anuncio_id`) REFERENCES `anuncios`(`id`) ON DELETE cascade ON UPDATE cascade;