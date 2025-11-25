import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './WelcomeScreen.module.css';
import welcomeImage from '../assets/images/welcome_image.png';

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const primaryColor = '#0055FF'; // Hardcoded from theme

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>
          {"모든 디지털 자산을\n안전하게 관리하세요"}
        </h2>
        <div className={styles.subtitleContainer}>
          <p className={styles.subtitle}>
            <span style={{ color: primaryColor }}>MPC 기반 새 지갑</span>
            을 생성하거나
          </p>
          <p className={styles.subtitle}>
            기존 지갑을 복구합니다.
          </p>
        </div>
        <img
          src={welcomeImage}
          alt="Welcome"
          className={styles.image}
        />
      </div>
      <div className={styles.buttonContainer}>
        <button
          className={`${styles.button} ${styles.buttonContained}`}
          onClick={() => navigate('/auth')}
        >
          새 지갑 만들기
        </button>
        <button
          className={`${styles.button} ${styles.buttonOutlined}`}
          style={{ marginTop: 12 }}
          onClick={() => navigate('/recover-wallet')}
        >
          기존 지갑 복구하기
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;