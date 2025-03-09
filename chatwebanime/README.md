# AnimeBot - Chatbot Especialista em Animes

Este é um chatbot que responde perguntas sobre animes usando Wikipedia, web scraping do Google e a API do Gemini para gerar respostas naturais e informativas.

## Características

- Interface moderna e responsiva com Tailwind CSS
- Busca informações na Wikipedia em português
- Realiza web scraping do Google para informações adicionais
- Utiliza IA (Gemini) para gerar respostas naturais
- Suporte completo ao português

## Requisitos

- Python 3.7+
- Pip (gerenciador de pacotes Python)

## Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd chatwebanime
```

2. Instale as dependências:
```bash
pip install -r requirements.txt
```

## Como Usar

1. Execute o aplicativo:
```bash
python app.py
```

2. Abra seu navegador e acesse:
```
http://localhost:5000
```

3. Digite sua pergunta sobre anime no campo de texto e pressione Enter ou clique em "Enviar"

## Estrutura do Projeto

```
chatwebanime/
├── app.py              # Arquivo principal do aplicativo
├── requirements.txt    # Dependências do projeto
├── templates/         
│   └── index.html     # Template da interface do usuário
└── README.md          # Este arquivo
```

## Tecnologias Utilizadas

- Flask (Backend)
- Tailwind CSS (Frontend)
- Wikipedia API
- BeautifulSoup4 (Web Scraping)
- OpenRouter API (Gemini) 