import React, { useState } from 'react';
import { useLocale } from '../contexts/LocaleContext';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Check, Loader } from 'lucide-react';
import { PRODUCTS } from '../stripe-config';
import { createCheckoutSession } from '../services/stripe';

const PricingPage: React.FC = () => {
  const { t } = useLocale();
  const { user, openAuthModal } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string, mode: 'payment' | 'subscription') => {
    if (!user) {
      openAuthModal();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { url } = await createCheckoutSession(priceId, mode);
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      console.error('Error creating checkout session:', err);
      setError(t('checkoutError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-primary-900 mb-4 text-center">
            {t('pricingTitle')}
          </h1>
          <p className="text-lg text-gray-600 mb-12 text-center max-w-2xl mx-auto">
            {t('pricingSubtitle')}
          </p>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8 text-center">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-1 gap-8">
            {/* Subscription Plan */}
            <motion.div
              className="bg-white rounded-lg shadow-lg overflow-hidden border border-primary-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-primary-600 p-6 text-white text-center">
                <h2 className="text-2xl font-bold mb-2">{PRODUCTS.PURCHASE_SALE.name}</h2>
                <p className="opacity-90">{PRODUCTS.PURCHASE_SALE.description}</p>
                <div className="mt-4 text-3xl font-bold">
                  100 ₸ <span className="text-sm font-normal opacity-80">/ {t('month')}</span>
                </div>
              </div>

              <div className="p-6">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{t('featureTemplates')}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{t('featureUnlimitedDocuments')}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{t('featureAIAssistance')}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{t('featureExport')}</span>
                  </li>
                </ul>

                <button
                  className="btn-primary w-full flex justify-center items-center"
                  onClick={() => handleSubscribe(PRODUCTS.PURCHASE_SALE.priceId, PRODUCTS.PURCHASE_SALE.mode)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin h-5 w-5 mr-2" />
                      {t('processing')}
                    </>
                  ) : (
                    t('subscribe')
                  )}
                </button>
              </div>
            </motion.div>
          </div>

          <div className="mt-12 text-center text-gray-600">
            <p className="mb-2">{t('securePayment')}</p>
            <p className="text-sm">{t('termsApply')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;