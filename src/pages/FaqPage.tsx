import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';
import { motion } from 'framer-motion';

const FaqPage: React.FC = () => {
  const { t } = useLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: t('faq1Question'),
      answer: t('faq1Answer'),
    },
    {
      question: t('faq2Question'),
      answer: t('faq2Answer'),
    },
    {
      question: t('faq3Question'),
      answer: t('faq3Answer'),
    },
    {
      question: t('faq4Question'),
      answer: t('faq4Answer'),
    },
    {
      question: t('faq5Question'),
      answer: t('faq5Answer'),
    },
    {
      question: t('faq6Question'),
      answer: t('faq6Answer'),
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-primary-900 mb-8 text-center">
            {t('frequentlyAskedQuestions')}
          </h1>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden bg-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  className="flex justify-between items-center w-full px-6 py-4 text-left font-medium text-primary-900 hover:bg-gray-50 focus:outline-none"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-primary-700" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-primary-700" />
                  )}
                </button>
                {openIndex === index && (
                  <motion.div
                    className="px-6 py-4 text-gray-600 border-t border-gray-100"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <p>{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">
              {t('stillHaveQuestions')}
            </p>
            <a 
              href="/contact" 
              className="btn-primary"
            >
              {t('contactUs')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;