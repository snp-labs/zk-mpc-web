/* eslint-env worker */

import init, {init_panic_hook, delegate_process_message, ready_message_factory, participant_factory, generate_sign_input, generate_tpresign_input, generate_trecover_target_input, generate_tshare_input, get_master_pk} from '../wasm/pkg/threshold_ecdsa';
import {isInitProtocolMessage, isProceedRoundMessage, isStartProtocolMessage} from './ProtocolSchema';
import { ContinueMessage, DelegateOutput, extractRound, isContinue, isDone, ProceedRoundMessage, ProtocolCompleteMessage, RoundCompleteMessage, InitProtocolEndMessage } from '../types/Messages';
import { participantTypeOf, getParticipantTypeName, ParticipantType, getParticipantTypeFromName } from '../types/ParticipantType';
import { getRoundName, Round } from '../types/Round';
import { ethers } from 'ethers';

interface StoreState {
    userId: string;
    auxInfo: string;
    tshare: string;
    presign: string;
}

const handleOutput = (parsedMessage: DelegateOutput, type: string, processResult: string, sid: string, originalMessage: string, storeState: StoreState) => {
    if (isContinue(parsedMessage)) {
        if (parsedMessage.Continue.length > 0) {
            const result : ProceedRoundMessage = {
                type: type,
                message: processResult,
                sid: sid,
                kind: 'NONE'
            }

            self.postMessage({ type: 'sendMessage', payload: ["/app/round/end", JSON.stringify(result)] });
        } else {
            const continueMessage: ContinueMessage = JSON.parse(originalMessage);
            const round : Round = extractRound(continueMessage.message_type)

            const result : RoundCompleteMessage = {
                type: type,
                roundName: getRoundName(round),
                sid: sid,
                kind: 'NONE'
            }

            self.postMessage({ type: 'sendMessage', payload: ["/app/round/complete", JSON.stringify(result)] });
        }
    } else if (isDone(parsedMessage)) {
        // Post message to save output
        saveoutput(parsedMessage, type);

        const result: ProtocolCompleteMessage = {
            sid: sid,
            memberId: storeState.userId,
            type: getParticipantTypeFromName(type),
            kind: 'COMPLETE'
        }
        self.postMessage({ type: 'sendMessage', payload: ["/app/protocol/complete", JSON.stringify(result)] });
    } else {
        console.error("Unknown message structure received.");
    }
}

const saveoutput = (output: DelegateOutput, type:string) => {
    if(type === getParticipantTypeName(ParticipantType.AUXINFO_GENERATION)) {
        if(isDone(output)){
            self.postMessage({ type: 'saveToStore', payload: { key: 'auxInfo', value: JSON.stringify(output.Done) } });
        }
    }
    else if(type === getParticipantTypeName(ParticipantType.TSHARE)) {
        if(isDone(output)){
            let rawPk = get_master_pk(JSON.stringify(output.Done));

            let rawHex = JSON.parse(rawPk);
            let finalPk = "0x" + rawHex.slice(-130);
            let address = ethers.computeAddress(finalPk)
            self.postMessage({ type: 'saveToStore', payload: { key: 'address', value: address } });
            self.postMessage({ type: 'saveToStore', payload: { key: 'pk', value: finalPk } });
            self.postMessage({ type: 'saveToStore', payload: { key: 'tShare', value: JSON.stringify(output.Done) } });
        }
    }
    else if(type === getParticipantTypeName(ParticipantType.TPRESIGN)) {
        if(isDone(output)){
            self.postMessage({ type: 'saveToStore', payload: { key: 'presign', value: JSON.stringify(output.Done) } });
        }
    }
    else if(type === getParticipantTypeName(ParticipantType.TRECOVERTARGET)) {
        if(isDone(output)){
            let rawPk = get_master_pk(JSON.stringify(output.Done));

            let rawHex = JSON.parse(rawPk);
            let finalPk = "0x" + rawHex.slice(-130);
            let address = ethers.computeAddress(finalPk)
            self.postMessage({ type: 'saveToStore', payload: { key: 'address', value: address } });
            self.postMessage({ type: 'saveToStore', payload: { key: 'pk', value: finalPk } });
            self.postMessage({ type: 'saveToStore', payload: { key: 'tShare', value: JSON.stringify(output.Done) } });
        }
    }
}

const generateIntput = (data: any, storeState: StoreState) => {
    const { userId, tshare, auxInfo, presign } = storeState;

    if(data.participantType === ParticipantType.AUXINFO_GENERATION || data.participantType === ParticipantType.AUXINFO_RECOVER) {
        return "";
    }
    else if(data.participantType === ParticipantType.TSHARE) {
        return generate_tshare_input(auxInfo, data.threshold);
    }
    else if(data.participantType === ParticipantType.TRECOVERTARGET) {
        return generate_trecover_target_input(new BigUint64Array(data.participantIds.map((id: string) => BigInt(id))), BigInt(data.target??userId), auxInfo,data.threshold);
    }
    else if(data.participantType === ParticipantType.TPRESIGN) {
        return generate_tpresign_input(new BigUint64Array(data.participantIds.map((id: string) => BigInt(id))), auxInfo, tshare);
    }
    else if(data?.participantType === ParticipantType.SIGN) {
        return generate_sign_input(BigInt(userId), new BigUint64Array(data.participantIds.map((id: string) => BigInt(id))), presign, tshare, data.messageBytes, data.threshold);
    }
    else {
        throw new Error(`Unknown participant type: ${data.participantType}`);
    }
}

let messageQueue: any[] = [];
let isProcessing = false;

// Initialize WASM immediately when the worker is loaded.
const initPromise = init().then(() => {
    console.log("Wasm Initialized");
    try {
        init_panic_hook();
        console.log("Panic Hook Installed");
    } catch (err) {
        console.warn("init_panic_hook failed (maybe not exported from Rust?):", err);
    }
});

const processMessage = async (data: { lastMessage: string, storeState: StoreState }) => {
    // Wait for the initialization to complete.
    await initPromise;

    const { lastMessage, storeState } = data;
    const { userId } = storeState;
    const json = lastMessage;

    if (!json) return;

    if (isInitProtocolMessage(json)) {
        let data = json;

        participant_factory(getParticipantTypeName(participantTypeOf(data.participantType ?? "")), BigInt(data.sid), BigInt(userId), new BigUint64Array(data.otherIds.map(id => BigInt(id))), generateIntput(data, storeState));

        const result: InitProtocolEndMessage = {
            type: participantTypeOf(data.participantType ?? ""),
            sid: data.sid,
            memberId: userId,
            kind: 'NONE'
        };

        self.postMessage({ type: 'sendMessage', payload: ["/app/init/end", JSON.stringify(result)] });
        return;
    }

    if (isProceedRoundMessage(json)) {
        let data = json;
        console.log("delegate start : " + data.message.slice(0, 100));
        let result: string = delegate_process_message(data.type, data.message);
        console.log("delegate result : " + result.slice(0, 100));
        const parsedMessage: DelegateOutput = JSON.parse(result);
        handleOutput(parsedMessage, data.type, result, data.sid, data.message, storeState);
        return;
    }

    if (isStartProtocolMessage(json)) {
        let data = json;
        let readyMessage: string = ready_message_factory(getParticipantTypeName(participantTypeOf(data.type ?? "")), BigInt(data.sid), BigInt(userId));
        console.log("ready message 결과 : " + readyMessage.slice(0, 100));
        let result: string = delegate_process_message(getParticipantTypeName(participantTypeOf(data.type ?? "")), readyMessage);
        console.log("delegate result : " + result.slice(0, 100)); 
        const parsedMessage: DelegateOutput = JSON.parse(result);
        handleOutput(parsedMessage, getParticipantTypeName(participantTypeOf(data.type ?? "")), result, data.sid, readyMessage, storeState);
        return;
    }

    console.error("Protocol type error");
};

const processQueue = async () => {
    if (isProcessing || messageQueue.length === 0) {
        return;
    }
    isProcessing = true;
    const data = messageQueue.shift();
    try {
        await processMessage(data);
    } finally {
        isProcessing = false;
        processQueue(); // Process next message
    }
};

self.onmessage = (e: MessageEvent<{ lastMessage: string, storeState: StoreState }>) => {
    // messageQueue.push(e.data);
    // processQueue();
    const lastMessage = e.data.lastMessage;
    const storeState = e.data.storeState;

    processMessage({lastMessage, storeState});
};
