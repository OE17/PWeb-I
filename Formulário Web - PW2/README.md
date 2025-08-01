# Formulário Web - PW2

## Descrição
Formulário web desenvolvido conforme especificações, com integração à API ViaCEP para busca automática de endereços.

## Funcionalidades

### ✅ Campos do Formulário
- **Matrícula**: Campo obrigatório para inserir número de matrícula
- **Nome**: Campo obrigatório para nome completo
- **CEP**: Campo com formatação automática (00000-000) e botão de busca
- **Endereço**: Preenchido automaticamente após validação do CEP

### ✅ Validação de CEP
- Botão com ícone de lupa para buscar endereço
- Integração com API ViaCEP (https://viacep.com.br)
- Formatação automática do CEP
- Validação se o CEP existe
- Preenchimento automático do campo endereço

### ✅ Validações do Formulário
- **Verificação de campos vazios**: Primeira validação impede envio com campos vazios
- **Validação de conteúdo**: Todos os campos devem ter pelo menos 3 caracteres
- **Validação de CEP**: Deve ter formato válido (8 dígitos)
- **Mensagens profissionais**: Alertas claros e informativos
- **Mensagem de sucesso**: Confirmação de envio com opção de responder novamente
- **Limpeza automática**: Formulário é limpo ao escolher "responder novamente"

### ✅ Interface Visual
- Design baseado na imagem fornecida
- Layout responsivo para dispositivos móveis
- Animações de feedback visual
- Indicadores visuais para campos com erro
- Status de carregamento durante busca do CEP

## Como Usar

1. **Abrir o formulário**: Abra o arquivo `index.html` em qualquer navegador web

2. **Preencher campos**:
   - Digite a matrícula
   - Digite o nome completo
   - Digite o CEP no formato 00000-000 (formatação automática)
   - Clique na lupa para buscar o endereço

3. **Validação e Envio**:
   - O endereço será preenchido automaticamente se o CEP for válido
   - Clique no botão "OK" para validar todo o formulário
   - Se houver campos vazios, será exibido um alerta específico
   - Se houver erros de validação, corrija os campos indicados
   - Após sucesso, aparecerá mensagem confirmando o envio
   - Escolha "OK" para responder novamente (formulário será limpo)

## Estrutura de Arquivos
```
├── index.html     # Estrutura HTML do formulário
├── style.css      # Estilização CSS
├── script.js      # Funcionalidades JavaScript
└── README.md      # Este arquivo de documentação
```

## Tecnologias Utilizadas
- **HTML5**: Estrutura semântica
- **CSS3**: Estilização responsiva com animações
- **JavaScript**: Validações e integração com API
- **API ViaCEP**: Busca de endereços por CEP
- **Font Awesome**: Ícones (lupa)
