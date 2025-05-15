import React from 'react';
import { Link } from 'react-router-dom';
import { Scroll } from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';

const Footer: React.FC = () => {
  const { t } = useLocale();
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Scroll className="h-6 w-6 text-primary-800" />
              <span className="text-lg font-bold text-primary-900">{t('appName')}</span>
            </Link>
            <p className="text-gray-600 text-sm">
              {t('footerDescription')}
            </p>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary-700 text-sm">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-gray-600 hover:text-primary-700 text-sm">
                  {t('createDocument')}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-primary-700 text-sm">
                  {t('faq')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary-700 text-sm">
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">{t('legal')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/legal#terms" className="text-gray-600 hover:text-primary-700 text-sm">
                  {t('termsOfService')}
                </Link>
              </li>
              <li>
                <Link to="/legal#privacy" className="text-gray-600 hover:text-primary-700 text-sm">
                  {t('privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link to="/legal#data-processing" className="text-gray-600 hover:text-primary-700 text-sm">
                  {t('dataProcessing')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-gray-500 text-sm text-center">
            &copy; {currentYear} {t('appName')}. {t('allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;