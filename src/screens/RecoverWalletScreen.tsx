import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RecoverWalletScreen.module.css';
import { requestEmailVerification, registerMember, verifyMember, recoverKey } from '../api/userApi';
import { useMPCStore } from '../hooks/useMPCStore';
import { useWebSocket } from '../hooks/useWebSocket';
import { isProtocolCompleteMessage, ProtocolCompleteMessage } from '../types/Messages';
import { ParticipantType } from '../types/ParticipantType';

const RecoverWalletScreen = () => {
  const { lastMessage, sendMessage} = useWebSocket('http://localhost:8080/ws');
  const { userId, auxInfo, tshare, presign, setAuxInfo, setTShare, setPresign, setAddress, setPk } = useMPCStore();
  const navigate = useNavigate();
  const workerRef = useRef<Worker | null>(null);
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerificationRequested, setIsVerificationRequested] = useState(false);

  useEffect(() => {
    const worker = new Worker(new URL('../core/protocolExecutor.worker.ts', import.meta.url));
    workerRef.current = worker;
    console.log("Worker Created (Initial Only)");

    return () => {
      console.log("Worker Terminated");
      worker.terminate();
    };
  }, []); 

  useEffect(() => {
    if (!workerRef.current) return;

    workerRef.current.onmessage = (e: MessageEvent) => {
      const { type, payload } = e.data;
      
      if (type === 'sendMessage') {
        const [destination, message] = payload;
        
        const parsedMessage = JSON.parse(message);
        if (isProtocolCompleteMessage(parsedMessage)) {
            const completeMessage = parsedMessage as ProtocolCompleteMessage;
            if(completeMessage.type === ParticipantType.TRECOVERTARGET) {
                navigate('/main/tokens');
            }
        }

        const { kind, ...dataToSend } = parsedMessage;
        sendMessage(destination, JSON.stringify(dataToSend)); 
      } else if (type === 'saveToStore') {
        const { key, value } = payload;
        if (key === 'auxInfo') setAuxInfo(value);
        else if (key === 'tShare') setTShare(value);
        else if (key === 'address') setAddress(value);
        else if (key === 'pk') setPk(value);
        else if (key === 'presign') setPresign(value);
      }
    };
  }, [navigate, sendMessage, setAuxInfo, setTShare, setPresign, setAddress, setPk]); // 의존성 배열 유지

  const storeStateRef = useRef({ userId, auxInfo, tshare, presign });
  useEffect(() => {
    storeStateRef.current = { userId, auxInfo, tshare, presign };
  }, [userId, auxInfo, tshare, presign]);

  useEffect(() => {
    if (lastMessage && workerRef.current) {
        workerRef.current.postMessage({ lastMessage, storeState: storeStateRef.current });
    }
  }, [lastMessage]); 

  const handleRequestVerification = async () => {
    if (!email) {
      alert('이메일을 입력해주세요.');
      return;
    }
    try {
      await requestEmailVerification(email);
      setIsVerificationRequested(true);
      alert('인증 이메일이 전송되었습니다.');
    } catch (error) {
      console.error('Email verification request failed:', error);
      alert('이메일 전송에 실패했습니다.');
    }
  };

  const handleRegister = async () => {
    if (!authCode) {
      alert('인증번호를 입력해주세요.');
      return;
    }
    try {
      // NOTE: This should be a login or recovery function, not register
      const response = await verifyMember(email, authCode);
      console.log('Authentication successful:', response);
      useMPCStore.getState().setUserId(response.memberId);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Authentication failed:', error);
      alert('인증에 실패했습니다.');
    }
  };

  const handleRecover = async () => {
    await recoverKey(userId);
  }


  return (
    <div className={styles.outerContainer}>
      <div className={styles.container}>
        <h2 className={styles.header}>
          지갑 복구
        </h2>
        <p className={styles.subHeader}>
          지갑 복구에 필요한 정보를 입력해주세요.
        </p>

        <div className={styles.inputRow}>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel} htmlFor="email-input">이메일주소를 입력하세요.</label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
          </div>
          <button className={styles.button} onClick={handleRequestVerification}>
            전송
          </button>
        </div>

        {isVerificationRequested && (
          <div className={styles.inputRow}>
            <div className={styles.inputContainer}>
              <label className={styles.inputLabel} htmlFor="auth-code-input">인증번호(PIN)을 입력하세요</label>
              <input
                id="auth-code-input"
                type="text"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                className={styles.input}
              />
            </div>
            <button className={styles.button} onClick={handleRegister}>
              인증
            </button>
          </div>
        )}

        {isAuthenticated && (
          <p className={styles.authMessage}>인증 되었습니다.</p>
        )}
      </div>

      <div className={styles.buttonContainer}>
        <button
          className={styles.nextButton}
          onClick={handleRecover}
          disabled={!isAuthenticated}
        >
          복구
        </button>
      </div>
    </div>
  );
};

export default RecoverWalletScreen;
