import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLocale } from '../contexts/LocaleContext';

const LegalInfoPage: React.FC = () => {
  const { t } = useLocale();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>('terms');
  
  // Extract hash from URL
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash === 'terms' || hash === 'privacy' || hash === 'data-processing') {
      setActiveTab(hash);
    }
  }, [location]);
  
  const tabs = [
    { id: 'terms', label: t('termsOfService') },
    { id: 'privacy', label: t('privacyPolicy') },
    { id: 'data-processing', label: t('dataProcessing') },
  ];
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-primary-900 mb-8 text-center">
            {t('legalInformation')}
          </h1>
          
          {/* Tabs */}
          <div className="flex flex-wrap mb-8 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`px-6 py-3 font-medium text-base focus:outline-none ${
                  activeTab === tab.id
                    ? 'text-primary-700 border-b-2 border-primary-500'
                    : 'text-gray-500 hover:text-primary-600'
                }`}
                onClick={() => {
                  setActiveTab(tab.id);
                  window.history.replaceState(null, '', `#${tab.id}`);
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Tab content */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            {activeTab === 'terms' && (
              <div>
                <h2 className="text-2xl font-semibold text-primary-900 mb-4">
                  {t('termsOfService')}
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4">
                    {t('termsOfServiceContent1')}
                  </p>
                  <p className="mb-4">
                    {t('termsOfServiceContent2')}
                  </p>
                  <h3 className="text-xl font-medium text-primary-900 mt-6 mb-3">
                    {t('termsOfServiceSection1')}
                  </h3>
                  <p className="mb-4">
                    {t('termsOfServiceSection1Content')}
                  </p>
                  <h3 className="text-xl font-medium text-primary-900 mt-6 mb-3">
                    {t('termsOfServiceSection2')}
                  </h3>
                  <p className="mb-4">
                    {t('termsOfServiceSection2Content')}
                  </p>
                  <h3 className="text-xl font-medium text-primary-900 mt-6 mb-3">
                    {t('termsOfServiceSection3')}
                  </h3>
                  <p>
                    {t('termsOfServiceSection3Content')}
                  </p>
                </div>
              </div>
            )}
            
            {activeTab === 'privacy' && (
              <div>
                <h2 className="text-2xl font-semibold text-primary-900 mb-4">
                  {t('privacyPolicy')}
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4">
                    {t('privacyPolicyContent1')}
                  </p>
                  <p className="mb-4">
                    {t('privacyPolicyContent2')}
                  </p>
                  <h3 className="text-xl font-medium text-primary-900 mt-6 mb-3">
                    {t('privacyPolicySection1')}
                  </h3>
                  <p className="mb-4">
                    {t('privacyPolicySection1Content')}
                  </p>
                  <h3 className="text-xl font-medium text-primary-900 mt-6 mb-3">
                    {t('privacyPolicySection2')}
                  </h3>
                  <p className="mb-4">
                    {t('privacyPolicySection2Content')}
                  </p>
                  <h3 className="text-xl font-medium text-primary-900 mt-6 mb-3">
                    {t('privacyPolicySection3')}
                  </h3>
                  <p>
                    {t('privacyPolicySection3Content')}
                  </p>
                </div>
              </div>
            )}
            
            {activeTab === 'data-processing' && (
              <div>
                <h2 className="text-2xl font-semibold text-primary-900 mb-4">
                  {t('dataProcessing')}
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4">
                    {t('dataProcessingContent1')}
                  </p>
                  <p className="mb-4">
                    {t('dataProcessingContent2')}
                  </p>
                  <h3 className="text-xl font-medium text-primary-900 mt-6 mb-3">
                    {t('dataProcessingSection1')}
                  </h3>
                  <p className="mb-4">
                    {t('dataProcessingSection1Content')}
                  </p>
                  <h3 className="text-xl font-medium text-primary-900 mt-6 mb-3">
                    {t('dataProcessingSection2')}
                  </h3>
                  <p className="mb-4">
                    {t('dataProcessingSection2Content')}
                  </p>
                  <h3 className="text-xl font-medium text-primary-900 mt-6 mb-3">
                    {t('dataProcessingSection3')}
                  </h3>
                  <p>
                    {t('dataProcessingSection3Content')}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-8 text-center text-gray-500 text-sm">
            {t('lastUpdated')}: {t('lastUpdatedDate')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalInfoPage;