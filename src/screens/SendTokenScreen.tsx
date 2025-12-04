import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './SendTokenScreen.module.css';

import LeftArrowIcon from '../assets/icons/LeftArrowIcon';
import walletImage from '../assets/images/wallet.png';
import { requestTransaction } from '../api/TransactionApi';
import { useMPCStore } from '../hooks/useMPCStore';
import { useWebSocket } from '../hooks/useWebSocket';
import { ethers, Transaction } from 'ethers';
import TokenCard from '../components/TokenCard';

// Define a type for the token for clarity
interface Token {
  name: string;
  symbol: string;
  balance: string;
  icon: string;
}

const SendTokenScreen = () => {
  const { lastMessage, sendMessage} = useWebSocket('http://localhost:8080/ws');
  const { address, pk } = useMPCStore();
  const RPC_URL = "http://61.74.32.229:8545"; // 여기에 RPC URL을 입력하세요.
  const chainId = 1337;
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const navigate = useNavigate();
  const location = useLocation();
  const [balance, setBalance] = useState("0");

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

  // 상태 관리: hash뿐만 아니라 서명 요청 시 사용한 원본 txData도 저장해야 함
  const [currentHash, setCurrentHash] = useState<string | null>(null);
  const [pendingTxParams, setPendingTxParams] = useState<any>(null);

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const setting = async() => {
      try {
        let bal = await provider.getBalance(address);
        setBalance(ethers.formatEther(bal).toString());
      } catch(e) { console.error(e); }
    }
    setting();
  }, [address]); // address 의존성 추가


  useEffect(() => {
    // 메시지가 왔고, 검증할 해시가 준비되어 있을 때만 실행
    if(lastMessage != null && currentHash != null && pendingTxParams != null) {
      generateSignature(lastMessage); 
    }
  }, [lastMessage, currentHash, pendingTxParams]); // 의존성 배열 업데이트

  const handleSendToken = async() => {
    try {
        const txPayload = await prepareTransaction(); // 이름 변경: sign -> prepare
        if(txPayload) {
            await requestTransaction(address, recipient, Number(amount), txPayload);
        }
    } catch (e) {
        console.error("Transaction Preparation Failed:", e);
    }
  }

  // 트랜잭션 준비 및 해시 생성 (보내기 버튼 클릭 시 1회 실행)
  const prepareTransaction = async() => {
    console.log("pk: " + pk);
    console.log("address: " + address);
    const nonce = await provider.getTransactionCount(address, "latest");
    
    // 이 txData를 State에 저장해두고 나중에 재사용해야 함 (Nonce 불일치 방지)
    const txData = {
      nonce: nonce,
      gasPrice: "20000000000",
      gasLimit: "21000",
      to: recipient,
      value: ethers.parseEther(amount), // 입력값은 보통 Ether 단위이므로 변환 필요 (필요시 확인)
      data: "0x",
      chainId: chainId
    };

    // ethers v6 Transaction 객체 생성
    const tx = Transaction.from(txData);
    
    // 서명할 메시지(RLP)와 해시 생성
    const unsignedTxRLP = tx.unsignedSerialized;
    const transactionHash = ethers.keccak256(unsignedTxRLP);
    const unsignedTxBytes = ethers.getBytes(unsignedTxRLP);
    const unsignedTxBase64 = ethers.encodeBase64(unsignedTxBytes);

    console.log("Generated Hash:", transactionHash);

    // State 업데이트
    setCurrentHash(transactionHash);
    setPendingTxParams(txData); // Nonce가 포함된 원본 데이터 저장

    return unsignedTxBase64;
  }

  const generateSignature = async(message: any) => {
    // 방어 코드: 해시가 없으면 진행 불가
    if (!currentHash || !pendingTxParams) {
        console.error("No pending transaction hash found.");
        return;
    }


    console.log("current hash: ", currentHash);

    let signature;
    console.log("Verifying Signature...");
    console.log("Target Hash:", currentHash);
    console.log("Received r:", message.r);
    console.log("Received s:", message.s);

    // EIP-155 v 값 복구 시도 (0 또는 1 반복)
    for(let i = 0; i <= 3; i++) {
        const v = chainId * 2 + 35 + i;
        const tempSig = {
            r: "0x" + message.r,
            s: "0x" + message.s,
            v: v
        };
        
        let recoveredPublicKey;
        try {
            // 저장해둔 currentHash를 사용하여 복구 시도
            recoveredPublicKey = ethers.SigningKey.recoverPublicKey(currentHash, tempSig);
        } catch (e) {
            recoveredPublicKey = null;
        }

        console.log("recoveredPublicKey : " + recoveredPublicKey);

        // 압축/비압축 키 형식이 다를 수 있으므로 소문자로 변환하여 비교
        if (recoveredPublicKey && pk && recoveredPublicKey.toLowerCase() === pk.toLowerCase()) {
            signature = tempSig;
            console.log("Signature Verified! v is:", v);
            break;
        }
    }

    if (!signature) {
        console.log("\n--- Signature Verification FAILED. ---");
        console.log("Expected PK:", pk);
        // 여기서 에러를 던지지 않고 리턴하거나, 사용자에게 알림을 줄 수 있습니다.
        return;
    }

    // 성공 시: 저장해둔 pendingTxParams(동일한 Nonce)를 사용하여 서명 결합
    try {
        const signedTx = Transaction.from({...pendingTxParams, signature});
        const signedMessage = signedTx.serialized;
        await sendTx(signedMessage);
    } catch (error) {
        console.error("Error constructing signed tx:", error);
    }
  }

  const sendTx = async(signedMessage: string) =>  {
    try {
        console.log("\nSending transaction...");
        const txResponse = await provider.broadcastTransaction(signedMessage);
        console.log("Transaction successful! Hash:", txResponse.hash);
        
        await txResponse.wait(1);
        console.log("Transaction mined!");
        
        // 잔액 갱신 등 후처리
        const newBal = await provider.getBalance(address);
        setBalance(ethers.formatEther(newBal).toString());
        
        // 성공 후 초기화 (선택사항)
        setCurrentHash(null);
        setPendingTxParams(null);
        alert("전송 완료!");
        navigate(-1); // 뒤로 가기

    } catch (error: any) {
        console.error("Transaction broadcast failed:", error.message);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentArea}>
        <div className={styles.header}>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            <LeftArrowIcon color="#222B3D" size={16} />
          </button>
        </div>
        
        <div className={styles.walletInfoContainer}>
          <img
            src={walletImage}
            alt="Wallet"
            className={styles.walletImage}
          />
          <p className={styles.walletAddress}>{address}</p>
        </div>
        
        <>
          <TokenCard
            key={token.symbol}
            token={token}
            balance={balance}
            navigate={navigate}
            allowImage={false}
          />
        </>

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
        <div style={{ height: '80px' }} /> 
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