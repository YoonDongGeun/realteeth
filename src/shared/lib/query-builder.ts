const getBaseUrl = () => {
  return process.env.VERCEL ? process.env.NEXT_PUBLIC_BASE_URL!.slice(0, -1) : "http://localhost:3000";
};

export class QueryStringBuilder {
  private base: string = getBaseUrl();
  private path: string = "";
  private params: Record<string, string | number | boolean> = {};

  constructor(baseUrl?: string, endpoint?: string) {
    if (baseUrl) {
      this.base = baseUrl;
    }
    if (endpoint) {
      this.path = endpoint;
    }
  }

  /**
   * 베이스 URL 설정 (예: https://api.example.com)
   */
  baseUrl(url: string): this {
    this.base = url;
    return this;
  }

  /**
   * 엔드포인트 경로 설정 (예: /users, /data)
   */
  endpoint(path: string): this {
    this.path = path;
    return this;
  }

  /**
   * 단일 파라미터 추가/수정
   */
  set(key: string, value: string | number | boolean | undefined): this {
    if (value !== undefined) {
      this.params[key] = value;
    }
    return this;
  }

  /**
   * 여러 파라미터 한 번에 추가/수정
   */
  setMany(params: Record<string, string | number | boolean | undefined>): this {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        this.params[key] = value;
      }
    });
    return this;
  }

  build(): string {
    if (!this.base && !this.endpoint) {
      throw new Error("URL이 옳바르지 않습니다.");
    }

    // baseUrl과 endpoint를 결합
    const fullUrl = this.path ? `${this.base}${this.path}` : this.base;

    const queryString = Object.entries(this.params)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    return queryString ? `${fullUrl}?${queryString}` : fullUrl;
  }
}
