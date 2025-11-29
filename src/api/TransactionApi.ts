import { apiClient, ApiResponse } from './apiClient';

// 1. 거래 요청 DTO (TransactionRequest)
export interface TransactionRequest {
  from: string;
  to: string;
  value: number; // Java Double -> TS number
  tx: string;
}

// 1-1. 거래 요청 응답 (Map<String, String> 대응)
export interface TransactionIdResponse {
  transactionId: string;
}

// 2. 거래 목록 조회 응답 DTO (TransactionResponse)
export interface TransactionResponse {
  transactionId: string;
  from: string;
  to: string;
  value: number;
  status: string;
  txId: string;
  createdAt: string; // LocalDateTime은 ISO string 형태로 넘어옴
}

// 3. 거래 상태 변경 요청 DTO (TransactionStatusUpdateRequest)
export interface TransactionStatusUpdateRequest {
  transactionId: string;
  txId?: string; // 필수값이 아닐 수 있으므로 optional 처리 (상황에 따라 제거 가능)
  vat: number;
}

/**
 * 1. 거래 요청
 * POST /api/v1/transaction
 */
export const requestTransaction = async (from: string, to: string, value:number, tx: string): Promise<TransactionIdResponse> => {
  // 1. 요청 데이터 구성
  const payload: TransactionRequest = {
    from: from,
    to: to,
    value: value,
    tx: tx
  };

  // 2. API 호출
  // Java: ResponseEntity<ApiResponse<Map<String, String>>>
  const response = await apiClient.post<ApiResponse<TransactionIdResponse>>('/transaction', payload);

  // 3. ApiResponse 내부의 실제 data만 반환
  return response.data.data;
};

/**
 * 2. 전체 목록 조회
 * GET /api/v1/transaction
 */
export const getTransactions = async (): Promise<TransactionResponse[]> => {
  // 1. API 호출
  // Java: ResponseEntity<ApiResponse<List<TransactionResponse>>>
  const response = await apiClient.get<ApiResponse<TransactionResponse[]>>('/transaction');

  // 2. 리스트 반환
  return response.data.data;
};

/**
 * 3. 거래 상태 변경
 * PATCH /api/v1/transaction
 */
export const updateTransactionStatus = async (data: TransactionStatusUpdateRequest): Promise<void> => {
  // 1. 요청 데이터 구성
  const payload = data;

  // 2. API 호출
  // Java: ResponseEntity<ApiResponse<Void>>
  await apiClient.patch<ApiResponse<null>>('/transaction', payload);
};