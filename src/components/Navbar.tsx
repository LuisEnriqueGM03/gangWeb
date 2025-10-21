import { Link, useLocation } from 'react-router-dom';
import { URLS } from '../navigation/CONSTANTS';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Mapa', path: URLS.MAPA },
    { name: 'Pawnshop', path: URLS.PAWNSHOP },
    { name: 'Robos', path: URLS.ROBOS },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/10 shadow-2xl" style={{ background: 'linear-gradient(to right, rgba(10, 35, 40, 0.95), rgba(29, 126, 115, 0.95), rgba(10, 35, 40, 0.95))' }}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Left - Home Button */}
          <Link
            to={URLS.HOMEPAGE}
            className="group flex items-center gap-3"
          >
            <div className="flex items-center gap-3 text-white px-5 py-2.5 rounded-full transform hover:scale-105 transition-all duration-300" style={{ background: 'linear-gradient(to right, #2A9D8F, #3BB9AB)', boxShadow: '0 10px 25px -5px rgba(59, 185, 171, 0.4)' }}>
              <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-semibold">Inicio</span>
            </div>
          </Link>

          {/* Center - Navigation Links */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isActive(item.path)
                    ? 'text-white shadow-xl'
                    : 'text-white/70 hover:text-white'
                }`}
                style={{
                  background: isActive(item.path)
                    ? 'linear-gradient(to right, #2A9D8F, #3BB9AB)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: isActive(item.path)
                    ? '0 10px 25px -5px rgba(59, 185, 171, 0.5)'
                    : 'none'
                }}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right - Changos Logo & Text */}
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-white tracking-wide">Changos</span>
            <img 
              src="/ChangosLogo.png" 
              alt="Changos Logo" 
              className="w-12 h-12 object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
