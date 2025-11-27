export interface InitProtocolMessage {
  participantType?: string; // optional
  sid: string;
  otherIds: string[];
  participantIds: string[];
  threshold: number;
  messageBytes: any;
  target?: string; // optional
}

export const isInitProtocolMessage = (arg: any): arg is InitProtocolMessage => {
  return (
    arg !== null &&

    typeof arg === 'object' &&

    typeof arg.participantType === 'string' &&

    typeof arg.sid === 'string' &&

    Array.isArray(arg.otherIds)  &&

    Array.isArray(arg.participantIds) &&

    typeof arg.threshold === 'number' &&

    (arg.messageBytes === null || typeof arg.messageBytes === 'string') &&

    (arg.target === null || typeof arg.target === 'string')
  );
};

// 2. ProceedRoundMessage
export interface ProceedRoundMessage {
  type: string;
  sid: string;
  message: string;
}

export const isProceedRoundMessage = (arg: any): arg is ProceedRoundMessage => {
  return (
    arg !== null &&
    typeof arg === 'object' &&
    typeof arg.type === 'string' &&
    typeof arg.sid === 'string' &&
    typeof arg.message === 'string'
  );
};

// 3. StartProtocolMessage
export interface StartProtocolMessage {
  type: string;
  sid: string;
}

export const isStartProtocolMessage = (arg: any): arg is StartProtocolMessage => {
  return (
    arg !== null &&
    typeof arg === 'object' &&
    typeof arg.type === 'string' &&
    typeof arg.sid === 'string'
  );
};