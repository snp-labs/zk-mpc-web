import { useState, useEffect, useRef } from 'react';

// Define ready state mapping for clarity, matching WebSocket.readyState
const readyStateMap: { [key: number]: ReadyState } = {
  0: 'CONNECTING',
  1: 'OPEN',
  2: 'CLOSING',
  3: 'CLOSED',
};

type ReadyState = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED';

interface UseWebSocket {
  lastMessage: MessageEvent | null;
  readyState: ReadyState;
  sendMessage: (message: string | ArrayBufferLike | Blob | ArrayBufferView) => void;
}

export const useWebSocket = (url: string | null): UseWebSocket => {
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
  const [readyState, setReadyState] = useState<ReadyState>('CLOSED');
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (url) {
      const socket = new WebSocket(url);
      ws.current = socket;
      setReadyState(readyStateMap[socket.readyState]);

      socket.onopen = () => {
        console.log('WebSocket connection opened');
        setReadyState('OPEN');
      };

      socket.onmessage = (event) => {
        setLastMessage(event);
      };

      socket.onclose = () => {
        console.log('WebSocket connection closed');
        setReadyState('CLOSED');
        ws.current = null;
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        // The onclose event will usually be fired after an error.
      };

      // Cleanup function to close the socket when the component unmounts or URL changes
      return () => {
        if (ws.current) {
          ws.current.close();
        }
      };
    }
  }, [url]); // Re-run the effect if the URL changes

  const sendMessage = (message: string | ArrayBufferLike | Blob | ArrayBufferView) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
    } else {
      console.warn('WebSocket is not open. Cannot send message.');
    }
  };

  return {
    lastMessage,
    readyState,
    sendMessage,
  };
};
