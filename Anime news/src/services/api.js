import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.jikan.moe/v4',
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Configuração de cache simples
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Função para gerar chave de cache
const getCacheKey = (config) => {
  return `${config.method}:${config.url}:${JSON.stringify(config.params)}`;
};

// Rate limiting helper com cache
api.interceptors.request.use(
  async (config) => {
    const cacheKey = getCacheKey(config);
    const cachedResponse = cache.get(cacheKey);

    if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_DURATION) {
      return Promise.reject({
        config,
        response: { data: cachedResponse.data, status: 304 }
      });
    }

    return config;
  }
);

api.interceptors.response.use(
  (response) => {
    // Cache successful responses
    const cacheKey = getCacheKey(response.config);
    cache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now()
    });

    return response;
  },
  async (error) => {
    // Se for um erro de cache (304), retorna os dados do cache
    if (error.response?.status === 304) {
      return Promise.resolve({ data: error.response.data });
    }

    console.error('Erro na API:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Rate limiting
    if (error.response?.status === 429) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return api(error.config);
    }

    // Tratamento específico para notícias não encontradas
    if (error.response?.status === 404) {
      if (error.config?.url.includes('/news/')) {
        return Promise.resolve({ 
          data: { 
            data: {
              title: 'Notícia não encontrada',
              excerpt: 'O conteúdo desta notícia não está mais disponível.',
              date: new Date().toISOString(),
              author_username: 'Sistema',
              content: 'O conteúdo desta notícia não está mais disponível ou foi removido.'
            }
          } 
        });
      }
      return Promise.resolve({ 
        data: { 
          data: null,
          error: 'Conteúdo não encontrado'
        } 
      });
    }

    // Tratamento de timeout
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        ...error,
        message: 'A requisição demorou muito para responder. Por favor, tente novamente.'
      });
    }

    // Tratamento de erro de rede
    if (!error.response) {
      return Promise.reject({
        ...error,
        message: 'Não foi possível conectar ao servidor. Por favor, verifique sua conexão.'
      });
    }

    return Promise.reject(error);
  }
);

// Configuração para o RSS do Anime United
const CORS_PROXY = 'https://corsproxy.io/?';
const RSS_URL = `${CORS_PROXY}https://www.animeunited.com.br/feed/`;

// Função para buscar notícias do RSS
export const fetchAnimeNews = async () => {
  try {
    const response = await axios.get(RSS_URL, {
      responseType: 'text'
    });
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data, "text/xml");
    const items = xmlDoc.getElementsByTagName('item');
    
    return Array.from(items).map(item => ({
      title: item.getElementsByTagName('title')[0]?.textContent || '',
      link: item.getElementsByTagName('link')[0]?.textContent || '',
      description: item.getElementsByTagName('description')[0]?.textContent || '',
      pubDate: item.getElementsByTagName('pubDate')[0]?.textContent || '',
      image: item.getElementsByTagName('enclosure')[0]?.getAttribute('url') || 
             extractImageFromContent(item.getElementsByTagName('content:encoded')[0]?.textContent || ''),
      categories: Array.from(item.getElementsByTagName('category')).map(cat => cat.textContent)
    }));
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    return [];
  }
};

// Função para extrair imagem do conteúdo
const extractImageFromContent = (content) => {
  const match = content.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : '';
};

export default api; 