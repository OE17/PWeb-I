import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const NewsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const { data: news, isLoading } = useQuery({
    queryKey: ['news', searchTerm, page],
    queryFn: async () => {
      let endpoint = '/top/anime';
      let params = { page, limit: 6 };
      
      if (searchTerm) {
        endpoint = '/anime';
        params = { ...params, q: searchTerm };
      }
      
      const response = await api.get(endpoint, { params });
      const animes = response.data.data;
      
      const newsPromises = animes.map(async (anime) => {
        try {
          const newsResponse = await api.get(`/anime/${anime.mal_id}/news`);
          return {
            anime,
            news: newsResponse.data.data.slice(0, 2),
          };
        } catch {
          return { anime, news: [] };
        }
      });
      
      return Promise.all(newsPromises);
    },
    keepPreviousData: true,
  });

  return (
    <div className="max-w-[2000px] mx-auto px-4 lg:px-8 py-8">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 mb-8 sticky top-20 z-10 border border-gray-100 dark:border-gray-700">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg 
              className="w-5 h-5 text-gray-400 dark:text-gray-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar notícias por anime..."
            className="w-full pl-12 pr-4 py-3.5 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm
              border border-gray-200 dark:border-gray-600 rounded-xl
              text-gray-900 dark:text-gray-100
              placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-primary/30 dark:focus:ring-primary/30 
              focus:border-primary dark:focus:border-primary
              hover:border-gray-300 dark:hover:border-gray-500
              transition-all duration-200
              shadow-sm hover:shadow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {news?.map(({ anime, news }) => (
            <motion.div
              key={anime.mal_id}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="p-4 bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <Link 
                  to={`/anime/${anime.mal_id}`}
                  className="text-xl font-bold hover:text-primary transition-colors"
                >
                  {anime.title}
                </Link>
              </div>
              
              <div className="p-6">
                {news.length > 0 ? (
                  news.map((item) => (
                    <motion.div
                      key={item.mal_id}
                      className="mb-6 last:mb-0"
                      whileHover={{ scale: 1.01 }}
                    >
                      <Link
                        to={`/noticias/${anime.mal_id}/${item.mal_id}`}
                        className="block p-4 border dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300"
                      >
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          {item.excerpt}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <span>{new Date(item.date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}</span>
                          <span className="mx-2">•</span>
                          <span>{item.author_username}</span>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    Nenhuma notícia encontrada para este anime.
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="flex justify-center gap-4 mt-8">
        <motion.button
          className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Anterior
        </motion.button>
        <motion.button
          className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          onClick={() => setPage((p) => p + 1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Próxima
        </motion.button>
      </div>
    </div>
  );
};

export default NewsPage; 