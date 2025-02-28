import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const AnimeSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [page, setPage] = useState(1);
  const [allAnimes, setAllAnimes] = useState([]);
  const queryClient = useQueryClient();

  const { data: genres } = useQuery({
    queryKey: ['genres'],
    queryFn: async () => {
      const response = await api.get('/genres/anime');
      return response.data.data;
    },
  });

  const { data: animes, isLoading, isFetching } = useQuery({
    queryKey: ['animes', searchTerm, selectedGenre, page],
    queryFn: async () => {
      const params = {
        page,
        limit: 24,
        order_by: 'popularity',
        sort: 'asc',
      };
      
      if (searchTerm.length > 2) {
        params.q = searchTerm;
      }
      
      let endpoint = '/top/anime';
      
      if (selectedGenre || searchTerm.length > 2) {
        endpoint = '/anime';
        if (selectedGenre) {
          params.genres = selectedGenre;
        }
      }
      
      const response = await api.get(endpoint, { params });
      return response.data;
    },
    keepPreviousData: true,
    staleTime: 0,
    cacheTime: 0,
  });

  useEffect(() => {
    if (animes?.data && !isFetching) {
      if (page === 1) {
        setAllAnimes(animes.data);
      } else {
        setAllAnimes(prev => [...prev, ...animes.data]);
      }
    }
  }, [animes, isFetching, page]);

  useEffect(() => {
    setPage(1);
    setAllAnimes([]);
    // Invalida o cache quando mudar os filtros
    queryClient.invalidateQueries(['animes']);
  }, [searchTerm, selectedGenre, queryClient]);

  const handleGenreChange = (e) => {
    const value = e.target.value;
    setSelectedGenre(value);
    setPage(1);
    setAllAnimes([]);
    queryClient.invalidateQueries(['animes']);
  };

  const handleLoadMore = () => {
    if (animes?.pagination?.has_next_page) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="max-w-[2000px] mx-auto px-4 lg:px-8 py-8">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 mb-8 sticky top-20 z-10 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg 
                className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-primary transition-colors duration-200" 
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
              placeholder="Buscar anime..."
              className="w-full px-4 py-3.5 pl-12 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm
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
          <div className="relative min-w-[200px] md:w-64 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg 
                className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-primary transition-colors duration-200" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h7" 
                />
              </svg>
            </div>
            <select
              className="w-full px-4 py-3.5 pl-12 pr-10 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm
                border border-gray-200 dark:border-gray-600 rounded-xl
                text-gray-900 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-primary/30 dark:focus:ring-primary/30 
                focus:border-primary dark:focus:border-primary
                hover:border-gray-300 dark:hover:border-gray-500
                transition-all duration-200
                shadow-sm hover:shadow
                appearance-none cursor-pointer"
              value={selectedGenre}
              onChange={handleGenreChange}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3e%3c/path%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.75rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.25rem'
              }}
            >
              <option value="">Todos os gêneros</option>
              {genres?.map((genre) => (
                <option 
                  key={genre.mal_id} 
                  value={genre.mal_id}
                  className="py-2"
                >
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {isLoading && page === 1 ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              layout
            >
              {allAnimes.map((anime, index) => (
                <motion.div
                  key={`${anime.mal_id}-${index}`}
                  className="card group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  layout
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={anime.images.jpg.image_url}
                      alt={anime.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-sm">
                      ★ {anime.score || 'N/A'}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {anime.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                      {anime.synopsis || 'Sem descrição disponível.'}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {anime.genres.slice(0, 3).map((genre) => (
                        <span
                          key={genre.mal_id}
                          className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={`/anime/${anime.mal_id}`}
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                    >
                      <span>Ver Detalhes</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Botão Ver Mais */}
            {allAnimes.length > 0 && animes?.pagination?.has_next_page && (
              <div className="flex justify-center mt-12">
                <motion.button
                  onClick={handleLoadMore}
                  className="btn-primary px-8 py-4 flex items-center gap-3 bg-gradient-to-r from-primary via-purple-500 to-secondary shadow-xl shadow-primary/20 dark:shadow-primary/10"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 20px 25px -5px rgb(99 102 241 / 0.3)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isFetching}
                >
                  {isFetching ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      <span className="font-medium">Carregando...</span>
                    </>
                  ) : (
                    <>
                      <span className="font-medium">Ver Mais Animes</span>
                      <svg 
                        className="w-5 h-5 animate-bounce" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimeSearch; 