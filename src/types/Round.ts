import { ParticipantType } from './ParticipantType'; 

export enum Round {
  R2_PRIVATE_SHARE = 'R2_PRIVATE_SHARE',
  R2_DECOMMIT = 'R2_DECOMMIT',
  
  ROUND_ONE_BROADCAST = 'ROUND_ONE_BROADCAST',
  ROUND_ONE = 'ROUND_ONE',
  
  ROUND_TWO_BROADCAST = 'ROUND_TWO_BROADCAST',
  ROUND_TWO = 'ROUND_TWO',
  
  ROUND_DEFAULT = 'ROUND_DEFAULT',
}

interface RoundDetail {
  name: string;
  type: ParticipantType | null;
}

export const RoundInfo: Record<Round, RoundDetail> = {
  [Round.R2_PRIVATE_SHARE]: { name: "R2PrivateShare", type: ParticipantType.TSHARE },
  [Round.R2_DECOMMIT]: { name: "R2Decommit", type: ParticipantType.TSHARE },
  
  [Round.ROUND_ONE_BROADCAST]: { name: "RoundOneBroadcast", type: ParticipantType.TPRESIGN },
  [Round.ROUND_ONE]: { name: "RoundOne", type: ParticipantType.TPRESIGN },
  
  [Round.ROUND_TWO_BROADCAST]: { name: "RoundTwoBroadcast", type: ParticipantType.TPRESIGN },
  [Round.ROUND_TWO]: { name: "RoundTwo", type: ParticipantType.TPRESIGN },
  
  [Round.ROUND_DEFAULT]: { name: "RoundDefault", type: null },
};

export const getRoundFromName = (name: string): Round => {
  const foundRound = (Object.keys(RoundInfo) as Round[]).find(
    (key) => RoundInfo[key].name === name
  );
  return foundRound || Round.ROUND_DEFAULT;
};


export const getNextRound = (currentRound: Round): Round | null => {
  switch (currentRound) {
    case Round.R2_PRIVATE_SHARE:
      return Round.R2_DECOMMIT;
    case Round.ROUND_ONE_BROADCAST:
      return Round.ROUND_ONE;
    case Round.ROUND_TWO_BROADCAST:
      return Round.ROUND_TWO;
    // 마지막 라운드들
    case Round.R2_DECOMMIT:
    case Round.ROUND_ONE:
    case Round.ROUND_TWO:
    default:
      return null;
  }
};

export const hasPendingPrerequisites = (currentRound: Round): boolean => {
  switch (currentRound) {
    case Round.R2_DECOMMIT:
    case Round.ROUND_ONE:
    case Round.ROUND_TWO:
      return true;
    default:
      return false;
  }
};

export const getRoundName = (round: Round): string => {
  const info = RoundInfo[round];
  
  if (!info) {
    console.warn(`Unknown Round: ${round}`);
    return ""; 
  }

  return info.name;
};