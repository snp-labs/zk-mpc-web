import React from 'react';
import styles from './HistoryScreen.module.css';

const mockTransactions = [
  { id: '1', type: 'sent', amount: '0.5 ETH', to: '0x123...', date: '2025-10-24' },
  { id: '2', type: 'received', amount: '1.0 ETH', from: '0x456...', date: '2025-10-23' },
  { id: '3', type: 'sent', amount: '0.1 BTC', to: 'bc1q...', date: '2025-10-22' },
];

const HistoryScreen = () => {
  const renderItem = (item: typeof mockTransactions[0]) => (
    <div key={item.id} className={styles.listItem}>
      <div className={styles.icon}>
        {item.type === 'sent' ? '↑' : '↓'}
      </div>
      <div className={styles.content}>
        <p className={styles.title}>{`${item.type === 'sent' ? 'Sent' : 'Received'} ${item.amount}`}</p>
        <p className={styles.description}>{item.type === 'sent' ? `To: ${item.to}` : `From: ${item.from}`}</p>
      </div>
      <p className={styles.date}>{item.date}</p>
    </div>
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Transaction History</h2>
      <div>
        {mockTransactions.map(renderItem)}
      </div>
    </div>
  );
};

export default HistoryScreen;