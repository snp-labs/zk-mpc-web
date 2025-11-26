import {InitProtocolSchema, ProceedRoundSchema, StartProtocolSchema} from './protocolSchema';
import {delegate_process_message, ready_message_factory, participant_factory, generate_sign_input, generate_tpresign_input, generate_trecover_target_input, generate_trefresh_input, generate_tshare_input} from '../wasm/pkg/threshold_ecdsa';
import { ZodSafeParseResult } from 'zod';
import { DelegateOutput, isContinue, isDone } from '../types/messages';

const execute = (json: String) => {
    const initResult = InitProtocolSchema.safeParse(json);
    if (initResult.success) {
        let data = initResult.data;
        // 자신의 id 가져오기
        let myid = "1";
        participant_factory(data.participantType??"", BigInt(data.sid), BigInt(myid), new BigUint64Array(data.otherIds.map(id => BigInt(id))), generateIntput(data))
        
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

        let readyMessage : string = ready_message_factory(data.type, data.sid, );
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
    if(data.participantType === "AuxInfo") {
        return "";
    }
    else if(data.participantType === "TShare") {
        return generate_tshare_input(, data.threshold);
    }
    else if(data.participantType === "TRecoverTarget") {
        return generate_trecover_target_input(data.participantIds, data.target, ,data.threshold);
    }
    else if(data.participantType === "TPreSign") {
        return generate_tpresign_input(data.participantIds, , );
    }
    else if(data?.participantType === "Sign") {
        return generate_sign_input(, data.participantIds, , , data.messageBytes, data.threshold);
    }
    else {
        return "";
    }
}
