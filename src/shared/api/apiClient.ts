import { QueryStringBuilder } from "@shared/lib";

interface ApiRequestOptions extends Omit<RequestInit, "method" | "body" | "next"> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  headers?: HeadersInit;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string,
    public response?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * 기본 요청 함수
 */
async function request<T>(
  endPoint: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  options: ApiRequestOptions = {}
): Promise<T> {
  const { body, params, headers, ...fetchOptions } = options;

  const finalUrl = new QueryStringBuilder()
    .endpoint(endPoint)
    .setMany(params || {})
    .build();

  // 요청 헤더 설정
  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  // fetch 요청
  const response = await fetch(finalUrl, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
    ...fetchOptions,
  });

  // fetch는 에러 직접 처리
  if (!response.ok) {
    let errorMessage = `API 에러: ${response.status} ${response.statusText}`;
    let errorResponse: unknown;

    try {
      errorResponse = await response.json();
      // 서버에서 에러 메시지를 제공하는 경우
      if (errorResponse && typeof errorResponse === "object" && "message" in errorResponse) {
        errorMessage = String(errorResponse.message);
      }
    } catch {
      // JSON 파싱 실패 시 기본 메시지 사용
    }

    throw new ApiError(response.status, response.statusText, errorMessage, errorResponse);
  }

  // 응답이 비어있는 경우 (204 No Content 등)
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return undefined as T;
  }

  // JSON 응답 파싱
  try {
    return await response.json();
  } catch {
    throw new Error("응답을 JSON으로 파싱할 수 없습니다");
  }
}

export const apiClient = {
  get<T>(url: string, options?: ApiRequestOptions): Promise<T> {
    return request<T>(url, "GET", options);
  },
  post<T>(url: string, body?: unknown, options?: ApiRequestOptions): Promise<T> {
    return request<T>(url, "POST", { ...options, body });
  },
  put<T>(url: string, body?: unknown, options?: ApiRequestOptions): Promise<T> {
    return request<T>(url, "PUT", { ...options, body });
  },
  patch<T>(url: string, body?: unknown, options?: ApiRequestOptions): Promise<T> {
    return request<T>(url, "PATCH", { ...options, body });
  },
  delete<T>(url: string, options?: ApiRequestOptions): Promise<T> {
    return request<T>(url, "DELETE", options);
  },
};
