/**
 * @example
 * const url = new QueryStringBuilder('https://api.example.com', '/data')
 *   .set('key', 'value')
 *   .set('page', 1)
 *   .set('limit', 100)
 *   .build();
 *
 * @example
 * // 체이닝 방식
 * const url = new QueryStringBuilder()
 *   .baseUrl('https://api.example.com')
 *   .endpoint('/data')
 *   .setMany({ key: 'value', page: 1, limit: 100 })
 *   .build();
 */
export class QueryStringBuilder {
  private base: string = "";
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
  set(key: string, value: string | number | boolean): this {
    this.params[key] = value;
    return this;
  }

  /**
   * 여러 파라미터 한 번에 추가/수정
   */
  setMany(params: Record<string, string | number | boolean>): this {
    Object.assign(this.params, params);
    return this;
  }

  build(): string {
    if (!this.base) {
      throw new Error("Base URL이 없습니다.");
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
