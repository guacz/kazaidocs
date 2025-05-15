import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AuthModal from '../auth/AuthModal';
import { useAuth } from '../../contexts/AuthContext';

const Layout: React.FC = () => {
  const { isModalOpen } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      {isModalOpen && <AuthModal />}
    </div>
  );
};

export default Layout;