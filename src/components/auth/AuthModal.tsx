import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocale } from '../../contexts/LocaleContext';
import { motion } from 'framer-motion';

const AuthModal: React.FC = () => {
  const { closeAuthModal, login, isLoading, error } = useAuth();
  const { t } = useLocale();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, phone);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={closeAuthModal}
        />

        {/* Modal */}
        <motion.div 
          className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
          {/* Close button */}
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-500"
            onClick={closeAuthModal}
          >
            <X className="h-5 w-5" />
          </button>

          <div className="text-center mb-6">
            <h3 className="text-xl font-medium text-gray-900 mb-1">{t('authTitle')}</h3>
            <p className="text-sm text-gray-500">{t('authSubtitle')}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('email')} *
              </label>
              <input
                type="email"
                id="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="example@domain.com"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                {t('phone')} ({t('optional')})
              </label>
              <input
                type="tel"
                id="phone"
                className="input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (701) 123-45-67"
              />
            </div>

            <div className="text-sm text-gray-500 mb-4">
              {t('authDisclaimer')}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="btn-outline btn-sm mr-3"
                onClick={closeAuthModal}
                disabled={isLoading}
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="btn-primary btn-sm"
                disabled={isLoading}
              >
                {isLoading ? t('processing') : t('continue')}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthModal;