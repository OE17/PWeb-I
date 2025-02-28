import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const HomePage = () => {
  const { data: topAnimes, isLoading: loadingAnimes } = useQuery({
    queryKey: ['topAnimes'],
    queryFn: async () => {
      const response = await api.get('/top/anime', { params: { limit: 8 } });
      return response.data.data;
    },
  });

  const { data: recentNews, isLoading: loadingNews } = useQuery({
    queryKey: ['recentNews'],
    queryFn: async () => {
      // Buscar notícias dos top 3 animes
      const topResponse = await api.get('/top/anime', { params: { limit: 3 } });
      const topThree = topResponse.data.data;
      
      const newsPromises = topThree.map(async (anime) => {
        try {
          const newsResponse = await api.get(`/anime/${anime.mal_id}/news`);
          return {
            anime,
            news: newsResponse.data.data[0], // Pegar apenas a notícia mais recente
          };
        } catch {
          return null;
        }
      });
      
      const results = await Promise.all(newsPromises);
      return results.filter(Boolean);
    },
  });

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-background-light to-white dark:from-background-dark dark:to-gray-900 pt-16">
        {/* Decorative Elements */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary opacity-10 rounded-full blur-3xl"></div>
        
        <div className="max-w-[2000px] w-full mx-auto px-4 lg:px-8 py-20">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
            >
              Explore o Mundo dos{' '}
              <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                Animes
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4"
            >
              Descubra os melhores animes, acompanhe as últimas notícias e mantenha-se atualizado com sua lista personalizada.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-center gap-4 px-4"
            >
              <Link
                to="/animes"
                className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Explorar Animes
              </Link>
              <Link
                to="/noticias"
                className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-medium hover:border-primary dark:hover:border-primary transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Ver Notícias
              </Link>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 px-4">
              <StatItem number="1M+" label="Usuários" delay={0.3} />
              <StatItem number="50K+" label="Animes" delay={0.4} />
              <StatItem number="100K+" label="Reviews" delay={0.5} />
              <StatItem number="24/7" label="Suporte" delay={0.6} />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Animes */}
      <section className="w-full py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-[2000px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Animes em Destaque
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 dark:text-gray-300"
            >
              Os animes mais populares da temporada
            </motion.p>
          </div>

          {loadingAnimes ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topAnimes?.map((anime, index) => (
                <motion.div
                  key={anime.mal_id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={anime.images.jpg.image_url}
                      alt={anime.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-sm">
                      ★ {anime.score}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {anime.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
                      {anime.synopsis}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {anime.genres.slice(0, 2).map((genre) => (
                        <span
                          key={genre.mal_id}
                          className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent News Section */}
      <section className="w-full py-20">
        <div className="max-w-[2000px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Últimas Notícias
            </motion.h2>
          </div>

          {loadingNews ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentNews?.map(({ anime, news }, index) => (
                <motion.a
                  key={news.mal_id}
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Anime: {anime.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                      {news.excerpt}
                    </p>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(news.date).toLocaleDateString()}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const StatItem = ({ number, label, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="text-center"
  >
    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
      {number}
    </div>
    <div className="text-gray-600 dark:text-gray-300 mt-1">{label}</div>
  </motion.div>
);

export default HomePage; 