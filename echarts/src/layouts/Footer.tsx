import { useEffect, useState } from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className={styles.appFooter}>
      <p>&copy; {currentYear} DataViz Inc. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;