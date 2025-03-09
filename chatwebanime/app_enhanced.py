from flask import Flask, render_template, request, jsonify
import requests
from bs4 import BeautifulSoup
import json
import re
import time
import traceback
import random
import urllib3
from fake_useragent import UserAgent
import html2text
import concurrent.futures
from urllib.parse import urlparse, quote_plus
import string

# Desativar avisos de SSL inseguro
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

app = Flask(__name__)

OPENROUTER_API_KEY = "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"
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

# Respostas de fallback para quando a API não estiver disponível
FALLBACK_RESPONSES = {
    "naruto": "Naruto é um anime e mangá criado por Masashi Kishimoto que conta a história de Naruto Uzumaki, um jovem ninja que busca reconhecimento e sonha em se tornar o Hokage, o líder de sua vila. A série é conhecida por suas cenas de ação, desenvolvimento de personagens e temas de perseverança e amizade.",
    "one piece": "One Piece é um dos mangás e animes mais populares de todos os tempos, criado por Eiichiro Oda. A história segue Monkey D. Luffy e sua tripulação em busca do tesouro lendário conhecido como 'One Piece'. A série é famosa por seu mundo vasto, personagens memoráveis e arcos de história emocionantes.",
    "dragon ball": "Dragon Ball é uma série icônica criada por Akira Toriyama que segue as aventuras de Goku desde sua infância até a idade adulta. A série revolucionou o gênero de anime de luta e é conhecida por suas batalhas intensas, transformações poderosas e personagens carismáticos.",
    "attack on titan": "Attack on Titan (Shingeki no Kyojin) é um anime sombrio e intenso que se passa em um mundo onde a humanidade vive dentro de muralhas para se proteger de gigantes humanoides chamados Titãs. A série é conhecida por suas reviravoltas surpreendentes, animação de alta qualidade e temas maduros.",
    "my hero academia": "My Hero Academia (Boku no Hero Academia) se passa em um mundo onde 80% da população possui superpoderes chamados 'Individualidades'. A história segue Izuku Midoriya, um garoto sem poderes que herda a habilidade do maior herói do mundo. A série explora temas de heroísmo, crescimento pessoal e superação.",
    "demon slayer": "Demon Slayer (Kimetsu no Yaiba) conta a história de Tanjiro Kamado, que se torna um caçador de demônios após sua família ser massacrada e sua irmã transformada em demônio. O anime é aclamado por sua animação excepcional, cenas de luta impressionantes e narrativa emocional.",
    "jujutsu kaisen": "Jujutsu Kaisen segue Yuji Itadori, um estudante que se junta a uma organização secreta de feiticeiros para matar uma poderosa maldição chamada Ryomen Sukuna, da qual ele se torna hospedeiro. O anime é conhecido por seu sistema de magia único, cenas de ação dinâmicas e humor bem equilibrado com momentos sombrios."
}

# Sites específicos de anime para buscar informações
ANIME_SITES = {
    "myanimelist.net": 10,  # Prioridade alta (10)
    "anime-planet.com": 9,
    "anilist.co": 9,
    "crunchyroll.com": 8,
    "animenewsnetwork.com": 8,
    "kitsu.io": 7,
    "animeplanet.com": 7,
    "livechart.me": 6,
    "animedb.com": 5,
    "wikipedia.org": 5
}

# Palavras-chave para identificar conteúdo relevante
RELEVANT_KEYWORDS = [
    "sinopse", "enredo", "história", "personagens", "protagonista", 
    "antagonista", "episódios", "temporadas", "estúdio", "animação", 
    "mangá", "autor", "diretor", "produção", "lançamento", "estreia",
    "gênero", "classificação", "avaliação", "crítica", "recepção",
    "prêmios", "curiosidades", "fatos", "adaptação", "original"
]

def get_random_user_agent():
    """Gera um User-Agent aleatório para evitar bloqueios"""
    try:
        ua = UserAgent()
        return ua.random
    except:
        # Fallback para user agents comuns caso a biblioteca falhe
        common_agents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0"
        ]
        return random.choice(common_agents)

def extract_text_from_html(html_content):
    """Converte HTML para texto simples"""
    try:
        h = html2text.HTML2Text()
        h.ignore_links = True
        h.ignore_images = True
        h.ignore_emphasis = True
        h.ignore_tables = True
        return h.handle(html_content)
    except:
        # Fallback para BeautifulSoup se html2text falhar
        soup = BeautifulSoup(html_content, 'html.parser')
        return soup.get_text(separator=' ', strip=True)

