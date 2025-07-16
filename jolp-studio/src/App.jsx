import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Inicio from './pages/Inicio';
import Download from './pages/Download';
import Contato from './pages/Contato';
import './App.css';

// Componente para animar transições de página
function AnimatedRoutes() {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/download" element={<Download />} />
      <Route path="/contato" element={<Contato />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <AnimatedRoutes />
        </main>
        <footer className="footer">
          <p>JOLP Studio Softworks 2025</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
