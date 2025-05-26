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
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PricingPage from './pages/PricingPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentCanceledPage from './pages/PaymentCanceledPage';
import SubscriptionBanner from './components/subscription/SubscriptionBanner';

function App() {
  return (
    <>
      <SubscriptionBanner />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="consultation" element={<ConsultationPage />} />
          <Route path="documents" element={<DocumentFillerPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="legal" element={<LegalInfoPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="payment/success" element={<PaymentSuccessPage />} />
          <Route path="payment/canceled" element={<PaymentCanceledPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;