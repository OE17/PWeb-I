import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Header.css';
import logo from '../assets/LogoSite.png';

function Header() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-content">
        <div className="logo-container">
          <Link to="/" className="logo-link">
            <img src={logo} alt="JOLP Studio" className="logo" />
            <span className="logo-text">JOLP-STUDIO</span>
          </Link>
        </div>
        <nav className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Início
          </Link>
          <Link to="/download" className={`nav-link ${location.pathname === '/download' ? 'active' : ''}`}>
            Download
          </Link>
          <Link to="/contato" className={`nav-link ${location.pathname === '/contato' ? 'active' : ''}`}>
            Contato
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header; 