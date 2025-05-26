import React, { useEffect, useState } from 'react';
import { useLocale } from '../../contexts/LocaleContext';
import { getUserSubscription, getProductByPriceId } from '../../services/stripe';
import { useAuth } from '../../contexts/AuthContext';

interface SubscriptionStatusProps {
  compact?: boolean;
}

const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ compact = false }) => {
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
    return (
      <div className={`${compact ? 'text-sm' : 'text-base'} text-gray-500`}>
        <div className="animate-pulse h-4 w-24 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`${compact ? 'text-sm' : 'text-base'} text-gray-500`}>
        {t('notLoggedIn')}
      </div>
    );
  }

  if (!subscription || subscription.subscription_status !== 'active') {
    return (
      <div className={`${compact ? 'text-sm' : 'text-base'} text-gray-500`}>
        {t('noActiveSubscription')}
      </div>
    );
  }

  if (compact) {
    return (
      <div className="text-sm">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {subscription.productName}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium text-primary-900 mb-2">{t('currentSubscription')}</h3>
      
      <div className="space-y-2">
        <p>
          <span className="font-medium">{t('plan')}:</span> {subscription.productName}
        </p>
        <p>
          <span className="font-medium">{t('status')}:</span> 
          <span className="ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {t('active')}
          </span>
        </p>
        {subscription.current_period_end && (
          <p>
            <span className="font-medium">{t('nextBillingDate')}:</span> {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default SubscriptionStatus;