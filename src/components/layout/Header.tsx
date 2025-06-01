import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Scroll, Globe, LogOut } from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';
import SubscriptionStatus from '../subscription/SubscriptionStatus';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { locale, setLocale, t } = useLocale();
  const { user, logout } = useAuth();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  const closeUserMenu = () => setIsUserMenuOpen(false);

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
    { to: '/consultation', label: t('consultation') },
    { to: '/documents', label: t('documentFiller') },
    { to: '/faq', label: t('faq') },
    { to: '/contact', label: t('contact') },
    { to: '/pricing', label: t('pricing') },
  ];

  const handleLogout = async () => {
    await logout();
    closeUserMenu();
  };

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
              <div className="relative">
                <button 
                  className="btn-primary btn-sm flex items-center"
                  onClick={toggleUserMenu}
                >
                  <span>{user.email?.split('@')[0]}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                      <SubscriptionStatus compact />
                    </div>
                    <button
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="btn-outline btn-sm">
                  {t('login')}
                </Link>
                <Link to="/signup" className="btn-primary btn-sm">
                  {t('signUp')}
                </Link>
              </div>
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
        <nav className="md:hidden bg-white border-t border-gray-200">
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
                <div className="space-y-2">
                  <div className="flex items-center text-gray-700 py-2">
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <button 
                    className="flex items-center text-red-600 py-2"
                    onClick={async () => {
                      await logout();
                      closeMenu();
                    }}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    {t('logout')}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link 
                    to="/login" 
                    className="btn-outline w-full"
                    onClick={closeMenu}
                  >
                    {t('login')}
                  </Link>
                  <Link 
                    to="/signup" 
                    className="btn-primary w-full"
                    onClick={closeMenu}
                  >
                    {t('signUp')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;