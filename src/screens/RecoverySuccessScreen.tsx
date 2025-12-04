import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RecoverySuccessScreen.module.css';

const RecoverySuccessScreen = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/more'); // Navigate back to the More screen
  };

  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>&#10004;</div> {/* Large Green Check Mark */}
      <h2 className={styles.mainMessage}>키 복구 완료</h2> {/* Main Message */}
      <p className={styles.detailMessage}>지갑 키 복구가 완료되었습니다.</p> {/* Detail Message */}
      <button className={styles.actionButton} onClick={handleClose}>
        닫기 {/* Action Button */}
      </button>
    </div>
  );
};

export default RecoverySuccessScreen;