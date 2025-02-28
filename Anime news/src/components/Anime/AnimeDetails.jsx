import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { addFavorite, removeFavorite, checkIsFavorite } from '../../services/favoriteService';
import CommentSection from '../Comments/CommentSection';

const AnimeDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: anime, isLoading: animeLoading, error } = useQuery({
    queryKey: ['anime', id],
    queryFn: async () => {
      try {
        const response = await api.get(`/anime/${id}`);
        if (!response.data.data) {
          throw new Error('Anime não encontrado');
        }
        return response.data.data;
      } catch (error) {
        console.error('Erro ao buscar anime:', error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 60000,
  });

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user && anime) {
        try {
          const status = await checkIsFavorite(id);
          setIsFavorite(status);
        } catch (error) {
          console.error('Erro ao verificar status de favorito:', error);
        }
      }
    };

    checkFavoriteStatus();
  }, [user, anime, id]);

  const handleFavoriteClick = async () => {
    if (!user) {
      // Redirecionar para a página de login
      window.location.href = '/login';
      return;
    }

    try {
      setIsLoading(true);
      if (isFavorite) {
        await removeFavorite(id);
      } else {
        await addFavorite({
          id: id,
          title: anime.title,
          image: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url
        });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-center items-center min-h-screen text-center px-4 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-800"
      >
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl max-w-lg w-full">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ops! Algo deu errado</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Não foi possível carregar os detalhes do anime. Por favor, tente novamente mais tarde.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/animes"
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Voltar
            </Link>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-primary/20"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!anime) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center items-center min-h-screen text-center px-4 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-800"
      >
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl max-w-lg w-full">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Anime não encontrado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Não conseguimos encontrar o anime que você está procurando.
          </p>
          <Link
            to="/animes"
            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 inline-block"
          >
            Voltar para Lista
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-800">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-8 px-4 lg:px-8"
        >
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-3xl overflow-hidden mb-8 shadow-2xl bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg"
            >
              <div className="absolute inset-0">
                <img
                  src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
                  alt={anime.title}
                  className="w-full h-full object-cover filter blur-md opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 via-white/80 dark:via-gray-900/80 to-transparent"></div>
              </div>

              <div className="relative z-10 flex flex-col md:flex-row gap-8 p-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-full md:w-96 flex-shrink-0"
                >
                  <div className="relative group">
                    <img
                      src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
                      alt={anime.title}
                      className="w-full rounded-2xl shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-300"
                    />
                    <div className="absolute inset-0 rounded-2xl shadow-inner"></div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex-1 space-y-6"
                >
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      {anime.title}
                    </h1>
                    {anime.title_japanese && (
                      <h2 className="text-xl text-gray-600 dark:text-gray-400 font-medium">
                        {anime.title_japanese}
                      </h2>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {anime.score && (
                      <div className="px-4 py-2 bg-yellow-500/10 dark:bg-yellow-500/20 backdrop-blur-md rounded-xl flex items-center gap-2">
                        <span className="text-yellow-500">★</span>
                        <span className="font-semibold">{anime.score}</span>
                      </div>
                    )}
                    <div className="px-4 py-2 bg-primary/10 dark:bg-primary/20 backdrop-blur-md rounded-xl">
                      {anime.episodes || '?'} Episódios
                    </div>
                    {anime.status && (
                      <div className="px-4 py-2 bg-green-500/10 dark:bg-green-500/20 backdrop-blur-md rounded-xl">
                        {anime.status}
                      </div>
                    )}
                    {anime.rating && (
                      <div className="px-4 py-2 bg-purple-500/10 dark:bg-purple-500/20 backdrop-blur-md rounded-xl">
                        {anime.rating}
                      </div>
                    )}
                    <motion.button
                      onClick={handleFavoriteClick}
                      disabled={isLoading}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 backdrop-blur-md rounded-xl flex items-center gap-2 transition-all duration-300 ${
                        isFavorite
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <motion.div
                        initial={false}
                        animate={{
                          scale: isFavorite ? [1, 1.3, 1] : 1,
                          rotate: isFavorite ? [0, 20, -20, 0] : 0
                        }}
                        transition={{ duration: 0.4 }}
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                        ) : isFavorite ? (
                          <AiFillHeart className="w-6 h-6 text-white" />
                        ) : (
                          <AiOutlineHeart className="w-6 h-6" />
                        )}
                      </motion.div>
                      <span className="font-medium">
                        {isLoading
                          ? 'Processando...'
                          : isFavorite
                          ? 'Favoritado'
                          : 'Favoritar'}
                      </span>
                    </motion.button>
                  </div>

                  {anime.synopsis && (
                    <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                      {anime.synopsis}
                    </p>
                  )}

                  {anime.genres && anime.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {anime.genres.map((genre) => (
                        <span
                          key={genre.mal_id}
                          className="px-4 py-2 bg-primary/10 dark:bg-primary/20 text-primary rounded-xl text-sm font-medium hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors cursor-pointer"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>

            {/* Informações Detalhadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300"
              >
                <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Informações
                </h3>
                <div className="space-y-4">
                  <InfoItem icon="type" label="Tipo" value={anime.type || 'N/A'} />
                  <InfoItem icon="episodes" label="Episódios" value={anime.episodes || 'Desconhecido'} />
                  <InfoItem icon="duration" label="Duração" value={anime.duration || 'N/A'} />
                  <InfoItem icon="status" label="Status" value={anime.status || 'N/A'} />
                  <InfoItem icon="season" label="Exibido" value={`${anime.season || ''} ${anime.year || ''}`} />
                  <InfoItem icon="studio" label="Estúdio" value={anime.studios?.map(s => s.name).join(', ') || 'N/A'} />
                  <InfoItem icon="source" label="Fonte" value={anime.source || 'N/A'} />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300"
              >
                <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Estatísticas
                </h3>
                <div className="space-y-4">
                  <InfoItem icon="star" label="Pontuação" value={anime.score ? `★ ${anime.score}` : 'N/A'} />
                  <InfoItem icon="rank" label="Ranking" value={anime.rank ? `#${anime.rank}` : 'N/A'} />
                  <InfoItem icon="popularity" label="Popularidade" value={anime.popularity ? `#${anime.popularity}` : 'N/A'} />
                  <InfoItem icon="members" label="Membros" value={anime.members?.toLocaleString() || 'N/A'} />
                  <InfoItem icon="favorites" label="Favoritos" value={anime.favorites?.toLocaleString() || 'N/A'} />
                </div>
              </motion.div>
            </div>

            {/* Trailer */}
            {anime.trailer?.embed_url && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl mb-8"
              >
                <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Trailer
                </h3>
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
                  <iframe
                    src={anime.trailer.embed_url}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                    title="trailer"
                  />
                </div>
              </motion.div>
            )}

            {/* Seção de Comentários */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <CommentSection animeId={id} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const InfoItem = ({ label, value, icon }) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
    <div className="flex items-center gap-3">
      <InfoIcon type={icon} />
      <span className="text-gray-700 dark:text-gray-300 font-medium">{label}</span>
    </div>
    <span className="font-semibold text-gray-900 dark:text-white">{value}</span>
  </div>
);

const InfoIcon = ({ type }) => {
  const iconClass = "w-5 h-5 text-primary";
  
  const icons = {
    type: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
      </svg>
    ),
    episodes: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
    duration: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    status: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    season: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    studio: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    source: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    star: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    rank: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    popularity: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    members: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    favorites: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  };

  return icons[type] || null;
};

export default AnimeDetails; 