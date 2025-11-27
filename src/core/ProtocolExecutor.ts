import {InitProtocolSchema, ProceedRoundSchema, StartProtocolSchema} from './ProtocolSchema';
import {delegate_process_message, ready_message_factory, participant_factory, generate_sign_input, generate_tpresign_input, generate_trecover_target_input, generate_tshare_input} from '../wasm/pkg/threshold_ecdsa';
import { ContinueMessage, DelegateOutput, extractRound, isContinue, isDone, ProceedRoundMessage, ProtocolCompleteMessage, RoundCompleteMessage, InitProtocolEndMessage } from '../types/Messages';
import {useMPCStore} from '../hooks/useMPCStore';
import { participantTypeOf, getParticipantTypeName, ParticipantType } from '../types/ParticipantType';
import { getRoundName, Round } from '../types/Round';

export const execute = (json: String) => {
    const userId = useMPCStore.getState().userId;
    const initResult = InitProtocolSchema.safeParse(json);
    if (initResult.success) {
        let data = initResult.data;
        participant_factory(getParticipantTypeName(participantTypeOf(data.participantType??"")), BigInt(data.sid), BigInt(userId), new BigUint64Array(data.otherIds.map(id => BigInt(id))), generateIntput(data));

        const result : InitProtocolEndMessage = {
            type: participantTypeOf(data.participantType??""),
            sid: data.sid,
            memberId: userId
        };

        return JSON.stringify(result);
    }

    const proceedResult = ProceedRoundSchema.safeParse(json);
    if (proceedResult.success) {
        let data = proceedResult.data;
        let result: string = delegate_process_message(data.type, data.message);
        const parsedMessage: DelegateOutput = JSON.parse(result);
        let output = handleOutput(parsedMessage, getParticipantTypeName(participantTypeOf(data.type??"")), result, data.sid, data.message);
        return output;
    }

    const startResult = StartProtocolSchema.safeParse(json);
    if (startResult.success) {
        let data = startResult.data;

        let readyMessage : string = ready_message_factory(getParticipantTypeName(participantTypeOf(data.type??"")), BigInt(data.sid), BigInt(userId));
        let result: string = delegate_process_message(getParticipantTypeName(participantTypeOf(data.type??"")), readyMessage);
        const parsedMessage: DelegateOutput = JSON.parse(result);
        let output = handleOutput(parsedMessage, getParticipantTypeName(participantTypeOf(data.type??"")), result, data.sid, readyMessage);
        return output;
    }
}

const handleOutput = (parsedMessage: DelegateOutput, type: string, processResult: string, sid: string, originalMessage: string) => {
    if (isContinue(parsedMessage)) {
        if (parsedMessage.Continue.length > 0) {
            const result : ProceedRoundMessage = {
                type: type,
                message: processResult,
                sid: sid,
            }

            return JSON.stringify(result);
        } else {
            const continueMessage: ContinueMessage = JSON.parse(originalMessage);
            const round : Round = extractRound(continueMessage.message_type)

            const result : RoundCompleteMessage = {
                type: type,
                roundName: getRoundName(round),
                sid: sid
            }

            return JSON.stringify(result);
        }
    } else if (isDone(parsedMessage)) {
        // 결과 저장
        saveoutput(parsedMessage, type);
    
        const userId = useMPCStore.getState().userId;
        const result: ProtocolCompleteMessage = {
            sid: sid,
            memberId: userId,
            type: participantTypeOf(type)
        }
        return JSON.stringify(result);
    } else {
        console.error("Unknown message structure received.");
    }
}

const saveoutput = (output: DelegateOutput, type:string) => {
    if(type === getParticipantTypeName(ParticipantType.AUXINFO_GENERATION)) {
        if(isDone(output)){
            useMPCStore.getState().setAuxInfo(output.Done.toString());
        }
    }
    else if(type === getParticipantTypeName(ParticipantType.TSHARE)) {
        if(isDone(output)){
            useMPCStore.getState().setTShare(output.Done.toString());
        }
    }
    else if(type === getParticipantTypeName(ParticipantType.TPRESIGN)) {
        if(isDone(output)){
            useMPCStore.getState().setPresign(output.Done.toString());
        }
    }
}

const generateIntput = (data: {
    sid: string;
    otherIds: string[];
    participantIds: string[];
    threshold: number;
    messageBytes: any;
    participantType?: string | undefined;
    target?: string | undefined;
}) => {
    const { userId, tshare, auxInfo, presign } = useMPCStore.getState();

    if(data.participantType === "AuxInfo") {
        return "";
    }
    else if(data.participantType === "TShare") {
        return generate_tshare_input(auxInfo, data.threshold);
    }
    else if(data.participantType === "TRecoverTarget") {
        return generate_trecover_target_input(new BigUint64Array(data.participantIds.map(id => BigInt(id))), BigInt(data.target??userId), auxInfo,data.threshold);
    }
    else if(data.participantType === "TPreSign") {
        return generate_tpresign_input(new BigUint64Array(data.participantIds.map(id => BigInt(id))), auxInfo, tshare);
    }
    else if(data?.participantType === "Sign") {
        return generate_sign_input(BigInt(userId), new BigUint64Array(data.participantIds.map(id => BigInt(id))), presign, tshare, data.messageBytes, data.threshold);
    }
    else {
        return "";
    }
}
