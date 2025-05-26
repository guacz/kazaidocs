import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';
import { motion } from 'framer-motion';
import { getUserSubscription, getProductByPriceId } from '../services/stripe';

const PaymentSuccessPage: React.FC = () => {
  const { t } = useLocale();
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      try {
        const subscription = await getUserSubscription();
        if (subscription && subscription.price_id) {
          setSubscriptionDetails({
            ...subscription,
            product: getProductByPriceId(subscription.price_id)
          });
        }
      } catch (error) {
        console.error('Error fetching subscription details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptionDetails();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-primary-900 mb-4">
            {t('paymentSuccessTitle')}
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            {t('paymentSuccessMessage')}
          </p>
          
          {isLoading ? (
            <div className="flex justify-center my-6">
              <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
            </div>
          ) : subscriptionDetails ? (
            <div className="bg-primary-50 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold text-primary-900 mb-2">
                {t('subscriptionDetails')}
              </h2>
              
              <div className="text-left">
                <p className="mb-2">
                  <span className="font-medium">{t('plan')}:</span> {subscriptionDetails.product?.name || t('unknownPlan')}
                </p>
                <p className="mb-2">
                  <span className="font-medium">{t('status')}:</span> {subscriptionDetails.subscription_status}
                </p>
                {subscriptionDetails.current_period_end && (
                  <p>
                    <span className="font-medium">{t('nextBillingDate')}:</span> {new Date(subscriptionDetails.current_period_end * 1000).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ) : null}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/documents" className="btn-primary">
              {t('goToDocuments')}
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

export default PaymentSuccessPage;