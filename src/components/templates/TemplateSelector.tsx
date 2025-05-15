import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTemplatesByType } from '../../services/templates';
import { Template, DocumentType } from '../../types';
import { useLocale } from '../../contexts/LocaleContext';

interface TemplateSelectorProps {
  documentType: DocumentType | null;
  onSelectTemplate: (template: Template) => void;
  disabled?: boolean;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  documentType, 
  onSelectTemplate,
  disabled = false
}) => {
  const { t } = useLocale();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (documentType) {
      loadTemplates(documentType);
    } else {
      setTemplates([]);
    }
  }, [documentType]);

  const loadTemplates = async (type: DocumentType) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getTemplatesByType(type);
      setTemplates(data);
    } catch (err) {
      console.error('Error loading templates:', err);
      setError(t('templatesLoadError'));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDropdown = () => {
    if (!disabled && templates.length > 0) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelectTemplate = (template: Template) => {
    onSelectTemplate(template);
    setIsOpen(false);
  };

  if (!documentType) {
    return null;
  }

  return (
    <div className="w-full mb-4">
      <div className="text-sm font-medium text-gray-700 mb-1">
        {t('selectTemplate')}:
      </div>
      
      <div className="relative">
        <button
          type="button"
          className={`flex items-center justify-between w-full p-3 bg-white border ${
            disabled ? 'border-gray-200 bg-gray-50 cursor-not-allowed' : 'border-gray-300 hover:border-primary-400'
          } rounded-md shadow-sm transition-colors`}
          onClick={toggleDropdown}
          disabled={disabled || templates.length === 0}
        >
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-primary-600 mr-2" />
            <span className={disabled ? 'text-gray-500' : 'text-gray-700'}>
              {isLoading 
                ? t('loadingTemplates') 
                : templates.length === 0 
                  ? t('noTemplatesAvailable')
                  : t('selectTemplateOption')
              }
            </span>
          </div>
          {templates.length > 0 && !disabled && (
            <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
          )}
        </button>
        
        {error && (
          <div className="mt-1 text-sm text-red-500">
            {error}
          </div>
        )}

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ul className="py-1 max-h-60 overflow-auto">
                {templates.map((template) => (
                  <li key={template.id}>
                    <button
                      type="button"
                      className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-primary-50"
                      onClick={() => handleSelectTemplate(template)}
                    >
                      <Check className="h-4 w-4 text-primary-600 mr-2 invisible" />
                      <div>
                        <div className="font-medium text-gray-900">{template.name}</div>
                        {template.description && (
                          <div className="text-xs text-gray-500">{template.description}</div>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TemplateSelector;