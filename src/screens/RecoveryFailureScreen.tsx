import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RecoveryFailureScreen.module.css';

const RecoveryFailureScreen = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/more'); 
  };

  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>&#10006;</div> {/* Large Red 'X' */}
      <h2 className={styles.mainMessage}>키 복구 실패</h2> {/* Main Message */}
      <p className={styles.detailMessage}>키 복구가 실패되었습니다.</p> {/* Detail Message */}
      <button className={styles.actionButton} onClick={handleClose}>
        닫기 {/* Action Button */}
      </button>
    </div>
  );
};

export default RecoveryFailureScreen;