import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { URLS } from '../navigation/CONSTANTS';
import '../style/style.css';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Inicio', path: URLS.HOMEPAGE },
    { name: 'Mapa', path: URLS.MAPA },
    { name: 'Pawnshop', path: URLS.PAWNSHOP },
    { name: 'Robos', path: URLS.ROBOS },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar-container">
      <div className="navbar-content">
        {/* Desktop Layout */}
        <div className="navbar-desktop">
          {/* Left - Home Button */}
          <Link to={URLS.HOMEPAGE} className="navbar-home-btn">
            <div className="navbar-home-btn-inner">
              <svg className="navbar-home-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="navbar-home-text">Inicio</span>
            </div>
          </Link>

          {/* Center - Navigation Links */}
          <div className="navbar-links">
            {navItems.slice(1).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`navbar-link ${isActive(item.path) ? 'navbar-link-active' : ''}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right - Changos Logo & Text */}
          <div className="navbar-brand">
            <span className="navbar-brand-text">Changos</span>
            <img src="/ChangosLogo.png" alt="Changos Logo" className="navbar-brand-logo" />
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="navbar-mobile">
          {/* Left - Changos Web + Logo */}
          <div className="navbar-mobile-brand">
            <span className="navbar-mobile-brand-text">Changos Web</span>
            <img src="/ChangosLogo.png" alt="Changos Logo" className="navbar-mobile-brand-logo" />
          </div>

          {/* Right - Hamburger Menu */}
          <button 
            className="navbar-hamburger"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className={`navbar-hamburger-line ${isMobileMenuOpen ? 'navbar-hamburger-open' : ''}`}></div>
            <div className={`navbar-hamburger-line ${isMobileMenuOpen ? 'navbar-hamburger-open' : ''}`}></div>
            <div className={`navbar-hamburger-line ${isMobileMenuOpen ? 'navbar-hamburger-open' : ''}`}></div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`navbar-mobile-menu ${isMobileMenuOpen ? 'navbar-mobile-menu-open' : ''}`}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`navbar-mobile-link ${isActive(item.path) ? 'navbar-mobile-link-active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
