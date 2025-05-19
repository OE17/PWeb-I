CREATE TABLE IF NOT EXISTS usuarios (
    email VARCHAR(255) PRIMARY KEY,
    senha VARCHAR(255) NOT NULL,
    nivel_acesso ENUM('administrador', 'usuario') NOT NULL
); 