def clean_text(text):
    """Limpa o texto removendo espaços extras, quebras de linha, etc."""
    if not text:
        return ""
    # Remover espaços extras e quebras de linha
    text = re.sub(r'\s+', ' ', text)
    # Remover caracteres não imprimíveis
    text = ''.join(c for c in text if c in string.printable)
    # Remover texto duplicado (comum em web scraping)
    text = re.sub(r'(.{30,}?)\1+', r'\1', text)
    return text.strip()

def search_google(query, num_results=8):
    """Realiza uma busca no Google e retorna os resultados"""
    try:
        headers = {
            "User-Agent": get_random_user_agent(),
            "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
        }
        
        # Codificar a consulta para URL
        encoded_query = quote_plus(f"{query} anime informações sinopse personagens")
        search_url = f"https://www.google.com/search?q={encoded_query}&hl=pt-BR&num={num_results}"
        
        response = requests.get(search_url, headers=headers, timeout=10)
        
        if response.status_code != 200:
            return []
            
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extrair links dos resultados
        search_results = []
        for g in soup.find_all(['div', 'a'], class_=['g', 'yuRUbf']):
            anchors = g.find_all('a')
            if anchors:
                for a in anchors:
                    if 'href' in a.attrs and a['href'].startswith(('http', '/url?')):
                        link = a['href']
                        
                        # Extrair o URL real dos resultados do Google
                        if link.startswith('/url?'):
                            link_match = re.search(r'/url\?q=([^&]+)', link)
                            if link_match:
                                link = link_match.group(1)
                        
                        # Verificar se o link já foi adicionado
                        if any(result['url'] == link for result in search_results):
                            continue
                            
                        # Verificar se o link é de um site de anime
                        domain = urlparse(link).netloc
                        priority = 0
                        
                        for site, site_priority in ANIME_SITES.items():
                            if site in domain:
                                priority = site_priority
                                break
                        
                        # Adicionar o link com sua prioridade
                        if priority > 0 or "anime" in link.lower():
                            search_results.append({
                                'url': link,
                                'priority': priority if priority > 0 else 1
                            })
        
        # Adicionar busca específica na Wikipedia
        wiki_url = f"https://pt.wikipedia.org/wiki/{quote_plus(query)}"
        search_results.append({
            'url': wiki_url,
            'priority': 5  # Prioridade média para Wikipedia
        })
        
        # Ordenar por prioridade (sites de anime primeiro)
        search_results.sort(key=lambda x: x['priority'], reverse=True)
        
        # Remover duplicatas e retornar apenas as URLs
        unique_urls = []
        for result in search_results:
            if result['url'] not in unique_urls:
                unique_urls.append(result['url'])
        
        return unique_urls[:num_results]
    
    except Exception as e:
        print(f"Erro ao buscar no Google: {str(e)}")
        traceback.print_exc()
        return []

def is_relevant_content(text, query):
    """Verifica se o texto contém informações relevantes sobre o anime"""
    query_terms = query.lower().split()
    text_lower = text.lower()
    
    # Verificar se o texto contém o nome do anime
    if not any(term in text_lower for term in query_terms if len(term) > 3):
        return False
    
    # Verificar se o texto contém palavras-chave relevantes
    keyword_count = sum(1 for keyword in RELEVANT_KEYWORDS if keyword in text_lower)
    
    # Texto deve conter pelo menos algumas palavras-chave
    return keyword_count >= 2

def fetch_page_content(url, query):
    """Busca o conteúdo de uma página web"""
    try:
        headers = {"User-Agent": get_random_user_agent()}
        response = requests.get(url, headers=headers, timeout=15, verify=False)
        
        if response.status_code != 200:
            return None
            
        # Extrair texto da página
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Remover elementos irrelevantes
        for tag in soup(['script', 'style', 'nav', 'footer', 'header', 'aside', 'iframe', 'noscript']):
            tag.decompose()
        
        # Estratégia 1: Tentar encontrar o conteúdo principal
        main_content = None
        
        # Procurar por elementos que geralmente contêm o conteúdo principal
        for selector in ['main', 'article', 'div.content', 'div.main', 'div.article', 
                         'div[role="main"]', 'div.entry-content', 'div.post-content']:
            content = soup.select(selector)
            if content:
                main_content = content[0]
                break
        
        # Se não encontrou pelos seletores, tentar encontrar por ID ou classe
        if not main_content:
            for element in soup.find_all(['div', 'section']):
                if element.get('id') and any(term in element.get('id').lower() for term in ['content', 'main', 'article']):
                    main_content = element
                    break
                if element.get('class') and any(term in ' '.join(element.get('class')).lower() for term in ['content', 'main', 'article']):
                    main_content = element
                    break
        
        # Se ainda não encontrou, usar o body inteiro
        if not main_content:
            main_content = soup.find('body')
        
        # Extrair texto do conteúdo principal
        if main_content:
            # Extrair parágrafos e cabeçalhos
            text_elements = main_content.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li'])
            
            # Filtrar elementos com texto relevante
            relevant_texts = []
            for element in text_elements:
                text = element.get_text(strip=True)
                if len(text) > 40 and is_relevant_content(text, query):  # Ignorar textos muito curtos
                    relevant_texts.append(text)
            
            # Se encontrou textos relevantes, usar apenas eles
            if relevant_texts:
                return clean_text("\n\n".join(relevant_texts))
            
            # Caso contrário, usar todo o conteúdo principal
            return clean_text(extract_text_from_html(str(main_content)))
        
        return None
    
    except Exception as e:
        print(f"Erro ao buscar página {url}: {str(e)}")
        return None

