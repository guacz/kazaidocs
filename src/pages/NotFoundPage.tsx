import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';

const NotFoundPage: React.FC = () => {
  const { t } = useLocale();
  
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">{t('pageNotFound')}</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-8">{t('pageNotFoundDescription')}</p>
        <Link to="/" className="btn-primary inline-flex items-center">
          <Home className="h-5 w-5 mr-2" />
          {t('backToHome')}
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;