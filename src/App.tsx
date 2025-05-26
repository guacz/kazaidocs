import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ConsultationPage from './pages/ConsultationPage';
import DocumentFillerPage from './pages/DocumentFillerPage';
import FaqPage from './pages/FaqPage';
import LegalInfoPage from './pages/LegalInfoPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="consultation" element={<ConsultationPage />} />
        <Route path="documents" element={<DocumentFillerPage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="legal" element={<LegalInfoPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;