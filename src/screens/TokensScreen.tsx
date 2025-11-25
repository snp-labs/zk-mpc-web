import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TokensScreen.module.css';

// Import images
import ethereumIcon from '../assets/images/ethereum_icon.png';
import walletImage from '../assets/images/wallet.png';
import allowImage from '../assets/images/allow.png';

const tokens = [
  { name: 'Ethereum', symbol: 'ETH', balance: '1.25', icon: ethereumIcon },
];

const TokensScreen = () => {
  const navigate = useNavigate();
  const walletAddress = '0x1234...5678'; // Placeholder for wallet address
  const primaryColor = '#0055FF'; // Hardcoded from theme

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>토큰</h2>
      <div className={styles.walletInfoContainer}>
        <img
          src={walletImage}
          alt="Wallet"
          className={styles.walletImage}
        />
        <p className={styles.walletAddress}>{walletAddress}</p>
      </div>
      <button
        className={styles.addTokenButton}
        onClick={() => console.log('Add Token')}
      >
        + Token
      </button>
      {tokens.map(token => (
        <div key={token.symbol} className={styles.card}>
          <div className={styles.cardTopRow}>
            <img src={token.icon} alt={`${token.name} icon`} className={styles.tokenIcon} />
            <p className={styles.tokenName}>{token.name}</p>
          </div>
          <div className={styles.cardBottomRow}>
            <p className={styles.balanceText}>
              {"잔액     "}
              <span className={styles.balanceAmount}>{token.balance}</span>
              {` ${token.symbol}`}
            </p>
            <div
              className={styles.sendButtonContainer}
              onClick={() => navigate('/send', { state: { token } })}
            >
              <div className={styles.iconButtonWrapper} style={{ backgroundColor: primaryColor }}>
                <img src={allowImage} alt="Send" style={{ width: 12, height: 12 }} />
              </div>
              <p className={styles.sendButtonText} style={{ color: primaryColor }}>보내기</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TokensScreen;