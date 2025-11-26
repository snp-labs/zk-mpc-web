import {InitProtocolSchema, ProceedRoundSchema, StartProtocolSchema} from './ProtocolSchema';
import {delegate_process_message, ready_message_factory, participant_factory, generate_sign_input, generate_tpresign_input, generate_trecover_target_input, generate_trefresh_input, generate_tshare_input} from '../wasm/pkg/threshold_ecdsa';
import { DelegateOutput, isContinue, isDone } from '../types/messages';
import {useMPCStore} from '../hooks/useMPCStore';

const execute = (json: String) => {
    const userId = useMPCStore((state) => state.userId);
    const initResult = InitProtocolSchema.safeParse(json);
    if (initResult.success) {
        let data = initResult.data;
        participant_factory(data.participantType??"", BigInt(data.sid), BigInt(userId), new BigUint64Array(data.otherIds.map(id => BigInt(id))), generateIntput(data))
        
        return;
    }

    // 2. ProceedRoundMessage로 파싱 시도
    const proceedResult = ProceedRoundSchema.safeParse(json);
    if (proceedResult.success) {
        let data = proceedResult.data;
        let result: string = delegate_process_message(data.type, data.message);
        const parsedMessage: DelegateOutput = JSON.parse(result);
        let output = handleOutput(parsedMessage);
        return output;
    }

    const startResult = StartProtocolSchema.safeParse(json);
    if (startResult.success) {
        let data = startResult.data;

        let readyMessage : string = ready_message_factory(data.type, BigInt(data.sid), BigInt(userId));
        let result: string = delegate_process_message(data.type, readyMessage);
        const parsedMessage: DelegateOutput = JSON.parse(result);
        let output = handleOutput(parsedMessage);
        return output;
    }
}

const handleOutput = (parsedMessage: DelegateOutput) => {
    if (isContinue(parsedMessage)) {
        if (parsedMessage.Continue.length > 0) {
            // RoundEndEvent

        } else {
            // 현재 라운드 완료
            // RoundCompleteEvent

        }
    } else if (isDone(parsedMessage)) {
        // 결과 저장

        // ProtocolCompleteEvent
    } else {
        console.error("Unknown message structure received.");
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
    const userId = useMPCStore((state) => state.userId);
    const tshare = useMPCStore((state) => state.tshare);
    const auxInfo = useMPCStore((state) => state.auxInfo);
    const presign = useMPCStore((state) => state.presign);

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
