import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserAuthenticationScreen.module.css';
import { requestEmailVerification, registerMember } from '../api/userApi';
import { useMPCStore } from '../hooks/useMPCStore';

const UserAuthenticationScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerificationRequested, setIsVerificationRequested] = useState(false);

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
      const response = await registerMember(email, authCode);
      console.log('Registration successful:', response);
      useMPCStore.getState().setUserId(response.memberId);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Registration failed:', error);
      alert('인증에 실패했습니다.');
    }
  };

  return (
    <div className={styles.outerContainer}>
      <div className={styles.container}>
        <h2 className={styles.header}>
          사용자 인증
        </h2>
        <p className={styles.subHeader}>
          지갑 생성에 필요한 정보를 입력해주세요.
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
          onClick={() => navigate('/create-wallet')}
          disabled={!isAuthenticated}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default UserAuthenticationScreen;