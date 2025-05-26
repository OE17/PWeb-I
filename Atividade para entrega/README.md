# Introdução a Segurança Cibernética 2025.1

## Enunciado
Apresente um código (pode ser em qualquer linguagem) que possa estar sujeito a ataques de SQL Injection e/ou Força Bruta. Faça implementações deixem o código mais seguro, em relação esses tipos de ataques, então explique qual(is) o(s) tipo(s) de ataque que está(ão) sendo evitados e qual a parte do código que evita esse ataque.

## Solução
Neste projeto, temos dois arquivos principais que demonstram um sistema de login antes e depois da implementação de segurança:

- `server_vulnerável.js`: Versão original, vulnerável a ataques de força bruta
- `server_seguro.js`: Versão protegida contra ataques de força bruta

### Proteção Implementada
A principal melhoria de segurança foi a adição de um limitador de tentativas de login (rate limit) que impede que um atacante faça múltiplas tentativas de login em um curto período de tempo. 

```javascript
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // limite de 5 tentativas
    message: 'Muitas tentativas de login. Por favor, tente novamente em 15 minutos.'
});
```

Esta implementação limita cada IP a 5 tentativas de login a cada 15 minutos, tornando ataques de força bruta praticamente inviáveis.

### Como Executar
1. Instale as dependências:
```bash
npm install express express-rate-limit
```

2. Execute o servidor:
```bash
node server_seguro.js
``` 