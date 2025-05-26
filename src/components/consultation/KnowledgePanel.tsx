import React, { useState } from 'react';
import { Search, FileText, X, ChevronRight, ChevronDown, Bookmark } from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';
import { motion, AnimatePresence } from 'framer-motion';

interface KnowledgeCategory {
  id: string;
  title: string;
  documents: KnowledgeDocument[];
}

interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

const KnowledgePanel: React.FC = () => {
  const { t } = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('cat1');
  const [selectedDocument, setSelectedDocument] = useState<KnowledgeDocument | null>(null);

  // Mock data - in a real app, this would be fetched from an API
  const knowledgeCategories: KnowledgeCategory[] = [
    {
      id: 'cat1',
      title: 'Гражданское право',
      documents: [
        {
          id: 'doc1',
          title: 'Договор купли-продажи',
          content: 'Договор купли-продажи регулируется ГК РК. Статья 406 определяет договор купли-продажи как договор, по которому одна сторона (продавец) обязуется передать вещь (товар) в собственность другой стороне (покупателю), а покупатель обязуется принять этот товар и уплатить за него определенную денежную сумму (цену).',
          tags: ['договор', 'купля-продажа', 'ГК РК']
        },
        {
          id: 'doc2',
          title: 'Договор аренды',
          content: 'Договор аренды регулируется главой 29 ГК РК. По договору аренды (имущественного найма) арендодатель (наймодатель) обязуется предоставить арендатору (нанимателю) имущество за плату во временное владение и пользование или во временное пользование.',
          tags: ['договор', 'аренда', 'ГК РК']
        }
      ]
    },
    {
      id: 'cat2',
      title: 'Трудовое право',
      documents: [
        {
          id: 'doc3',
          title: 'Трудовой договор',
          content: 'Трудовой договор регулируется Трудовым кодексом РК. Согласно ст. 33, трудовой договор - письменное соглашение между работником и работодателем, в соответствии с которым работник обязуется лично выполнять определенную работу, а работодатель обязуется предоставить работу, выплачивать работнику заработную плату и обеспечивать условия труда.',
          tags: ['трудовой договор', 'Трудовой кодекс']
        }
      ]
    }
  ];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const viewDocument = (document: KnowledgeDocument) => {
    setSelectedDocument(document);
  };

  const closeDocument = () => {
    setSelectedDocument(null);
  };

  const filteredCategories = searchQuery 
    ? knowledgeCategories.map(category => ({
        ...category,
        documents: category.documents.filter(doc => 
          doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      })).filter(category => category.documents.length > 0)
    : knowledgeCategories;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-primary-900 mb-3">
          {t('knowledgeBase')}
        </h3>
        
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchKnowledgeBase')}
            className="input pr-10"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {selectedDocument ? (
          <div className="p-4">
            <button 
              onClick={closeDocument}
              className="flex items-center text-primary-600 mb-4"
            >
              <X className="h-4 w-4 mr-1" />
              {t('close')}
            </button>
            
            <h4 className="text-lg font-medium text-primary-900 mb-3">
              {selectedDocument.title}
            </h4>
            
            <div className="prose text-gray-700">
              {selectedDocument.content}
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedDocument.tags.map(tag => (
                <span 
                  key={tag} 
                  className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <>
            {filteredCategories.length > 0 ? (
              <div className="p-4 space-y-2">
                {filteredCategories.map(category => (
                  <div key={category.id} className="border border-gray-200 rounded-md overflow-hidden">
                    <button
                      className="flex items-center justify-between w-full p-3 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                      onClick={() => toggleCategory(category.id)}
                    >
                      <span className="font-medium text-primary-800">{category.title}</span>
                      {expandedCategory === category.id ? (
                        <ChevronDown className="h-5 w-5 text-primary-600" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-primary-600" />
                      )}
                    </button>
                    
                    <AnimatePresence>
                      {expandedCategory === category.id && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="p-2 space-y-1">
                            {category.documents.map(doc => (
                              <button
                                key={doc.id}
                                className="flex items-center w-full p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded"
                                onClick={() => viewDocument(doc)}
                              >
                                <FileText className="h-4 w-4 mr-2 text-primary-600" />
                                <span className="line-clamp-1">{doc.title}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <Bookmark className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500">
                  {searchQuery ? t('noSearchResults') : t('selectDocument')}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default KnowledgePanel;