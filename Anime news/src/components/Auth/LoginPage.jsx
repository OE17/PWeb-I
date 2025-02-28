import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';

const LoginPage = () => {
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError('');
      console.log('Iniciando login com Google...');
      const user = await signInWithGoogle();
      console.log('Login bem-sucedido. Dados do usuário:', {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      });
      navigate('/');
    } catch (error) {
      console.error('Erro detalhado:', error);
      setError(
        error.code === 'auth/popup-closed-by-user'
          ? 'Login cancelado. Por favor, tente novamente.'
          : error.code === 'auth/network-request-failed'
          ? 'Erro de conexão. Verifique sua internet.'
          : 'Erro ao fazer login. Por favor, tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background-light to-white dark:from-background-dark dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Elementos decorativos */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary opacity-10 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Link 
            to="/"
            className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text"
          >
            AnimeHub
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Bem-vindo ao AnimeHub!
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Faça login para acessar todos os recursos
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center"
        >
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className={`flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm text-base font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 transform hover:scale-105 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mr-3"></div>
                <span>Conectando...</span>
              </div>
            ) : (
              <>
                <FcGoogle className="h-6 w-6 mr-3" />
                Continuar com Google
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage; 