def get_web_information(query):
    """Busca informações na web sobre o anime"""
    # Buscar no Google
    urls = search_google(query)
    
    if not urls:
        return "Não foi possível encontrar informações na web."
    
    # Buscar conteúdo das páginas em paralelo
    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        future_to_url = {executor.submit(fetch_page_content, url, query): url for url in urls[:5]}
        for future in concurrent.futures.as_completed(future_to_url):
            url = future_to_url[future]
            try:
                content = future.result()
                if content and len(content) > 100:  # Ignorar conteúdo muito curto
                    # Limitar o tamanho do conteúdo
                    domain = urlparse(url).netloc
                    results.append({
                        'url': url,
                        'domain': domain,
                        'content': content[:3000],  # Aumentar limite para conteúdo mais rico
                        'priority': next((ANIME_SITES[site] for site in ANIME_SITES if site in domain), 1)
                    })
            except Exception as e:
                print(f"Erro ao processar {url}: {str(e)}")
    
    # Ordenar resultados por prioridade
    results.sort(key=lambda x: x['priority'], reverse=True)
    
    # Combinar resultados
    if results:
        combined_results = []
        for result in results[:3]:  # Usar apenas os 3 melhores resultados
            combined_results.append(f"Fonte: {result['domain']}\n{result['content']}")
        
        return "\n\n---\n\n".join(combined_results)
    else:
        return "Não foi possível extrair informações relevantes das páginas encontradas."

