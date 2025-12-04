import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TokensScreen.module.css';
import ethereumIcon from '../assets/images/ethereum_icon.png';
import walletImage from '../assets/images/wallet.png';
import allowImage from '../assets/images/allow.png';
import { useMPCStore } from '../hooks/useMPCStore';
import { ethers } from 'ethers';
import TokenCard from '../components/TokenCard';


const tokens = [
  { name: 'Ethereum', symbol: 'ETH', balance: '1.25', icon: ethereumIcon },
];


const TokensScreen = () => {
  const { address } = useMPCStore();
  const navigate = useNavigate();
  const RPC_URL = "http://61.74.32.229:8545";
  const chainId = 1337;
  const [balance, setBalance] = useState("0");
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  useEffect(() => {
    const setting = async() => {
      if (address) {
        try {
          let balance = await provider.getBalance(address);
          setBalance(ethers.formatEther(balance).toString());
        } catch (error) {
          console.error("Failed to fetch balance:", error);
          setBalance("Error");
        }
      }
    }
    setting();
  }, [address])

  return (
    <div className={styles.container}>
      <div className={styles.contentArea}>
        
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
          <TokenCard
            key={token.symbol}
            token={token}
            balance={balance}
            navigate={navigate}
            allowImage={allowImage} // 이미지 경로를 props로 전달
          />
        ))}
      </div>
    </div>
  );
};

export default TokensScreen;