import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AiOutlineHeart, AiOutlineUser } from 'react-icons/ai';
import ThemeToggle from '../ThemeToggle';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="w-full bg-white/90 dark:bg-gray-800/90 shadow-lg shadow-gray-100/20 dark:shadow-gray-900/20 backdrop-blur-md">
        <div className="max-w-7xl w-full mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                  AnimeHub
                </span>
              </Link>
            </motion.div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink to="/" isActive={isActive("/")}>Início</NavLink>
              <NavLink to="/animes" isActive={isActive("/animes")}>Animes</NavLink>
              <NavLink to="/noticias" isActive={isActive("/noticias")}>Notícias</NavLink>
              {user && (
                <NavLink to="/favoritos" isActive={isActive("/favoritos")}>
                  <div className="flex items-center space-x-1">
                    <AiOutlineHeart className="w-5 h-5" />
                    <span>Favoritos</span>
                  </div>
                </NavLink>
              )}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link to="/perfil">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <AiOutlineUser className="w-5 h-5" />
                      <span>{user.displayName || 'Perfil'}</span>
                    </motion.button>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="btn-secondary"
                  >
                    Sair
                  </motion.button>
                </div>
              ) : (
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary"
                  >
                    Login
                  </motion.button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-4 md:hidden">
              <ThemeToggle />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Menu"
              >
                <svg
                  className="w-6 h-6 text-gray-700 dark:text-gray-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md"
            >
              <div className="max-w-7xl w-full mx-auto px-4 py-4 space-y-4">
                <MobileNavLink 
                  to="/" 
                  isActive={isActive("/")}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Início
                </MobileNavLink>
                <MobileNavLink 
                  to="/animes" 
                  isActive={isActive("/animes")}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Animes
                </MobileNavLink>
                <MobileNavLink 
                  to="/noticias" 
                  isActive={isActive("/noticias")}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Notícias
                </MobileNavLink>
                {user && (
                  <>
                    <MobileNavLink 
                      to="/favoritos" 
                      isActive={isActive("/favoritos")}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-1">
                        <AiOutlineHeart className="w-5 h-5" />
                        <span>Favoritos</span>
                      </div>
                    </MobileNavLink>
                    <MobileNavLink 
                      to="/perfil" 
                      isActive={isActive("/perfil")}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-1">
                        <AiOutlineUser className="w-5 h-5" />
                        <span>{user.displayName || 'Perfil'}</span>
                      </div>
                    </MobileNavLink>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full btn-secondary"
                    >
                      Sair
                    </motion.button>
                  </>
                )}
                {!user && (
                  <Link 
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="w-full btn-primary"
                    >
                      Login
                    </motion.button>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

const NavLink = ({ to, children, isActive }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Link
      to={to}
      className={`font-medium transition-colors ${
        isActive
          ? "text-primary dark:text-primary"
          : "text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
      }`}
    >
      {children}
    </Link>
  </motion.div>
);

const MobileNavLink = ({ to, children, onClick, isActive }) => (
  <motion.div whileTap={{ scale: 0.95 }}>
    <Link
      to={to}
      onClick={onClick}
      className={`block font-medium transition-colors ${
        isActive
          ? "text-primary dark:text-primary"
          : "text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
      }`}
    >
      {children}
    </Link>
  </motion.div>
);

export default Navbar; 