def get_anime_info(query):
    try:
        # Buscar informações na web
        print(f"Buscando informações na web para: {query}")
        web_info = get_web_information(query)
        
        # Tentar usar a API do OpenRouter
        try:
            print("Enviando informações para o LLM...")
            # Chamar a API do OpenRouter (Gemini)
            headers = {
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:5000",
                "X-Title": "AnimeBot"
            }
            
            # Preparar o prompt com as informações da web
            if web_info and web_info != "Não foi possível encontrar informações na web." and web_info != "Não foi possível extrair informações relevantes das páginas encontradas.":
                prompt = f"""
Você é um especialista em animes, gentil e curioso. Com base nas seguintes informações coletadas da web e no seu conhecimento, 
forneça uma resposta direta e interessante sobre o anime "{query}".

INFORMAÇÕES DA WEB:
{web_info}

Seja direto ao ponto e organize sua resposta para incluir:
1. Uma breve introdução ao anime (1-2 frases)
2. Informações essenciais sobre a história/enredo (2-3 frases)
3. Personagens principais (apenas nomes e características principais)
4. Estúdio de animação (apenas nome)
5. Número de episódios/temporadas (números exatos)
6. Avaliação geral (1-2 frases)
7. Uma curiosidade interessante (1 frase)

Mantenha sua resposta concisa e direta, com no máximo 250 palavras. Responda em português do Brasil, de forma natural e entusiasmada.
IMPORTANTE: Certifique-se de completar todas as frases e não cortar a resposta no meio.
"""
            else:
                prompt = f"Me fale sobre o anime {query} de forma direta e concisa. Inclua apenas as informações mais importantes sobre história, personagens principais, estúdio, número de episódios/temporadas e uma curiosidade interessante. Mantenha a resposta com no máximo 250 palavras. Responda em português do Brasil. IMPORTANTE: Certifique-se de completar todas as frases e não cortar a resposta no meio."
            
            payload = {
                "model": "google/gemini-2.0-flash-thinking-exp:free",
                "messages": [
                    {
                        "role": "system",
                        "content": "Você é um especialista em animes, gentil e curioso. Forneça informações diretas e concisas sobre animes em português do Brasil. Seja amigável e entusiasmado, mas vá direto ao ponto. Sempre responda à pergunta específica do usuário de forma clara e objetiva. IMPORTANTE: Certifique-se de completar todas as frases e não cortar a resposta no meio."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "temperature": 0.5,  # Temperatura mais baixa para respostas mais precisas e diretas
                "max_tokens": 800,   # Aumentar o limite de tokens para evitar cortes
                "stream": False      # Garantir que a resposta completa seja retornada de uma vez
            }
            
            # Desativar verificação SSL para contornar problemas
            response = requests.post(
                OPENROUTER_API_URL, 
                headers=headers, 
                json=payload, 
                timeout=45,  # Aumentar o timeout para respostas mais longas
                verify=False  # Desativa verificação SSL
            )
            
            if response.status_code != 200:
                print(f"Erro na API: {response.status_code} - {response.text}")
                raise Exception(f"Erro na API: {response.status_code}")
                
            ai_response = response.json()
            
            if 'choices' in ai_response and len(ai_response['choices']) > 0:
                # Garantir que a resposta completa seja retornada
                full_response = ai_response['choices'][0]['message']['content']
                print(f"Tamanho da resposta: {len(full_response)} caracteres")
                
                # Verificar se a resposta parece estar cortada
                if full_response.endswith(('...', '…', '.', ',')) and len(full_response) > 750:
                    print("Resposta parece estar cortada. Tentando completar...")
                    # Tentar completar a resposta com uma segunda chamada
                    completion_payload = {
                        "model": "google/gemini-2.0-flash-thinking-exp:free",
                        "messages": [
                            {
                                "role": "system",
                                "content": "Você é um especialista em animes. Continue a resposta anterior de forma concisa."
                            },
                            {
                                "role": "user",
                                "content": f"Continue esta resposta sobre {query}: {full_response}"
                            }
                        ],
                        "temperature": 0.5,
                        "max_tokens": 300
                    }
                    
                    try:
                        completion_response = requests.post(
                            OPENROUTER_API_URL, 
                            headers=headers, 
                            json=completion_payload, 
                            timeout=30,
                            verify=False
                        )
                        
                        if completion_response.status_code == 200:
                            completion_data = completion_response.json()
                            if 'choices' in completion_data and len(completion_data['choices']) > 0:
                                continuation = completion_data['choices'][0]['message']['content']
                                # Remover sobreposições
                                full_response = full_response + " " + continuation
                                print(f"Resposta completada. Novo tamanho: {len(full_response)} caracteres")
                    except Exception as e:
                        print(f"Erro ao tentar completar a resposta: {str(e)}")
                
                return full_response
            else:
                print(f"Resposta inesperada da API: {ai_response}")
                raise Exception("Resposta inesperada da API")
                
        except Exception as e:
            print(f"Erro ao usar a API: {str(e)}")
            # Usar resposta de fallback
            return get_fallback_response(query)
            
    except Exception as e:
        print(f"Erro geral: {str(e)}")
        traceback.print_exc()
        return f"Desculpe, ocorreu um erro ao processar sua pergunta: {str(e)}"

def get_fallback_response(query):
    """Retorna uma resposta de fallback quando a API não está disponível"""
    query_lower = query.lower()
    
    # Verificar correspondências exatas
    if query_lower in FALLBACK_RESPONSES:
        return FALLBACK_RESPONSES[query_lower]
    
    # Verificar correspondências parciais
    for key, response in FALLBACK_RESPONSES.items():
        if key in query_lower or query_lower in key:
            return response
    
    # Resposta genérica se não houver correspondência
    return f"Desculpe, não consegui obter informações sobre '{query}' no momento. Por favor, tente novamente mais tarde ou pergunte sobre outro anime como Naruto, One Piece, Dragon Ball, Attack on Titan, My Hero Academia, Demon Slayer ou Jujutsu Kaisen."

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/ask', methods=['POST'])
def ask():
    try:
        data = request.get_json()
        query = data.get('query', '')
        if not query:
            return jsonify({'response': 'Por favor, faça uma pergunta sobre anime.'})
        
        # Processar a consulta
        start_time = time.time()
        response = get_anime_info(query)
        end_time = time.time()
        
        # Registrar tempo de processamento
        processing_time = end_time - start_time
        print(f"Tempo de processamento: {processing_time:.2f} segundos")
        print(f"Tamanho da resposta final: {len(response)} caracteres")
        
        # Verificar se a resposta parece estar cortada
        if response.endswith(('...', '…')) and len(response) > 500:
            print("AVISO: A resposta ainda parece estar cortada mesmo após tentativas de completá-la")
            # Adicionar uma nota ao final da resposta
            if not response.endswith('...'):
                response += '...'
            response += ' (Nota: A resposta pode estar incompleta devido a limitações da API)'
        
        # Garantir que a resposta seja retornada completamente
        return jsonify({
            'response': response,
            'processing_time': f"{processing_time:.2f}",
            'response_length': len(response)
        })
    except Exception as e:
        print(f"Erro na rota /ask: {str(e)}")
        traceback.print_exc()
        return jsonify({'response': f"Erro no servidor: {str(e)}"})

if __name__ == '__main__':
    app.run(debug=True) 