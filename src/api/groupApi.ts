import { apiClient, ApiResponse } from './apiClient';

export interface GroupRegisterRequest {
  memberId: string;
  enterprises: string[]; // List<String> -> string[]
  threshold: number;     // Integer -> number
}

/**
 * 그룹 등록 (Key Generation 프로토콜 시작)
 * POST /group
 */
export const registerGroup = async (memberId:string, enterprises:string[], threshold:number): Promise<void> => {
  const payload = { memberId, enterprises, threshold };
  // 1. API 호출
  // 백엔드가 ApiResponse<Void>를 반환하므로, 제네릭으로 타입을 명시합니다.
  await apiClient.post<ApiResponse<null>>('/group', payload);
  
  // 2. 리턴값 처리
  // data가 null이므로 별도의 return 없이 함수 종료 (Promise<void>)
};