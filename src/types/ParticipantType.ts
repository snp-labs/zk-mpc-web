export enum ProcessGroup {
  KEY_GENERATION = 'KEY_GENERATION',
  RECOVER = 'RECOVER',
  SIGNING = 'SIGNING',
}

export enum ParticipantType {
  AUXINFO_GENERATION = 'AUXINFO_GENERATION',
  TSHARE = 'TSHARE',
  AUXINFO_RECOVER = 'AUXINFO_RECOVER',
  TRECOVERHELPER = 'TRECOVERHELPER',
  TRECOVERTARGET = 'TRECOVERTARGET',
  TPRESIGN = 'TPRESIGN',
  SIGN = 'SIGN',
}

interface ParticipantTypeDetail {
  typeName: string;
  processGroup: ProcessGroup;
}

export const ParticipantTypeInfo: Record<ParticipantType, ParticipantTypeDetail> = {
  [ParticipantType.AUXINFO_GENERATION]: { 
    typeName: "AuxInfo", 
    processGroup: ProcessGroup.KEY_GENERATION 
  },
  [ParticipantType.TSHARE]: { 
    typeName: "TShare", 
    processGroup: ProcessGroup.KEY_GENERATION 
  },
  [ParticipantType.AUXINFO_RECOVER]: { 
    typeName: "AuxInfo", 
    processGroup: ProcessGroup.RECOVER 
  },
  [ParticipantType.TRECOVERHELPER]: { 
    typeName: "TRecoverHelper", 
    processGroup: ProcessGroup.RECOVER 
  },
  [ParticipantType.TRECOVERTARGET]: { 
    typeName: "TRecoverTarget", 
    processGroup: ProcessGroup.RECOVER 
  },
  [ParticipantType.TPRESIGN]: { 
    typeName: "TPreSign", 
    processGroup: ProcessGroup.SIGNING 
  },
  [ParticipantType.SIGN]: { 
    typeName: "Sign", 
    processGroup: ProcessGroup.SIGNING 
  },
};

export const getParticipantTypeName = (type: ParticipantType): string => {
  return ParticipantTypeInfo[type].typeName;
};

export const getParticipantProcessGroup = (type: ParticipantType): ProcessGroup => {
  return ParticipantTypeInfo[type].processGroup;
};

export const participantTypeOf = (key: string): ParticipantType => {
  // 입력된 문자열이 Enum의 Key에 존재하는지 확인
  if (key in ParticipantType) {
    return ParticipantType[key as keyof typeof ParticipantType];
  }
  
  // 유효하지 않은 값이면 에러 발생 (또는 필요에 따라 null/undefined 반환)
  throw new Error(`Invalid ParticipantType: ${key}`);
};

export const getParticipantTypeFromName = (targetTypeName: string): ParticipantType => {
  // ParticipantTypeInfo의 키(Enum 값)들을 순회하며 typeName이 일치하는지 확인
  const foundType = (Object.keys(ParticipantTypeInfo) as ParticipantType[]).find(
    (key) => ParticipantTypeInfo[key].typeName === targetTypeName
  );

  if (!foundType) {
    throw new Error(`일치하는 ParticipantType을 찾을 수 없습니다: ${targetTypeName}`);
  }

  return foundType;
}