import React, { useState } from 'react';
import { useLocale } from '../contexts/LocaleContext';
import { motion } from 'framer-motion';
import { DocumentType } from '../types';
import DocumentTypeSelector from '../components/document-filler/DocumentTypeSelector';
import DocumentForm from '../components/document-filler/DocumentForm';
import DocumentPreview from '../components/chat/DocumentPreview';
import { useAuth } from '../contexts/AuthContext';

const DocumentFillerPage: React.FC = () => {
  const { t } = useLocale();
  const { user, openAuthModal } = useAuth();
  const [selectedDocType, setSelectedDocType] = useState<DocumentType | null>(null);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDocTypeSelect = (docType: DocumentType) => {
    setSelectedDocType(docType);
    setDocumentUrl(null);
  };

  const handleFormSubmit = async (templateId: string, formData: Record<string, string>) => {
    if (!user) {
      openAuthModal();
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate API call to generate document
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock document URL
      setDocumentUrl(`/documents/${selectedDocType}_${Date.now()}.pdf`);
    } catch (error) {
      console.error('Error generating document:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedDocType(null);
    setDocumentUrl(null);
  };

  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {documentUrl ? (
            <DocumentPreview documentUrl={documentUrl} documentType={selectedDocType} />
          ) : selectedDocType ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-primary-900">{t('fillDocument')}</h1>
                <button 
                  className="text-primary-600 hover:text-primary-800 font-medium"
                  onClick={handleReset}
                >
                  {t('chooseAnotherDocument')}
                </button>
              </div>
              
              <DocumentForm 
                documentType={selectedDocType}
                onSubmit={handleFormSubmit}
                isProcessing={isProcessing}
              />
            </motion.div>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-primary-900 mb-6 text-center">
                {t('documentFillerTitle')}
              </h1>
              <p className="text-center text-gray-600 mb-10">
                {t('documentFillerDescription')}
              </p>
              
              <DocumentTypeSelector onSelect={handleDocTypeSelect} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentFillerPage;