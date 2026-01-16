import { KOREA_DISTRICTS_DATA } from "@entities/city";

import { geoCode } from "./geoCode.server";

describe("geoCode", () => {
  /**
   * 20500개 데이터 테스트. 오래걸림!!
   * 최근 테스트 결과 : 608초, 조회당 29.6ms
   */
  it.skip("KOREA_DISTRICTS_DATA 전체 좌표 변환 성공률 100%", () => {
    const start = performance.now();
    const failedAddresses: string[] = [];
    for (const address of KOREA_DISTRICTS_DATA) {
      const coordinate = geoCode(address);
      try {
        expect(coordinate).toHaveProperty("lat");
        expect(coordinate).toHaveProperty("lng");
      } catch {
        failedAddresses.push(address);
      }
    }

    const total = KOREA_DISTRICTS_DATA.length;
    const failCount = failedAddresses.length;
    const successCount = total - failCount;
    const successRate = (successCount / total) * 100;
    for (const address of failedAddresses) {
      console.log(`검색 실패 : ${address}`);
    }

    console.log(`좌표 변환율: ${successRate.toFixed(2)}% (${successCount}/${total})`);
    const end = performance.now();
    const timeTakenInMs = end - start;
    console.log(`걸린 시간: ${(timeTakenInMs / 1000).toFixed(2)} s`);

    const avgPerQueryMs = timeTakenInMs / total;
    console.log(`조회당 시간: ${avgPerQueryMs.toFixed(4)} ms`);

    expect(failCount).toBe(0);
  });

  describe("계층별 좌표 조회", () => {
    it("시/도만 있는 경우 - 서울특별시", () => {
      const coordinate = geoCode("서울특별시");

      expect(coordinate).toHaveProperty("lat");
      expect(coordinate.lat).toBe(37.5635694444444);
      expect(coordinate).toHaveProperty("lng");
      expect(coordinate.lng).toBe(126.980008333333);
    });

    it("시/도 + 구/군 - 서울특별시 종로구", () => {
      const coordinate = geoCode("서울특별시 종로구");

      expect(coordinate).toHaveProperty("lat");
      expect(coordinate).toHaveProperty("lng");
      expect(coordinate.lat).toBe(37.5703777777777);
      expect(coordinate.lng).toBe(126.981641666666);
    });

    it("시/도 + 구/군 + 동/읍/면 - 서울특별시 종로구 청운효자동", () => {
      const coordinate = geoCode("서울특별시 종로구 청운효자동");

      expect(coordinate).toHaveProperty("lat");
      expect(coordinate).toHaveProperty("lng");
      expect(coordinate.lat).toBe(37.5841367);
      expect(coordinate.lng).toBe(126.9706519);
    });
  });

  describe("존재하지 않는 위치", () => {
    it("존재하지 않는 시/도는 에러를 발생시켜야 함", () => {
      expect(() => geoCode("존재하지않는시")).toThrow("없는 주소입니다.");
    });
  });
});
