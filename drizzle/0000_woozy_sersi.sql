CREATE TABLE `alugueis` (
	`id` varchar(36) NOT NULL,
	`data_inicio` timestamp NOT NULL,
	`data_fim` timestamp NOT NULL,
	`id_anuncio` varchar(36) NOT NULL,
	`id_usuario` varchar(36) NOT NULL,
	CONSTRAINT `alugueis_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `anuncios` (
	`id` varchar(36) NOT NULL,
	`titulo` varchar(255) NOT NULL,
	`descricao` varchar(255) NOT NULL,
	`categoria` varchar(255) NOT NULL,
	`valor_diario` float NOT NULL,
	`caucao` float NOT NULL,
	`usuario_id` varchar(36) NOT NULL,
	CONSTRAINT `anuncios_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `foto_anuncio` (
	`id` varchar(36) NOT NULL,
	`url` varchar(255) NOT NULL,
	`ordem` int NOT NULL,
	`principal` boolean NOT NULL DEFAULT false,
	`anuncio_id` varchar(36) NOT NULL,
	CONSTRAINT `foto_anuncio_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `avaliacoes` (
	`id` varchar(36) NOT NULL,
	`nota` float(3,2) NOT NULL,
	`mensagem` varchar(255) NOT NULL,
	`id_usuario` varchar(36) NOT NULL,
	`id_aluguel` varchar(36) NOT NULL,
	CONSTRAINT `avaliacoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat_participantes` (
	`id_chat` varchar(36) NOT NULL,
	`id_usuario` varchar(36) NOT NULL,
	CONSTRAINT `chat_participantes_id_chat_id_usuario_pk` PRIMARY KEY(`id_chat`,`id_usuario`)
);
--> statement-breakpoint
CREATE TABLE `chats` (
	`id` varchar(36) NOT NULL,
	`criado_em` timestamp NOT NULL DEFAULT (now()),
	`id_anuncio` varchar(36) NOT NULL,
	CONSTRAINT `chats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mensagens` (
	`id` varchar(36) NOT NULL,
	`mensagem` text NOT NULL,
	`enviado_em` timestamp NOT NULL DEFAULT (now()),
	`id_chat` varchar(36) NOT NULL,
	`remetente_id` varchar(36) NOT NULL,
	CONSTRAINT `mensagens_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pagamentos` (
	`id` varchar(36) NOT NULL,
	`metodo` varchar(50) NOT NULL,
	`valor` float NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'Pendente',
	`data_pagamento` timestamp NOT NULL,
	`id_aluguel` varchar(36) NOT NULL,
	CONSTRAINT `pagamentos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reembolsos` (
	`id` varchar(36) NOT NULL,
	`valor` float NOT NULL,
	`data` timestamp NOT NULL,
	`motivo` varchar(255) NOT NULL,
	`id_pagamento` varchar(36) NOT NULL,
	CONSTRAINT `reembolsos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `saques` (
	`id` varchar(36) NOT NULL,
	`valor` float NOT NULL,
	`data` timestamp NOT NULL DEFAULT (now()),
	`usuario_id` varchar(36) NOT NULL,
	CONSTRAINT `saques_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `usuario_telefones` (
	`id` varchar(36) NOT NULL,
	`telefone` varchar(20) NOT NULL,
	`usuario_id` varchar(36) NOT NULL,
	CONSTRAINT `usuario_telefones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `usuarios` (
	`id` varchar(36) NOT NULL,
	`cpf` varchar(255) NOT NULL,
	`nome` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`senha` varchar(255) NOT NULL,
	`cep` varchar(255) NOT NULL,
	`logradouro` varchar(255) NOT NULL,
	`bairro` varchar(255) NOT NULL,
	`numero` int NOT NULL,
	`uf` varchar(2) NOT NULL,
	`complemento` varchar(50) NOT NULL,
	`rep` float(4,2) NOT NULL,
	`saldo` float NOT NULL DEFAULT 0,
	CONSTRAINT `usuarios_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `alugueis` ADD CONSTRAINT `alugueis_id_anuncio_anuncios_id_fk` FOREIGN KEY (`id_anuncio`) REFERENCES `anuncios`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `alugueis` ADD CONSTRAINT `alugueis_id_usuario_usuarios_id_fk` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `anuncios` ADD CONSTRAINT `anuncios_usuario_id_usuarios_id_fk` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `foto_anuncio` ADD CONSTRAINT `foto_anuncio_anuncio_id_anuncios_id_fk` FOREIGN KEY (`anuncio_id`) REFERENCES `anuncios`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `avaliacoes` ADD CONSTRAINT `avaliacoes_id_usuario_usuarios_id_fk` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `avaliacoes` ADD CONSTRAINT `avaliacoes_id_aluguel_alugueis_id_fk` FOREIGN KEY (`id_aluguel`) REFERENCES `alugueis`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chat_participantes` ADD CONSTRAINT `chat_participantes_id_chat_chats_id_fk` FOREIGN KEY (`id_chat`) REFERENCES `chats`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chat_participantes` ADD CONSTRAINT `chat_participantes_id_usuario_usuarios_id_fk` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chats` ADD CONSTRAINT `chats_id_anuncio_anuncios_id_fk` FOREIGN KEY (`id_anuncio`) REFERENCES `anuncios`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `mensagens` ADD CONSTRAINT `mensagens_id_chat_chats_id_fk` FOREIGN KEY (`id_chat`) REFERENCES `chats`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `mensagens` ADD CONSTRAINT `mensagens_remetente_id_usuarios_id_fk` FOREIGN KEY (`remetente_id`) REFERENCES `usuarios`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pagamentos` ADD CONSTRAINT `pagamentos_id_aluguel_alugueis_id_fk` FOREIGN KEY (`id_aluguel`) REFERENCES `alugueis`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reembolsos` ADD CONSTRAINT `reembolsos_id_pagamento_pagamentos_id_fk` FOREIGN KEY (`id_pagamento`) REFERENCES `pagamentos`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `saques` ADD CONSTRAINT `saques_usuario_id_usuarios_id_fk` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `usuario_telefones` ADD CONSTRAINT `usuario_telefones_usuario_id_usuarios_id_fk` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE no action ON UPDATE no action;