import React from 'react';
import Header from './Header';
import Footer from './Footer';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main className={styles.mainContent}>{children}</main>
      <Footer />
    </>
  );
};

export default MainLayout;