import React, { ReactNode } from 'react';
import Header from '../components/Header';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;