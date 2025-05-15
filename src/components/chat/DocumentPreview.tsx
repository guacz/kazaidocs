import React from 'react';
import { FileText, Download, RefreshCw } from 'lucide-react';
import { DocumentType } from '../../types';
import { useLocale } from '../../contexts/LocaleContext';
import { motion } from 'framer-motion';
import { useChat } from '../../contexts/ChatContext';

interface DocumentPreviewProps {
  documentUrl: string;
  documentType: DocumentType | null;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ documentUrl, documentType }) => {
  const { t } = useLocale();
  const { resetChat } = useChat();
  
  const handleDownload = () => {
    // In a real implementation, this would trigger the actual download
    alert(t('downloadStarted'));
  };
  
  return (
    <motion.div 
      className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 my-4 mx-auto max-w-2xl"
      initial={{ opacity: '0', y: '20px' }}
      animate={{ opacity: '1', y: '0' }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-center mb-4">
        <div className="bg-primary-50 p-3 rounded-lg">
          <FileText className="h-8 w-8 text-primary-600" />
        </div>
      </div>
      
      <h3 className="text-lg font-medium text-center mb-1">
        {documentType ? t(documentType) : t('document')}
      </h3>
      
      <p className="text-gray-500 text-sm text-center mb-4">
        {t('documentReadyDescription')}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button 
          onClick={handleDownload} 
          className="btn-primary flex items-center justify-center"
        >
          <Download className="mr-2 h-5 w-5" />
          {t('downloadDocument')}
        </button>
        
        <button 
          onClick={resetChat} 
          className="btn-outline flex items-center justify-center"
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          {t('createNewDocument')}
        </button>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        {t('downloadDisclaimer')}
      </div>
    </motion.div>
  );
};

export default DocumentPreview;