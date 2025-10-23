import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.appHeader}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>DataViz</div>
        <div className={styles.navLinks}>
          <a href="#" className={styles.active}>Dashboard</a>
          <a href="#">Reports</a>
          <a href="#">Settings</a>
        </div>
      </nav>
    </header>
  );
};

export default Header;