import { getBaseTimeForCurrentWeather } from "./weatherService.server";

/**
 * API 데이터 연동을 위한 핵심 로직 체크
 */

describe("getBaseTimeForCurrentWeather - 기상청 API 업데이트 시간 반영", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("정각~9분 사이 (데이터 미반영 구간)", () => {
    it("00:05 → 전날 23:50 데이터 반환", () => {
      // 2026-01-16 00:05:00
      jest.setSystemTime(new Date("2026-01-16T00:05:00+09:00"));

      const result = getBaseTimeForCurrentWeather();

      expect(result).toEqual({
        date: "20260115", // 전날
        time: "2350",
      });
    });

    it("14:00 → 13:50 데이터 반환", () => {
      // 2026-01-16 14:00:00
      jest.setSystemTime(new Date("2026-01-16T14:00:00+09:00"));

      const result = getBaseTimeForCurrentWeather();

      expect(result).toEqual({
        date: "20260116",
        time: "1350",
      });
    });

    it("14:09 → 13:50 데이터 반환", () => {
      // 2026-01-16 14:09:59
      jest.setSystemTime(new Date("2026-01-16T14:09:59+09:00"));

      const result = getBaseTimeForCurrentWeather();

      expect(result).toEqual({
        date: "20260116",
        time: "1350",
      });
    });

    it("01:05 → 00:50 데이터 반환", () => {
      // 2026-01-16 01:05:00
      jest.setSystemTime(new Date("2026-01-16T01:05:00+09:00"));

      const result = getBaseTimeForCurrentWeather();

      expect(result).toEqual({
        date: "20260116",
        time: "0050",
      });
    });
  });

  describe("10분 이후 (데이터 반영 완료)", () => {
    it("14:10 → 14:10 데이터 반환", () => {
      // 2026-01-16 14:10:00
      jest.setSystemTime(new Date("2026-01-16T14:10:00+09:00"));

      const result = getBaseTimeForCurrentWeather();

      expect(result).toEqual({
        date: "20260116",
        time: "1410",
      });
    });

    it("14:15 → 14:15 데이터 반환", () => {
      // 2026-01-16 14:15:00
      jest.setSystemTime(new Date("2026-01-16T14:15:00+09:00"));

      const result = getBaseTimeForCurrentWeather();

      expect(result).toEqual({
        date: "20260116",
        time: "1415",
      });
    });

    it("14:59 → 14:59 데이터 반환", () => {
      // 2026-01-16 14:59:59
      jest.setSystemTime(new Date("2026-01-16T14:59:59+09:00"));

      const result = getBaseTimeForCurrentWeather();

      expect(result).toEqual({
        date: "20260116",
        time: "1459",
      });
    });
  });
});
