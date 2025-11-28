import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreateWalletScreen.module.css';
import { useWebSocket } from '../hooks/useWebSocket';
import { useMPCStore } from '../hooks/useMPCStore';
import { isProtocolCompleteMessage, ProtocolCompleteMessage } from '../types/Messages';
import { ParticipantType } from '../types/ParticipantType';
import { registerGroup } from '../api/groupApi';

const CreateWalletScreen = () => {
  const { lastMessage, sendMessage} = useWebSocket('http://localhost:8080/ws');
  const { userId, auxInfo, tshare, presign, setAuxInfo, setTShare, setPresign } = useMPCStore();
  const navigate = useNavigate();
  const workerRef = useRef<Worker | null>(null);

  const [admins, setAdmins] = useState([
    { id: 1, name: '사용자', editable: false },
    { id: 2, name: '자체 보관소 1', editable: false },
    { id: 3, name: '자체 보관소 2', editable: false },
  ]);

  const keyShares = admins.length;
  const threshold = keyShares > 1 ? keyShares - 1 : 1;

  useEffect(() => {
    // 1. 워커 생성
    const worker = new Worker(new URL('../core/protocolExecutor.worker.ts', import.meta.url));
    workerRef.current = worker;
    console.log("Worker Created (Initial Only)");

    // 2. 컴포넌트가 완전히 사라질 때(Unmount)만 종료
    return () => {
      console.log("Worker Terminated");
      worker.terminate();
    };
  }, []); 

  // =========================================================
  // [수정 2] onmessage 핸들러 갱신
  // navigate, sendMessage 등 최신 상태가 필요할 때마다 핸들러만 교체
  // 워커는 죽이지 않음!
  // =========================================================
  useEffect(() => {
    if (!workerRef.current) return;

    workerRef.current.onmessage = (e: MessageEvent) => {
      const { type, payload } = e.data;
      
      if (type === 'sendMessage') {
        const [destination, message] = payload;
        sendMessage(destination, message); 
        
        const parsedMessage = JSON.parse(message);
        if (isProtocolCompleteMessage(parsedMessage)) {
            const completeMessage = parsedMessage as ProtocolCompleteMessage;
            if(completeMessage.type === ParticipantType.TSHARE) {
                navigate('/main/tokens'); 
            }
        }

      } else if (type === 'saveToStore') {
        const { key, value } = payload;
        if (key === 'auxInfo') setAuxInfo(value);
        else if (key === 'tShare') setTShare(value);
        else if (key === 'presign') setPresign(value);
      }
    };
  }, [navigate, sendMessage, setAuxInfo, setTShare, setPresign]); // 의존성 배열 유지

  // =========================================================
  // [수정 3] 메시지 전달 로직 (기존과 동일하되 workerRef 체크 강화)
  // =========================================================
  useEffect(() => {
    if (lastMessage && workerRef.current) {
        // 메시지가 오면 워커로 전달
        const storeState = {
            userId,
            auxInfo,
            tshare,
            presign
        };
        workerRef.current.postMessage({ lastMessage, storeState });
    }
  }, [lastMessage, userId, auxInfo, tshare, presign]);


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

  const handleCreateWallet = async () => {
    console.log(admins.slice(1).map(admin => admin.id.toString()));
    await registerGroup(userId, admins.slice(1).map(admin => admin.id.toString()), threshold);
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
