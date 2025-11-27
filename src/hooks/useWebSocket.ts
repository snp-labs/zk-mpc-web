import { useState, useEffect, useRef } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useMPCStore } from './useMPCStore';

export const useWebSocket = (baseUrl: string) => {
  const userId = useMPCStore((state) => state.userId);
  const [lastMessage, setLastMessage] = useState<any | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  
  // stompClient를 ref로 관리하여 리렌더링 시에도 유지
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    // 1. STOMP 클라이언트 생성
    const client = new Client({
      // 백엔드에서 .withSockJS()를 설정했으므로 SockJS를 팩토리로 사용
      webSocketFactory: () => new SockJS(`${baseUrl}/ws`), 
      
      // 연결 성공 시 실행될 콜백
      onConnect: () => {
        console.log('STOMP Connection Established');
        setConnected(true);

        // 2. 구독 설정 (Subscribe)
        client.subscribe(`/user/${userId}/queue/messages/`, (message: IMessage) => {
          if (message.body) {
            const parsedBody = JSON.parse(message.body);
            console.log('Received Message:', parsedBody);
            setLastMessage(parsedBody);
          }
        });
      },

      // 연결 끊김 시 실행
      onDisconnect: () => {
        console.log('STOMP Connection Closed');
        setConnected(false);
      },

      // 에러 발생 시
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    // 3. 클라이언트 활성화
    client.activate();
    clientRef.current = client;

    // 4. 컴포넌트 언마운트 시 연결 해제
    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [baseUrl]);

  // 메시지 전송 함수 (필요 시 사용)
  const sendMessage = (args: {destination: string, body: any}) => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish({
        destination: args.destination,
        body: args.body,
      });
    } else {
      console.warn('STOMP client is not connected.');
    }
  };

  return { lastMessage, connected, sendMessage };
};