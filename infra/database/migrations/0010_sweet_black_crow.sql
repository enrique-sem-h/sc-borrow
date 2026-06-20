CREATE TABLE `historico_pagamentos` (
	`id` varchar(36) NOT NULL,
	`usuario_id` varchar(36) NOT NULL,
	`aluguel_id` varchar(36) NOT NULL,
	`message` varchar(255) NOT NULL,
	`saldo` float NOT NULL,
	CONSTRAINT `historico_pagamentos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `historico_pagamentos` ADD CONSTRAINT `historico_pagamentos_usuario_id_usuarios_id_fk` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `historico_pagamentos` ADD CONSTRAINT `historico_pagamentos_aluguel_id_alugueis_id_fk` FOREIGN KEY (`aluguel_id`) REFERENCES `alugueis`(`id`) ON DELETE no action ON UPDATE cascade;