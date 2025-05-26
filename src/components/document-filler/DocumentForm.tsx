import React, { useState, useEffect } from 'react';
import { FileText, Save } from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';
import { DocumentType, Template } from '../../types';
import { getTemplatesByType, getTemplateFields } from '../../services/templates';
import TemplateSelector from '../templates/TemplateSelector';

interface DocumentFormProps {
  documentType: DocumentType;
  onSubmit: (templateId: string, formData: Record<string, string>) => void;
  isProcessing: boolean;
}

const DocumentForm: React.FC<DocumentFormProps> = ({ documentType, onSubmit, isProcessing }) => {
  const { t } = useLocale();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [fields, setFields] = useState<any[]>([]);

  useEffect(() => {
    loadTemplates();
  }, [documentType]);

  useEffect(() => {
    if (selectedTemplate) {
      loadTemplateFields();
    }
  }, [selectedTemplate]);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const data = await getTemplatesByType(documentType);
      setTemplates(data);
      if (data.length > 0) {
        setSelectedTemplate(data[0]);
      }
    } catch (err) {
      console.error('Error loading templates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTemplateFields = async () => {
    if (!selectedTemplate) return;
    
    setIsLoading(true);
    try {
      const templateFields = await getTemplateFields(selectedTemplate.id);
      setFields(templateFields);
      
      // Initialize form data with empty values
      const initialFormData: Record<string, string> = {};
      templateFields.forEach(field => {
        initialFormData[field.field_name] = '';
      });
      
      setFormData(initialFormData);
      setFormErrors({});
    } catch (error) {
      console.error('Error loading template fields:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateChange = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value,
    }));
    
    // Clear error when field is edited
    if (formErrors[fieldName]) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    fields.forEach(field => {
      if (field.required && !formData[field.field_name]) {
        newErrors[field.field_name] = t('fieldRequired');
        isValid = false;
      }
    });
    
    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTemplate) return;
    
    if (validateForm()) {
      onSubmit(selectedTemplate.id, formData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center p-8">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noTemplatesAvailable')}</h3>
        <p className="text-gray-500">{t('noTemplatesForType')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      {templates.length > 1 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('selectTemplate')}:
          </label>
          
          <TemplateSelector 
            documentType={documentType}
            onSelectTemplate={handleTemplateChange}
            disabled={isProcessing}
          />
        </div>
      )}
      
      {selectedTemplate && (
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold text-primary-900 mb-4">
            {selectedTemplate.name}
          </h2>
          
          {selectedTemplate.description && (
            <p className="text-gray-600 mb-6">{selectedTemplate.description}</p>
          )}
          
          <div className="space-y-4">
            {fields
              .sort((a, b) => a.order - b.order)
              .map((field) => (
                <div key={field.id} className="form-group">
                  <label 
                    htmlFor={field.field_name} 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {field.display_name} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  
                  {field.field_type === 'textarea' ? (
                    <textarea
                      id={field.field_name}
                      name={field.field_name}
                      value={formData[field.field_name] || ''}
                      onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                      rows={3}
                      className={`input resize-none ${formErrors[field.field_name] ? 'border-red-500' : ''}`}
                      required={field.required}
                      disabled={isProcessing}
                    />
                  ) : field.field_type === 'date' ? (
                    <input
                      type="date"
                      id={field.field_name}
                      name={field.field_name}
                      value={formData[field.field_name] || ''}
                      onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                      className={`input ${formErrors[field.field_name] ? 'border-red-500' : ''}`}
                      required={field.required}
                      disabled={isProcessing}
                    />
                  ) : field.field_type === 'number' ? (
                    <input
                      type="number"
                      id={field.field_name}
                      name={field.field_name}
                      value={formData[field.field_name] || ''}
                      onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                      className={`input ${formErrors[field.field_name] ? 'border-red-500' : ''}`}
                      required={field.required}
                      disabled={isProcessing}
                    />
                  ) : (
                    <input
                      type="text"
                      id={field.field_name}
                      name={field.field_name}
                      value={formData[field.field_name] || ''}
                      onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                      className={`input ${formErrors[field.field_name] ? 'border-red-500' : ''}`}
                      required={field.required}
                      disabled={isProcessing}
                    />
                  )}
                  
                  {formErrors[field.field_name] && (
                    <p className="mt-1 text-sm text-red-500">{formErrors[field.field_name]}</p>
                  )}
                </div>
              ))}
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="btn-primary flex items-center"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-opacity-50 border-t-transparent rounded-full mr-2" />
                  {t('generating')}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {t('generateDocument')}
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default DocumentForm;