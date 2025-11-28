import { useState, useEffect, useRef } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useMPCStore } from './useMPCStore';

export const useWebSocket = (url: string) => {
  const userId = useMPCStore((state) => state.userId);
  const [lastMessage, setLastMessage] = useState<any | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    // [중요] userId가 없으면 연결하지 않음 (불필요한 에러/재연결 방지)
    if (!userId) {
        console.log("UserID가 없어 연결을 대기합니다.");
        return;
    }

    // 1. STOMP 클라이언트 생성
    const client = new Client({
      webSocketFactory: () => new SockJS(url),
      // 자동 재연결 시간 설정 (선택사항, 5초)
      reconnectDelay: 5000, 
      heartbeatIncoming: 0, 
      heartbeatOutgoing: 0,
      onConnect: () => {
        console.log(`STOMP 연결 성공 (User: ${userId})`);
        setConnected(true);

        // 2. 구독 설정 (User ID가 포함된 정확한 경로)
        const subscription = client.subscribe(`/queue/messages/${userId}`, (message: IMessage) => {
          if (message.body) {
            const parsedBody = JSON.parse(message.body);
            console.log('Received Message:', parsedBody);
            setLastMessage(parsedBody);
          }
        });
        console.log(`구독 완료 ID: ${subscription.id}`);
      },

      onWebSocketClose: (event: CloseEvent) => {
          console.log(`[웹소켓 종료] 코드: ${event.code}, 이유: ${event.reason}`);
          setConnected(false);
      },

      onDisconnect: () => {
        console.log('STOMP 연결 끊김');
        setConnected(false);
      },

      onStompError: (frame) => {
        console.error('STOMP 에러:', frame.headers['message']);
        console.error('상세 내용:', frame.body);
      },
    });

    // 3. 클라이언트 활성화
    client.activate();
    clientRef.current = client;

    // 4. Cleanup 함수
    return () => {
      console.log("WebSocket Cleanup (언마운트 또는 ID 변경)");
      // 비동기적인 해제 처리를 위해 deactivate 사용
      if (clientRef.current) {
         clientRef.current.deactivate();
      }
    };
  }, [url, userId]); // [중요] userId가 바뀌면 재연결해야 하므로 의존성 추가

  // 메시지 전송 함수
  const sendMessage = (destination: string, body: any) => {
    if (clientRef.current && clientRef.current.connected) {
      console.log(`${destination}으로 메시지 전송`);
      clientRef.current.publish({
        destination: destination,
        body: body,
      });
    } else {
      console.warn('소켓이 연결되지 않아 메시지를 보낼 수 없습니다.');
    }
  };

  return { lastMessage, connected, sendMessage };
};