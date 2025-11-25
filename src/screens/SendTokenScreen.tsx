import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './SendTokenScreen.module.css';

import LeftArrowIcon from '../assets/icons/LeftArrowIcon';
import walletImage from '../assets/images/wallet.png';

// Define a type for the token for clarity
interface Token {
  name: string;
  symbol: string;
  balance: string;
  icon: string;
}

const SendTokenScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Fallback for token if state is not passed
  const token: Token = location.state?.token || {
    name: 'Unknown',
    symbol: '???',
    balance: '0',
    icon: ''
  };

  const [recipient, setRecipient] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const walletAddress = '0x1234...5678'; // Placeholder

  return (
    <div className={styles.outerContainer}>
      <div className={styles.container}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <LeftArrowIcon color="#222B3D" size={16} />
        </button>
        <div className={styles.walletInfoContainer}>
          <img
            src={walletImage}
            alt="Wallet"
            className={styles.walletImage}
          />
          <p className={styles.walletAddress}>{walletAddress}</p>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTopRow}>
            <img src={token.icon} alt={`${token.name} icon`} className={styles.tokenIcon} />
            <p className={styles.tokenName}>{token.name}</p>
          </div>
          <div className={styles.cardBottomRow}>
            <p className={styles.balanceText}>
              {"출금가능     "}
              <span className={styles.balanceAmount}>{token.balance}</span>
              {` ${token.symbol}`}
            </p>
          </div>
        </div>

        <h3 className={styles.title}>얼마를 보내시겠어요?</h3>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={styles.input}
        />

        <h3 className={styles.title}>어디로 보내시겠어요?</h3>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className={styles.input}
        />
        <div style={{ height: 100 }} />
      </div>
      <div className={styles.buttonContainer}>
        <button
          className={styles.nextButton}
          onClick={() => console.log(`Send ${amount} ${token.symbol} to ${recipient}`)}
        >
          보내기
        </button>
      </div>
    </div>
  );
};

export default SendTokenScreen;
