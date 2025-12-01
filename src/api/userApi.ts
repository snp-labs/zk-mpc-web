
import { apiClient, ApiResponse } from './apiClient';

// 2. 회원가입 요청 (MemberRegisterRequest)
export interface MemberRegisterRequest {
  email: string;
  authCode: string;
}

// 3. 회원가입 응답 (MemberRegisterResponse)
export interface MemberRegisterResponse {
  memberId: string;
}

// 4. 이메일 인증 요청 (EmailRequest)
export interface EmailRequest {
  email: string;
}

export interface MemberIdResponse {
  memberId: string;
}

/**
 * 이메일 인증 코드 요청
 * POST /member/email
 */
export const requestEmailVerification = async (email: string): Promise<void> => {
  // 백엔드가 ApiResponse<Void>를 주지만, 실제 필요한 데이터는 없음
  await apiClient.post<ApiResponse<null>>('/member/email', { email });
};

/**
 * 회원가입 요청
 * POST /member
 */
export const registerMember = async (email: string, authCode: string): Promise<MemberRegisterResponse> => {
  // 1. 요청 데이터 구성
  const payload = { email, authCode };

  // 2. API 호출
  // apiClient interceptor 덕분에 response.data(즉, ApiResponse)가 반환됨
  const response = await apiClient.post<ApiResponse<MemberRegisterResponse>>('/member', payload);
  
  // 3. ApiResponse 내부의 실제 data만 반환 (MemberRegisterResponse)
  return response.data.data;
};

/**
 * 회원 인증 요청
 * POST /member/verify
 */
export const verifyMember = async (email: string, authCode: string): Promise<MemberIdResponse> => {
  // 1. 요청 데이터 구성
  const payload = { email, authCode };

  // 2. API 호출
  // apiClient interceptor 덕분에 response.data(즉, ApiResponse)가 반환됨
  const response = await apiClient.post<ApiResponse<MemberIdResponse>>('/member/verify', payload);
  
  // 3. ApiResponse 내부의 실제 data만 반환 (MemberIdResponse)
  return response.data.data;
};

/**
 * 주소 등록 요청
 * POST /member/address
 */
export const registerAddress = async (memberId: string, address: string): Promise<void> => {
  // 1. 요청 데이터 구성
  const payload = { memberId, address };

  await apiClient.post<ApiResponse<null>>('/member/address', payload);
};

export const recoverKey = async (memberId: string): Promise<void> => {
  // 1. 요청 데이터 구성
  const payload = { memberId };

  await apiClient.post<ApiResponse<null>>('/member/recover', payload);
};


