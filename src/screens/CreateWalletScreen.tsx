import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreateWalletScreen.module.css';
import {delegate_process_message, ready_message_factory, participant_factory} from '../wasm/pkg/threshold_ecdsa';
import { DelegateOutput, isContinue, isDone } from '../types/Messages';

const CreateWalletScreen = () => {
  const navigate = useNavigate();

  const [admins, setAdmins] = useState([
    { id: 1, name: '사용자', editable: false },
    { id: 2, name: '자체 보관소 1', editable: true },
    { id: 3, name: '자체 보관소 2', editable: true },
  ]);

  const keyShares = admins.length;
  const threshold = keyShares > 1 ? keyShares - 1 : 1;

  const handleAdminNameChange = (text: string, id: number) => {
    setAdmins(
      admins.map(admin => (admin.id === id ? { ...admin, name: text } : admin))
    );
  };

  const addAdmin = () => {
    const newId = admins.length > 0 ? Math.max(...admins.map(a => a.id)) + 1 : 1;
    setAdmins([...admins, { id: newId, name: `Enterprise ${newId - 3}`, editable: true }]);
  };

  const removeAdmin = (id: number) => {
    setAdmins(admins.filter(admin => admin.id !== id));
  };

  const handleCreateWallet = () => {
    const participant_type = "AuxInfo";
    const sid = BigInt(Date.now());
    const my_id = BigInt(admins[0].id);
    const other_participant_ids = new BigUint64Array(admins.slice(1).map(a => BigInt(a.id)));
    const input = JSON.stringify({});

    participant_factory(participant_type, sid, my_id, other_participant_ids, input);
    const message: string = ready_message_factory(participant_type, sid, my_id);
    const result: string = delegate_process_message(participant_type, message);
    const parsedMessage: DelegateOutput = JSON.parse(result);

    console.log("Received parsed message:", parsedMessage);

    if (isContinue(parsedMessage)) {
      console.log("Status: CONTINUE");
      if (parsedMessage.Continue.length > 0) {
        console.log("Continue Messages:", parsedMessage.Continue);
        console.log("from: " +parsedMessage.Continue[0].from);
        // Here you would typically send these messages to other participants via WebSocket
      } else {
        console.log("Continue array is empty. Waiting for more messages.");
      }
    } else if (isDone(parsedMessage)) {
      console.log("Status: DONE");
      console.log("Done Payload:", parsedMessage.Done);
      // Protocol is finished, handle the final result
    } else {
      console.error("Unknown message structure received.");
    }

    navigate('/main/tokens');
  };

  return (
    <div className={styles.outerContainer}>
      <div className={styles.container}>
        <h2 className={styles.header}>
          지갑 키 관리
        </h2>
        <p className={styles.subHeader}>
          지갑 생성에 필요한 정보를 입력해주세요.
        </p>

        <div className={styles.infoBoxContainer}>
          <p className={styles.infoBoxLabel}>키 쉐어 개수</p>
          <div className={styles.infoBox}>
            <p className={styles.infoBoxValue}>{keyShares}명</p>
          </div>
          <p className={styles.infoBoxLabel}>출금 최소 승인 인원</p>
          <div className={styles.infoBox}>
            <p className={styles.infoBoxValue}>{threshold}명</p>
          </div>
        </div>

        <p className={styles.infoBoxLabel}>지갑 관리자</p>

        {admins.map(admin => (
          <div key={admin.id} className={styles.adminRow}>
            <div className={styles.adminInfoBox}>
              <p>{admin.name}</p>
            </div>
            {admin.editable && (
              <button onClick={() => removeAdmin(admin.id)} className={styles.deleteButton}>
                &times;
              </button>
            )}
          </div>
        ))}

        <button
          onClick={addAdmin}
          className={styles.addButton}
        >
          + 엔터프라이즈 추가
        </button>

        <div style={{height: 200, flex: 1}}/>
      </div>
      <div className={styles.buttonContainer}>
        <button
          onClick={handleCreateWallet}
          className={styles.nextButton}
        >
          지갑 생성하기
        </button>
      </div>
    </div>
  );
};

export default CreateWalletScreen;
