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
ANIME_SITES = [
    "myanimelist.net",
    "anime-planet.com",
    "anilist.co",
    "crunchyroll.com",
    "animenewsnetwork.com",
    "kitsu.io"
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

def search_google(query, num_results=5):
    """Realiza uma busca no Google e retorna os resultados"""
    try:
        headers = {
            "User-Agent": get_random_user_agent(),
            "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
        }
        search_url = f"https://www.google.com/search?q={query}+anime&hl=pt-BR&num={num_results}"
        response = requests.get(search_url, headers=headers, timeout=10)
        
        if response.status_code != 200:
            return []
            
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extrair links dos resultados
        search_results = []
        for g in soup.find_all('div', class_='g'):
            anchors = g.find_all('a')
            if anchors:
                link = anchors[0]['href']
                if link.startswith('/url?') or link.startswith('http'):
                    # Extrair o URL real dos resultados do Google
                    if link.startswith('/url?'):
                        link = re.search(r'/url\?q=([^&]+)', link)
                        if link:
                            link = link.group(1)
                    
                    # Verificar se o link é de um site de anime
                    is_anime_site = any(site in link for site in ANIME_SITES)
                    
                    # Adicionar o link com prioridade para sites de anime
                    search_results.append({
                        'url': link,
                        'priority': 2 if is_anime_site else 1
                    })
        
        # Ordenar por prioridade (sites de anime primeiro)
        search_results.sort(key=lambda x: x['priority'], reverse=True)
        
        # Retornar apenas as URLs
        return [result['url'] for result in search_results[:num_results]]
    
    except Exception as e:
        print(f"Erro ao buscar no Google: {str(e)}")
        traceback.print_exc()
        return []

def fetch_page_content(url):
    """Busca o conteúdo de uma página web"""
    try:
        headers = {"User-Agent": get_random_user_agent()}
        response = requests.get(url, headers=headers, timeout=10, verify=False)
        
        if response.status_code != 200:
            return None
            
        # Extrair texto da página
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Remover elementos irrelevantes
        for tag in soup(['script', 'style', 'nav', 'footer', 'header', 'aside']):
            tag.decompose()
            
        # Extrair o conteúdo principal
        main_content = soup.find('main') or soup.find('article') or soup.find('div', class_=re.compile(r'content|main|article'))
        
        if main_content:
            return extract_text_from_html(str(main_content))
        else:
            # Se não encontrar o conteúdo principal, usar o body inteiro
            body = soup.find('body')
            if body:
                return extract_text_from_html(str(body))
            
        return extract_text_from_html(response.text)
    
    except Exception as e:
        print(f"Erro ao buscar página {url}: {str(e)}")
        return None

def get_web_information(query):
    """Busca informações na web sobre o anime"""
    search_query = f"{query} anime informações sinopse personagens"
    
    # Buscar no Google
    urls = search_google(search_query)
    
    if not urls:
        return "Não foi possível encontrar informações na web."
    
    # Buscar conteúdo das páginas em paralelo
    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
        future_to_url = {executor.submit(fetch_page_content, url): url for url in urls[:3]}
        for future in concurrent.futures.as_completed(future_to_url):
            url = future_to_url[future]
            try:
                content = future.result()
                if content:
                    # Limitar o tamanho do conteúdo
                    content = content[:2000]
                    results.append(f"Fonte: {url}\n{content}")
            except Exception as e:
                print(f"Erro ao processar {url}: {str(e)}")
    
    # Combinar resultados
    if results:
        return "\n\n---\n\n".join(results)
    else:
        return "Não foi possível extrair informações das páginas encontradas."

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
            if web_info and web_info != "Não foi possível encontrar informações na web.":
                prompt = f"""
Você é um especialista em animes. Com base nas seguintes informações coletadas da web e no seu conhecimento, 
forneça uma resposta detalhada e interessante sobre o anime "{query}".

INFORMAÇÕES DA WEB:
{web_info}

Organize sua resposta para incluir:
1. Uma breve introdução ao anime
2. Informações sobre a história/enredo
3. Personagens principais
4. Estúdio de animação e equipe de produção (se disponível)
5. Recepção crítica e popularidade
6. Curiosidades interessantes

Responda em português do Brasil, de forma natural e entusiasmada.
"""
            else:
                prompt = f"Me fale sobre o anime {query} de forma detalhada e interessante. Inclua informações sobre história, personagens principais, estúdio de animação, recepção crítica e curiosidades."
            
            payload = {
                "model": "google/gemini-2.0-flash-thinking-exp:free",
                "messages": [
                    {
                        "role": "system",
                        "content": "Você é um especialista em animes. Forneça informações detalhadas e interessantes sobre animes em português do Brasil. Seja amigável e entusiasmado ao falar sobre o assunto."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            }
            
            # Desativar verificação SSL para contornar problemas
            response = requests.post(
                OPENROUTER_API_URL, 
                headers=headers, 
                json=payload, 
                timeout=30,
                verify=False  # Desativa verificação SSL
            )
            
            if response.status_code != 200:
                print(f"Erro na API: {response.status_code} - {response.text}")
                raise Exception(f"Erro na API: {response.status_code}")
                
            ai_response = response.json()
            
            if 'choices' in ai_response and len(ai_response['choices']) > 0:
                return ai_response['choices'][0]['message']['content']
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
            
        response = get_anime_info(query)
        return jsonify({'response': response})
    except Exception as e:
        print(f"Erro na rota /ask: {str(e)}")
        traceback.print_exc()
        return jsonify({'response': f"Erro no servidor: {str(e)}"})

if __name__ == '__main__':
    app.run(debug=True) 