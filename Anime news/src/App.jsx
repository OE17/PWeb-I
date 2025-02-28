import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Layout/Navbar';
import HomePage from './components/Home/HomePage';
import AnimeSearch from './components/Anime/AnimeSearch';
import AnimeDetails from './components/Anime/AnimeDetails';
import NewsPage from './components/News/NewsPage';
import NewsDetails from './components/News/NewsDetails';
import LoginPage from './components/Auth/LoginPage';
import FavoritesPage from './components/Favorites/FavoritesPage';
import ProfilePage from './components/Profile/ProfilePage';
import { AuthProvider } from './contexts/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Toaster position="top-right" />
            <Navbar />
            <main className="flex-1 w-full mt-16">
              <div className="min-h-[calc(100vh-4rem)] w-full">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/animes" element={<AnimeSearch />} />
                  <Route path="/anime/:id" element={<AnimeDetails />} />
                  <Route path="/noticias" element={<NewsPage />} />
                  <Route path="/noticias/:animeId/:id" element={<NewsDetails />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/favoritos" element={<FavoritesPage />} />
                  <Route path="/perfil" element={<ProfilePage />} />
                </Routes>
              </div>
            </main>
            <footer className="w-full py-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm mt-auto border-t border-gray-200 dark:border-gray-700">
              <div className="max-w-7xl mx-auto px-4 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    © 2024 AnimeHub. Todos os direitos reservados.
                  </div>
                  <div className="flex space-x-6">
                    <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                      Sobre
                    </a>
                    <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                      Privacidade
                    </a>
                    <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                      Termos
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;