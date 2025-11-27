import { ParticipantType } from "./ParticipantType";
import { getRoundFromName, Round } from "./Round";

/**
 * A message object when the protocol round is ongoing.
 * This is the object inside the "Continue" array.
 */
export interface ContinueMessage {
  message_type: { [key: string]: string };
  identifier: string; // Serialized BigInt
  from: string;       // Serialized BigInt
  to: string | null;  // Serialized BigInt or null
  is_broadcast: boolean;
  unverified_bytes: number[];
}

/**
 * The discriminated union type for the output.
 * The top-level key is either "Continue" or "Done".
 */
export type DelegateOutput = 
  | { Continue: ContinueMessage[] }
  | { Done: Object };

/**
 * Type guard to check if the output is a "Continue" message.
 * @param output The object to check.
 * @returns True if the output has a "Continue" key.
 */
export function isContinue(output: any): output is { Continue: ContinueMessage[] } {
  return output && 'Continue' in output;
}

export const extractRound = (messageType: Record<string, string> | null | undefined): Round => {
  if (!messageType || Object.keys(messageType).length === 0) {
    throw new Error("NOT_FOUND_ROUND_ERROR: Message type is empty or null");
  }

  const firstValue = Object.values(messageType)[0];
  const round = getRoundFromName(firstValue);
  return round;
};

/**
 * Type guard to check if the output is a "Done" message.
 * @param output The object to check.
 * @returns True if the output has a "Done" key.
 */
export function isDone(output: any): output is { Done: Object } {
  return output && 'Done' in output;
}

export interface ProceedRoundMessage {
  type: string;
  message: string;
  sid: string;
}

export interface InitProtocolEndMessage {
  type: ParticipantType;
  sid: string;
  memberId: string;
}

// 3. ProtocolCompleteMessage
export interface ProtocolCompleteMessage {
  sid: string;
  memberId: string;
  type: ParticipantType;
}

export interface RoundCompleteMessage {
  type: string;
  roundName: string;
  sid: string;
}

export const isProtocolCompleteMessage = (arg: any): arg is ProtocolCompleteMessage => {
  return (
    arg !== null &&
    typeof arg === 'object' &&
    typeof arg.memberId === 'string' &&
    typeof arg.type === 'string' &&
    typeof arg.sid === 'string'
  );
}