import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TokensScreen.module.css';

// Import images
import ethereumIcon from '../assets/images/ethereum_icon.png';
import walletImage from '../assets/images/wallet.png';
import allowImage from '../assets/images/allow.png';
import { useMPCStore } from '../hooks/useMPCStore';
import { ethers } from 'ethers';

const tokens = [
  { name: 'Ethereum', symbol: 'ETH', balance: '1.25', icon: ethereumIcon },
];

const TokensScreen = () => {
  const { address } = useMPCStore();
  const navigate = useNavigate();
  const RPC_URL = "http://61.74.32.229:8545"; // 여기에 RPC URL을 입력하세요.
  const chainId = 1337;
  const [balance, setBalance] = useState("0");
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const primaryColor = '#0055FF'; // Hardcoded from theme

  useEffect(() => {
    const setting = async() => {
      let balance = await provider.getBalance(address);
      setBalance(ethers.formatEther(balance).toString());
    }

    setting();
  }, [])

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>토큰</h2>
      <div className={styles.walletInfoContainer}>
        <img
          src={walletImage}
          alt="Wallet"
          className={styles.walletImage}
        />
        <p className={styles.walletAddress}>{address}</p>
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
              <span className={styles.balanceAmount}>{balance}</span>
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