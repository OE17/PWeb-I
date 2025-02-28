import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { getAuth, updateProfile } from 'firebase/auth';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setDisplayName(user.displayName || '');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const auth = getAuth();
      await updateProfile(auth.currentUser, {
        displayName: displayName
      });
      setSuccess(true);
      toast.success('Nome atualizado com sucesso!');
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      setError('Erro ao atualizar o perfil. Por favor, tente novamente.');
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Erro ao atualizar perfil. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
      >
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Foto de perfil'}
                className="w-24 h-24 rounded-full shadow-lg border-2 border-primary object-cover"
                onError={(e) => {
                  console.error('Erro ao carregar a imagem:', e);
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=random`;
                }}
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center shadow-lg">
                <span className="text-3xl font-medium text-gray-600 dark:text-gray-300">
                  {(user.displayName || 'U')[0].toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Foto sincronizada com sua conta Google
          </p>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-4">
            Seu Perfil
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Atualize suas informações
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nome de Exibição
            </label>
            <div className="mt-1">
              <input
                id="displayName"
                name="displayName"
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                placeholder="Seu nome"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="text-green-500 text-sm text-center">
              Perfil atualizado com sucesso!
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Atualizar Nome'
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Email:
            </div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {user.email}
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Conta Google:
            </div>
            <div className="text-sm font-medium text-green-500">
              Conectada
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}