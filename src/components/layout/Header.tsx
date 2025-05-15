import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Scroll, Globe } from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { locale, setLocale, t } = useLocale();
  const { user, openAuthModal } = useAuth();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Check if page is scrolled for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation links
  const navLinks = [
    { to: '/', label: t('home') },
    { to: '/chat', label: t('createDocument') },
    { to: '/faq', label: t('faq') },
    { to: '/contact', label: t('contact') },
  ];

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
          <Scroll className="h-8 w-8 text-primary-800" />
          <span className="text-xl font-bold text-primary-900">{t('appName')}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <ul className="flex space-x-6">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link 
                  to={link.to}
                  className={cn(
                    'text-base font-medium hover:text-primary-700 transition-colors',
                    location.pathname === link.to 
                      ? 'text-primary-800 font-semibold'
                      : 'text-gray-600'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <button 
              className="flex items-center text-gray-600 hover:text-primary-700 transition-colors"
              onClick={() => setLocale(locale === 'kk' ? 'ru' : 'kk')}
            >
              <Globe className="h-5 w-5 mr-1" />
              <span className="uppercase text-sm font-medium">{locale === 'kk' ? 'РУ' : 'KK'}</span>
            </button>

            {/* Authentication */}
            {user ? (
              <button className="btn-primary btn-sm">
                {user.email.substring(0, user.email.indexOf('@'))}
              </button>
            ) : (
              <button 
                className="btn-outline btn-sm"
                onClick={openAuthModal}
              >
                {t('signIn')}
              </button>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700" 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-3">
            <ul className="space-y-4 py-2">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to}
                    onClick={closeMenu}
                    className={cn(
                      'block py-2 text-base font-medium',
                      location.pathname === link.to 
                        ? 'text-primary-800 font-semibold'
                        : 'text-gray-600'
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col space-y-4">
              {/* Language Selector */}
              <button 
                className="flex items-center text-gray-600 py-2"
                onClick={() => {
                  setLocale(locale === 'kk' ? 'ru' : 'kk');
                  closeMenu();
                }}
              >
                <Globe className="h-5 w-5 mr-2" />
                <span>{locale === 'kk' ? t('switchToRussian') : t('switchToKazakh')}</span>
              </button>

              {/* Authentication */}
              {user ? (
                <div className="flex items-center text-gray-600 py-2">
                  <span className="font-medium">{user.email}</span>
                </div>
              ) : (
                <button 
                  className="btn-primary w-full"
                  onClick={() => {
                    openAuthModal();
                    closeMenu();
                  }}
                >
                  {t('signIn')}
                </button>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;