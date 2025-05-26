import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';
import { motion } from 'framer-motion';

const PaymentCanceledPage: React.FC = () => {
  const { t } = useLocale();
  
  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-primary-900 mb-4">
            {t('paymentCanceledTitle')}
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            {t('paymentCanceledMessage')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pricing" className="btn-primary">
              {t('tryAgain')}
            </Link>
            <Link to="/" className="btn-outline">
              {t('backToHome')}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentCanceledPage;