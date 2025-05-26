import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../../contexts/LocaleContext';
import { useAuth } from '../../contexts/AuthContext';
import { getUserSubscription, getProductByPriceId } from '../../services/stripe';

const SubscriptionBanner: React.FC = () => {
  const { t } = useLocale();
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const userSubscription = await getUserSubscription();
        if (userSubscription && userSubscription.price_id) {
          const product = getProductByPriceId(userSubscription.price_id);
          setSubscription({
            ...userSubscription,
            productName: product?.name || t('unknownPlan')
          });
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, [user, t]);

  if (isLoading) {
    return null;
  }

  // If user has an active subscription, don't show the banner
  if (user && subscription && subscription.subscription_status === 'active') {
    return null;
  }

  return (
    <div className="bg-primary-800 text-white py-3">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between">
        <div className="text-center sm:text-left mb-3 sm:mb-0">
          <p className="text-sm sm:text-base">
            {user 
              ? t('upgradePromptLoggedIn')
              : t('upgradePromptLoggedOut')}
          </p>
        </div>
        <div>
          <Link 
            to="/pricing" 
            className="btn bg-white text-primary-800 hover:bg-primary-50 text-sm py-1 px-4"
          >
            {t('viewPlans')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBanner;