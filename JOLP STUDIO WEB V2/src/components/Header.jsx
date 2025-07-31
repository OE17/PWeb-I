import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Header.css';
import logo from '../assets/LogoSite.png';

function Header() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-content">
        <div className="logo-container">
          <Link to="/" className="logo-link" onClick={closeMobileMenu}>
            <img 
              src={logo} 
              alt="JOLP Studio - Logo da empresa de desenvolvimento de jogos" 
              className="logo" 
              loading="eager"
              decoding="async"
            />
            <span className="logo-text">JOLP-STUDIO</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="nav-links desktop-nav">
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

        {/* Mobile Menu Button */}
        <button 
          className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Mobile Navigation */}
        <nav className={`mobile-nav ${mobileMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className={`mobile-nav-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Início
          </Link>
          <Link 
            to="/download" 
            className={`mobile-nav-link ${location.pathname === '/download' ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Download
          </Link>
          <Link 
            to="/contato" 
            className={`mobile-nav-link ${location.pathname === '/contato' ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Contato
          </Link>
        </nav>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>}
      </div>
    </header>
  );
}

export default Header; 