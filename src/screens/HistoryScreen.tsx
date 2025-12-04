import React from 'react';
import styles from './HistoryScreen.module.css';

const mockTransactions = [
  { id: '1', type: 'sent', amount: '0.5 ETH', to: '0x123...', date: '2025-10-24' },
  { id: '2', type: 'received', amount: '1.0 ETH', from: '0x456...', date: '2025-10-23' },
  { id: '3', type: 'sent', amount: '0.1 BTC', to: 'bc1q...', date: '2025-10-22' },
];

const HistoryScreen = () => {
  const renderItem = (item: typeof mockTransactions[0]) => {
    const isSent = item.type === 'sent';
    const transactionType = isSent ? '보냄' : '받음';
    const addressInfo = isSent ? `수신: ${item.to}` : `발신: ${item.from}`;
    
    // 아이콘: Sent는 위로(↑), Received는 아래로(↓)
    const iconSymbol = isSent ? '↑' : '↓'; 

    return (
      <div key={item.id} className={styles.listItem}>
        <div className={styles.icon}>
          {iconSymbol}
        </div>
        <div className={styles.content}>
          <p className={styles.title}>{`${transactionType} ${item.amount}`}</p>
          <p className={styles.description}>{addressInfo}</p>
        </div>
        <p className={styles.date}>{item.date}</p>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentArea}>
        <h2 className={styles.header}>거래 내역</h2>
        <div className={styles.listWrapper}>
          {mockTransactions.map(renderItem)}
        </div>
      </div>
    </div>
  );
};

export default HistoryScreen;