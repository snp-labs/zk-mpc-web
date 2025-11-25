import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserAuthenticationScreen.module.css';

const UserAuthenticationScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
          <button className={styles.button}>
            전송
          </button>
        </div>

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
          <button className={styles.button} onClick={() => setIsAuthenticated(true)}>
            인증
          </button>
        </div>

        {isAuthenticated && (
          <p className={styles.authMessage}>인증 되었습니다.</p>
        )}
      </div>

      <div className={styles.buttonContainer}>
        <button
          className={styles.nextButton}
          onClick={() => navigate('/create-wallet')}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default UserAuthenticationScreen;