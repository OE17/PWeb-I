import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const NewsDetails = () => {
  const { id, animeId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['news', animeId, id],
    queryFn: async () => {
      try {
        const [animeResponse, newsResponse, animeNewsResponse] = await Promise.all([
          api.get(`/anime/${animeId}`),
          api.get(`/anime/${animeId}/news`),
          api.get(`/anime/${animeId}/news/${id}`)
        ]);

        const news = newsResponse.data.data.find(n => n.mal_id.toString() === id);
        const fullNews = animeNewsResponse.data.data;

        // Combinar informações da notícia
        const enrichedNews = {
          ...news,
          ...fullNews,
          content: fullNews?.content || news?.excerpt || '',
          related_news: newsResponse.data.data
            .filter(n => n.mal_id.toString() !== id)
            .slice(0, 3)
        };

        return {
          anime: animeResponse.data.data,
          news: enrichedNews
        };
      } catch (error) {
        console.error('Erro ao buscar notícia:', error);
        throw error;
      }
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-800">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 bg-primary/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.news) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-800">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl max-w-lg w-full mx-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Notícia não encontrada
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Não foi possível encontrar a notícia solicitada.
          </p>
          <Link
            to="/noticias"
            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 inline-block"
          >
            Voltar para Notícias
          </Link>
        </div>
      </div>
    );
  }

  const { anime, news } = data;

  return (
    <AnimatePresence>
      <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-800 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Link to="/" className="hover:text-primary transition-colors">Início</Link>
              <span>/</span>
              <Link to="/noticias" className="hover:text-primary transition-colors">Notícias</Link>
              <span>/</span>
              <Link to={`/anime/${anime.mal_id}`} className="hover:text-primary transition-colors">{anime.title}</Link>
            </nav>

            {/* Artigo Principal */}
            <article className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">
              {/* Hero Section */}
              <div className="relative h-64 md:h-96">
                <img
                  src={anime.images?.jpg?.large_image_url}
                  alt={anime.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="max-w-3xl">
                    <Link
                      to={`/anime/${anime.mal_id}`}
                      className="text-sm text-primary hover:text-primary/80 transition-colors mb-2 inline-block"
                    >
                      {anime.title}
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                      {news.title}
                    </h1>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{new Date(news.date).toLocaleDateString('pt-BR', { 
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{news.author_username}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-8 md:p-12">
                <div className="prose dark:prose-invert max-w-none">
                  <div className="text-lg leading-relaxed space-y-6">
                    {news.content.split('\n\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>

                  {/* Tags e Categorias */}
                  {anime.genres && (
                    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold mb-4">Categorias</h3>
                      <div className="flex flex-wrap gap-2">
                        {anime.genres.map(genre => (
                          <span
                            key={genre.mal_id}
                            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Links Relacionados */}
                  <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap gap-4">
                      {news.forum_url && (
                        <a
                          href={news.forum_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                          </svg>
                          <span>Participar da Discussão</span>
                        </a>
                      )}
                      <Link
                        to={`/anime/${anime.mal_id}`}
                        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>Ver Detalhes do Anime</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Notícias Relacionadas */}
            {news.related_news && news.related_news.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Notícias Relacionadas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {news.related_news.map((relatedNews) => (
                    <Link
                      key={relatedNews.mal_id}
                      to={`/noticias/${anime.mal_id}/${relatedNews.mal_id}`}
                      className="group bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="p-6">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {relatedNews.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                          {relatedNews.excerpt}
                        </p>
                        <div className="text-sm text-gray-500 dark:text-gray-500">
                          {new Date(relatedNews.date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Navegação */}
            <div className="flex justify-between items-center pt-8">
              <Link
                to="/noticias"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Voltar para Notícias</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default NewsDetails; 