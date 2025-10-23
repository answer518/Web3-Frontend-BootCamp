import LineTVL from '@/pages/LineTVL';
import BarDEX from '@/pages/BarDEX';
import PieHolders from '@/pages/PieHolders';
import KlineToken from '@/pages/KlineToken';
import styles from './index.module.css';

const Dashboard = () => {
  return (
    <div className={styles.gridContainer}>
      <div className={styles.gridItem}>
        <div className={styles.chartHeader}>
          <h2 className={styles.chartTitle}>DeFi Lending TVL</h2>
        </div>
        <LineTVL />
      </div>
      <div className={styles.gridItem}>
        <div className={styles.chartHeader}>
          <h2 className={styles.chartTitle}>DEX Trading Volume</h2>
        </div>
        <BarDEX />
      </div>
      <div className={styles.gridItem}>
        <div className={styles.chartHeader}>
          <h2 className={styles.chartTitle}>Token Holder Distribution</h2>
        </div>
        <PieHolders />
      </div>
      <div className={styles.gridItem}>
        <div className={styles.chartHeader}>
          <h2 className={styles.chartTitle}>Token Price (Candlestick)</h2>
        </div>
        <KlineToken />
      </div>
    </div>
  );
};

export default Dashboard;