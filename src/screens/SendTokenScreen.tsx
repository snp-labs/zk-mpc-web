import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './SendTokenScreen.module.css';

import LeftArrowIcon from '../assets/icons/LeftArrowIcon';
import walletImage from '../assets/images/wallet.png';
import { requestTransaction } from '../api/TransactionApi';
import { useMPCStore } from '../hooks/useMPCStore';
import { useWebSocket } from '../hooks/useWebSocket';
import { isProtocolCompleteMessage, ProtocolCompleteMessage } from '../types/Messages';
import { ParticipantType } from '../types/ParticipantType';
import { ethers, Transaction } from 'ethers';

// Define a type for the token for clarity
interface Token {
  name: string;
  symbol: string;
  balance: string;
  icon: string;
}

const SendTokenScreen = () => {
  const { lastMessage, sendMessage} = useWebSocket('http://localhost:8080/ws');
  const { userId, auxInfo, tshare, presign, address, pk, setAuxInfo, setTShare, setPresign } = useMPCStore();
  const RPC_URL = "http://61.74.32.229:8545"; // 여기에 RPC URL을 입력하세요.
  const chainId = 1337;
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const navigate = useNavigate();
  const location = useLocation();
  const [balance, setBalance] = useState("0");
  const [hash, setHash] = useState("");

  useEffect(() => {
    const setting = async() => {
      let balance = await provider.getBalance(address);
      setBalance(ethers.formatEther(balance).toString());
    }

    setting();
  }, [])
  

  // Fallback for token if state is not passed
  const token: Token = location.state?.token || {
    name: 'Unknown',
    symbol: '???',
    balance: '0',
    icon: ''
  };

  const [recipient, setRecipient] = React.useState('');
  const [amount, setAmount] = React.useState('');

  useEffect(() => {
    if(lastMessage != null) {
      generateSignature(lastMessage); 
    }
  }, [lastMessage])

  const handleSendToken = async() => {
    const tx = await signTransaction();
    await requestTransaction(address, recipient, Number(amount), tx);
  }

  const signTransaction = async() => {
    const nonce = await provider.getTransactionCount(address, "latest");
    
    const txData = {
      nonce: nonce,
      gasPrice: "20000000000",
      gasLimit: "21000",
      to: recipient,
      value: amount,
      data: "0x",
      chainId: chainId
    };

    const tx = Transaction.from(txData);

    // --- 3. 서명 대상이 될 올바른 RLP 데이터 생성 (EIP-155) ---
    const unsignedTxRLP = tx.unsignedSerialized;
    console.log("RLP Encoded Transaction for Hashing:", unsignedTxRLP);

    const unsignedTxBytes = ethers.getBytes(unsignedTxRLP);

    const unsignedTxBase64 = ethers.encodeBase64(unsignedTxBytes);
    const transactionHash = ethers.keccak256(unsignedTxRLP);
    console.log("Transaction Hash (Message to sign):", transactionHash);

    setHash(transactionHash);
    return unsignedTxBase64;
  }

  const generateSignature = async(message: any) => {
    const nonce = await provider.getTransactionCount(address, "latest");

    const txData = {
      nonce: nonce,
      gasPrice: "20000000000",
      gasLimit: "21000",
      to: recipient,
      value: amount,
      data: "0x",
      chainId: chainId
    };

    let signature;

    console.log("r: " + message.r);
    console.log("s: " + message.s);

    for(let i = 0; i <= 1; i++) {
        const v = chainId * 2 + 35 + i;
        const tempSig = {
            r: "0x" + message.r,
            s: "0x" + message.s,
            v: v
        };
        let recoveredPublicKey;
        try {
            recoveredPublicKey = ethers.SigningKey.recoverPublicKey(hash, tempSig);
        } catch (e) {
            console.error("공개 키 복구 실패:", e);
            recoveredPublicKey = null;
        }

        if (recoveredPublicKey && recoveredPublicKey.toLowerCase() === pk.toLowerCase()) {
            signature = tempSig;
            break;
        }
    }

    if (!signature) {
        console.log("\n--- Signature Verification FAILED. Aborting. ---");
        throw new Error("Signature verification failed");
    }

    const signedTx = Transaction.from({...txData, signature});
    const signedMessage = signedTx.serialized;

    sendTx(signedMessage);
  }

  const sendTx = async(signedMessage: string) =>  {
    try {
        const balanceBeforeFrom = await provider.getBalance(address);
        const balanceBeforeTo = await provider.getBalance(recipient);
        console.log("Sender balance before:", ethers.formatEther(balanceBeforeFrom), "ETH");
        console.log("Receiver balance before:", ethers.formatEther(balanceBeforeTo), "ETH");

        console.log("\nSending transaction...");
        const txResponse = await provider.broadcastTransaction(signedMessage);

        console.log("Transaction successful! Hash:", txResponse.hash);
        
        await txResponse.wait(1);
        console.log("Transaction mined!");

        const balanceAfterFrom = await provider.getBalance(address);
        const balanceAfterTo = await provider.getBalance(recipient);
        console.log("\nSender balance after:", ethers.formatEther(balanceAfterFrom), "ETH");
        console.log("Receiver balance after:", ethers.formatEther(balanceAfterTo), "ETH");

    } catch (error: any) {
        console.error("Transaction failed:", error.message);
        if (error.data) console.error("RPC Error Data:", error.data);
    }
}

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
          <p className={styles.walletAddress}>{address}</p>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTopRow}>
            <img src={token.icon} alt={`${token.name} icon`} className={styles.tokenIcon} />
            <p className={styles.tokenName}>{token.name}</p>
          </div>
          <div className={styles.cardBottomRow}>
            <p className={styles.balanceText}>
              {"출금가능     "}
              <span className={styles.balanceAmount}>{balance}</span>
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
          onClick={handleSendToken}
        >
          보내기
        </button>
      </div>
    </div>
  );
};

export default SendTokenScreen;
