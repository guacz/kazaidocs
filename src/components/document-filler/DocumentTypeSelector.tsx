import React from 'react';
import { FileText, Check } from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';
import { DocumentType } from '../../types';
import { motion } from 'framer-motion';

interface DocumentTypeSelectorProps {
  onSelect: (documentType: DocumentType) => void;
}

const DocumentTypeSelector: React.FC<DocumentTypeSelectorProps> = ({ onSelect }) => {
  const { t } = useLocale();
  
  const documentTypes: Array<{type: DocumentType; icon: JSX.Element}> = [
    { 
      type: 'purchase_sale',
      icon: <FileText className="h-6 w-6 text-primary-600" />
    },
    { 
      type: 'lease',
      icon: <FileText className="h-6 w-6 text-primary-600" />
    },
    { 
      type: 'services',
      icon: <FileText className="h-6 w-6 text-primary-600" />
    },
    { 
      type: 'contract_work',
      icon: <FileText className="h-6 w-6 text-primary-600" />
    },
    { 
      type: 'employment',
      icon: <FileText className="h-6 w-6 text-primary-600" />
    },
  ];
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-primary-900 mb-6 text-center">
        {t('selectDocumentType')}
      </h2>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {documentTypes.map(({ type, icon }) => (
          <motion.button
            key={type}
            className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all text-left"
            onClick={() => onSelect(type)}
            variants={item}
            whileHover={{ y: -5, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="bg-primary-100 p-3 rounded-lg mr-4 flex-shrink-0">
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-medium text-primary-900 mb-1">
                {t(type)}
              </h3>
              <p className="text-sm text-gray-500">{t(`${type}Short`)}</p>
            </div>
          </motion.button>
        ))}
      </motion.div>
      
      <p className="text-center text-gray-500 text-sm mt-6">
        {t('documentTypeSelectorHelp')}
      </p>
    </div>
  );
};

export default DocumentTypeSelector;