import React, { useState, useEffect } from 'react';
import { ChevronLeft, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { Template, TemplateField, TemplateFormData } from '../../types';
import { getTemplateFields } from '../../services/templates';
import { useLocale } from '../../contexts/LocaleContext';

interface TemplateFormProps {
  template: Template;
  onSubmit: (templateId: string, formData: TemplateFormData) => void;
  onBack: () => void;
}

const TemplateForm: React.FC<TemplateFormProps> = ({ template, onSubmit, onBack }) => {
  const { t } = useLocale();
  const [fields, setFields] = useState<TemplateField[]>([]);
  const [formData, setFormData] = useState<TemplateFormData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadTemplateFields();
  }, [template.id]);

  const loadTemplateFields = async () => {
    setIsLoading(true);
    try {
      const templateFields = await getTemplateFields(template.id);
      setFields(templateFields);
      
      // Initialize form data with empty values
      const initialFormData: TemplateFormData = {};
      templateFields.forEach(field => {
        initialFormData[field.field_name] = '';
      });
      
      setFormData(initialFormData);
    } catch (error) {
      console.error('Error loading template fields:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: TemplateField, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field.field_name]: value,
    }));
    
    // Clear error when field is edited
    if (errors[field.field_name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[field.field_name];
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
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(template.id, formData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <button
            type="button"
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h3 className="text-xl font-semibold text-primary-900">{template.name}</h3>
        </div>
        
        {template.description && (
          <p className="text-gray-600 mb-6">{template.description}</p>
        )}
        
        <form onSubmit={handleSubmit}>
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
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      rows={3}
                      className={`input resize-none ${errors[field.field_name] ? 'border-red-500' : ''}`}
                      required={field.required}
                    />
                  ) : field.field_type === 'date' ? (
                    <input
                      type="date"
                      id={field.field_name}
                      name={field.field_name}
                      value={formData[field.field_name] || ''}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className={`input ${errors[field.field_name] ? 'border-red-500' : ''}`}
                      required={field.required}
                    />
                  ) : field.field_type === 'number' ? (
                    <input
                      type="number"
                      id={field.field_name}
                      name={field.field_name}
                      value={formData[field.field_name] || ''}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className={`input ${errors[field.field_name] ? 'border-red-500' : ''}`}
                      required={field.required}
                    />
                  ) : (
                    <input
                      type="text"
                      id={field.field_name}
                      name={field.field_name}
                      value={formData[field.field_name] || ''}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className={`input ${errors[field.field_name] ? 'border-red-500' : ''}`}
                      required={field.required}
                    />
                  )}
                  
                  {errors[field.field_name] && (
                    <p className="mt-1 text-sm text-red-500">{errors[field.field_name]}</p>
                  )}
                </div>
              ))}
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onBack}
              className="btn-outline btn-sm mr-3"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="btn-primary btn-sm flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {t('generateDocument')}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default TemplateForm;