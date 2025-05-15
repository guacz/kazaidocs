import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';
import { motion } from 'framer-motion';

const ContactPage: React.FC = () => {
  const { t } = useLocale();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({ name: '', email: '', message: '' });
    }, 1500);
  };
  
  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-primary-900 mb-2 text-center">
            {t('contactUs')}
          </h1>
          <p className="text-center text-gray-600 mb-8 max-w-xl mx-auto">
            {t('contactUsDescription')}
          </p>
          
          {isSubmitted ? (
            <motion.div 
              className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-green-800 mb-2">
                {t('thankYou')}
              </h2>
              <p className="text-green-700">
                {t('contactFormSuccess')}
              </p>
            </motion.div>
          ) : (
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-6 md:p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('name')} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="input"
                    value={formState.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('email')} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="input"
                    value={formState.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('message')} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="input resize-none"
                    value={formState.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn-primary flex items-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin h-5 w-5 border-2 border-white border-opacity-50 border-t-transparent rounded-full mr-2" />
                        {t('sending')}
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        {t('send')}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
          
          {/* Contact information */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-primary-900 mb-2">
                {t('emailUs')}
              </h3>
              <p className="text-gray-600">
                {t('emailUsDescription')}
              </p>
              <div className="mt-4">
                <a href="mailto:info@legaldocs.kz" className="text-primary-700 font-medium hover:underline">
                  info@legaldocs.kz
                </a>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-primary-900 mb-2">
                {t('businessHours')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('businessHoursDescription')}
              </p>
              <div className="text-gray-700">
                <div className="flex justify-between mb-1">
                  <span>{t('monday')} - {t('friday')}:</span>
                  <span>9:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('saturday')} - {t('sunday')}:</span>
                  <span>{t('closed')}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;