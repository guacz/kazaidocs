import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, MessageSquare, Download, CheckCircle, Users, Bot, FileBox } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const { t } = useLocale();
  
  const modules = [
    {
      icon: <Bot className="h-6 w-6 text-white" />,
      title: t('consultationModule'),
      description: t('consultationModuleDescription'),
      link: '/consultation',
      buttonText: t('getConsultation'),
      color: 'bg-primary-600',
    },
    {
      icon: <FileBox className="h-6 w-6 text-white" />,
      title: t('documentModule'),
      description: t('documentModuleDescription'),
      link: '/documents',
      buttonText: t('createDocument'),
      color: 'bg-secondary-600',
    }
  ];
  
  const features = [
    {
      icon: <MessageSquare className="h-6 w-6 text-white" />,
      title: t('featureChat'),
      description: t('featureChatDescription'),
    },
    {
      icon: <FileText className="h-6 w-6 text-white" />,
      title: t('featureTemplates'),
      description: t('featureTemplatesDescription'),
    },
    {
      icon: <Download className="h-6 w-6 text-white" />,
      title: t('featureExport'),
      description: t('featureExportDescription'),
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-white" />,
      title: t('featureLegal'),
      description: t('featureLegalDescription'),
    },
  ];
  
  const documentTypes = [
    'purchase_sale',
    'lease',
    'services',
    'contract_work',
    'employment',
  ];
  
  const staggerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-primary-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-primary-900 mb-4">
              {t('heroTitle')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              {t('heroSubtitle')}
            </p>
          </motion.div>
          
          {/* Core Modules */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-10"
          >
            {modules.map((module, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg p-8 shadow-md border border-gray-100 flex flex-col items-center text-center"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                transition={{ duration: 0.2 }}
              >
                <div className={`${module.color} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                  {module.icon}
                </div>
                <h2 className="text-2xl font-semibold text-primary-900 mb-3">
                  {module.title}
                </h2>
                <p className="text-gray-600 mb-6">
                  {module.description}
                </p>
                <Link to={module.link} className="btn-primary mt-auto">
                  {module.buttonText}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-900 mb-4">
              {t('featuresTitle')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('featuresSubtitle')}
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerAnimation}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-lg p-6 shadow-md border border-gray-100 transition-all hover:shadow-lg"
                variants={itemAnimation}
              >
                <div className="bg-primary-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-primary-900 mb-2 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Documents Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-900 mb-4">
              {t('documentTypesTitle')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('documentTypesSubtitle')}
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            variants={staggerAnimation}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            {documentTypes.map((docType, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all"
                variants={itemAnimation}
                whileHover={{ y: -5 }}
              >
                <Link to="/documents" className="flex items-center">
                  <div className="bg-primary-100 p-3 rounded-lg mr-4">
                    <FileText className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-primary-900 mb-1">
                      {t(docType)}
                    </h3>
                    <p className="text-sm text-gray-500">{t(`${docType}Short`)}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
            
            <motion.div
              className="bg-primary-50 rounded-lg p-5 shadow-sm border border-primary-100 sm:col-span-2 md:col-span-3"
              variants={itemAnimation}
            >
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0 text-center md:text-left">
                  <h3 className="text-xl font-semibold text-primary-900 mb-2">
                    {t('readyToStart')}
                  </h3>
                  <p className="text-primary-700">
                    {t('readyToStartDescription')}
                  </p>
                </div>
                <div className="flex space-x-4">
                  <Link to="/consultation" className="btn-outline">
                    {t('getConsultation')}
                  </Link>
                  <Link to="/documents" className="btn-primary">
                    {t('createDocument')}
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-900 mb-4">
              {t('howItWorksTitle')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('howItWorksSubtitle')}
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary-100"></div>
              
              {/* Steps */}
              <motion.div 
                className="space-y-12"
                variants={staggerAnimation}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
              >
                {[1, 2, 3, 4].map((step) => (
                  <motion.div 
                    key={step} 
                    className="relative flex flex-col md:flex-row"
                    variants={itemAnimation}
                  >
                    <div className={`md:w-1/2 ${step % 2 === 0 ? 'md:order-1' : 'md:order-0'} p-4`}>
                      <div className={`bg-white p-6 rounded-lg shadow-md ${step % 2 === 0 ? 'md:ml-8' : 'md:mr-8'}`}>
                        <h3 className="text-xl font-semibold text-primary-900 mb-2">
                          {t(`step${step}Title`)}
                        </h3>
                        <p className="text-gray-600">
                          {t(`step${step}Description`)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Circle */}
                    <div className="absolute md:left-1/2 md:transform md:-translate-x-1/2 left-5 top-6">
                      <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold shadow-lg">
                        {step}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6 text-white">
              {t('ctaTitle')}
            </h2>
            <p className="text-lg text-primary-100 max-w-2xl mx-auto mb-8">
              {t('ctaSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/consultation" className="btn bg-white text-primary-900 hover:bg-primary-50">
                {t('getConsultation')}
              </Link>
              <Link to="/documents" className="btn bg-secondary-600 text-white hover:bg-secondary-700">
                {t('createDocument')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;