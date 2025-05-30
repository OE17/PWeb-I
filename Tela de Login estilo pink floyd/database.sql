CREATE DATABASE IF NOT EXISTS pink_floyd_db;
USE pink_floyd_db;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    nivel_acesso ENUM('admin', 'usuario') NOT NULL DEFAULT 'usuario',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserindo um usuário administrador padrão (senha: admin123)
INSERT INTO usuarios (email, senha, nivel_acesso) VALUES 
('admin@admin.com', '$2a$10$YourHashedPasswordHere', 'admin'); 