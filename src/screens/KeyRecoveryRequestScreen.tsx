import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './KeyRecoveryRequestScreen.module.css';
import { recoverKey, requestEmailVerification, verifyMember } from '../api/userApi';
import { useMPCStore } from '../hooks/useMPCStore';

const KeyRecoveryRequestScreen = () => {
  const navigate = useNavigate();
  const { userId, auxInfo, tshare, presign, setAuxInfo, setTShare, setPresign, setAddress, setPk } = useMPCStore();
  
  // 사용자 정보 상태
  const [email, setEmail] = useState('');

  // 인증 관련 상태
  const [authCode, setAuthCode] = useState(''); 
  const [isVerificationRequested, setIsVerificationRequested] = useState(false);
  const [IsVerified, setIsVerified] = useState(false);
  

  const handleRequestEmail = async () => {
    if (!email.trim()) {
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

  const handleRequestVerification = async () => {
    if (!authCode.trim()) {
      alert('인증번호를 입력해주세요.');
      return;
    }
    try {
      const response = await verifyMember(email, authCode);
      useMPCStore.getState().setUserId(response.memberId);
      setIsVerified(true);
      alert('인증되었습니다.');
    } catch (error) {
      console.error('verification request failed:', error);
      alert('전송에 실패했습니다.');
    }
  };

  const handleRecover = async () => {
    await recoverKey(userId);
  }

  const handleRequestKeyRecovery = () => {
    console.log('Requesting key recovery for:', { email });
    navigate('/more/user-authentication');
  };

  const isFinalButtonDisabled = !email.trim() || !IsVerified;

  return (

    <div className={styles.outerContainer}>
      <div className={styles.container}>

        {/* 헤더 섹션 */}
        <h2 className={styles.headerTitle}>지갑 키 복구</h2>
        <p className={styles.instructionText}>키 복구에 필요한 정보를 입력해주세요</p>

        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>사용자 정보 입력</h3>
          
          <div className={styles.inputRow}>
            <div className={styles.inputContainer}>
              <label className={styles.inputLabel} htmlFor="email-input">이메일 입력</label>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                // placeholder="이메일주소를 입력하세요"
                disabled={isVerificationRequested} 
              />
            </div>
            <button
              className={styles.authButton}
              onClick={handleRequestEmail}
              disabled={!email.trim() || isVerificationRequested}
            >
              전송
            </button>
          </div>

          {isVerificationRequested && (
            <div className={styles.inputRow}>
              <div className={styles.inputContainer}>
                <label className={styles.inputLabel} htmlFor="auth-input">인증번호(PIN) 입력</label>
                <input
                  id="auth-input"
                  type="text"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  className={styles.input}
                  // placeholder="인증번호(PIN)를 입력하세요"
                  disabled={IsVerified} 
                />
              </div>
              <button
                className={styles.authButton}
                onClick={handleRequestVerification}
                disabled={!authCode.trim() || IsVerified}
              >
                인증
              </button>
            </div>
          )}
          
        </div>

        <div className={styles.primaryButton}>
        <button
          className={styles.primaryButtonInner}
          onClick={handleRecover}
          disabled={isFinalButtonDisabled}
        >
          키 복구 요청
        </button>
        </div>
      </div>
    </div>
  );
};

export default KeyRecoveryRequestScreen;