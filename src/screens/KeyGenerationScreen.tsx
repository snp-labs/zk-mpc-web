import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './KeyGenerationScreen.module.css';

const KeyGenerationScreen = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <p>Key Generation Screen</p>
      <button
        onClick={() => navigate('/main')}
      >
        Go to Main
      </button>
    </div>
  );
};

export default KeyGenerationScreen;