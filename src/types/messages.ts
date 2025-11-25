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
 * The payload when the protocol is completely finished.
 * This is the object inside the "Done" key.
 */
export interface DonePayload {
  public_auxinfo: {
    participant: string; // Serialized BigInt
    pk: string;
    params: any; // The 'params' structure is complex, using 'any' for now.
  }[];
  // Other fields might exist in the 'Done' payload.
}

/**
 * The discriminated union type for the output.
 * The top-level key is either "Continue" or "Done".
 */
export type DelegateOutput = 
  | { Continue: ContinueMessage[] }
  | { Done: DonePayload };

/**
 * Type guard to check if the output is a "Continue" message.
 * @param output The object to check.
 * @returns True if the output has a "Continue" key.
 */
export function isContinue(output: any): output is { Continue: ContinueMessage[] } {
  return output && 'Continue' in output;
}

/**
 * Type guard to check if the output is a "Done" message.
 * @param output The object to check.
 * @returns True if the output has a "Done" key.
 */
export function isDone(output: any): output is { Done: DonePayload } {
  return output && 'Done' in output;
}