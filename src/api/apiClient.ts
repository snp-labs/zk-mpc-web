import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export interface ApiResponse<T> {
  status: string;  // 예: "SUCCESS", "FAIL"
  message?: string;
  data: T;
}

// 1. Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1', 
  timeout: 10000, // 10초 타임아웃
  headers: {
    'Content-Type': 'application/json',
  },
//   withCredentials: true, // CORS 쿠키 전송 필요 시 설정
});

// [응답 인터셉터] 응답을 받은 후 실행 (데이터 가공 및 에러 처리)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // 공통 에러 처리 로직
    if (error.response) {
      const { status } = error.response;
      
      // 서버에서 보내준 에러 메시지가 있다면 그걸 던짐
      return Promise.reject(error.response.data || error.message);
    }
    
    return Promise.reject(error);
  }
);

export { apiClient };