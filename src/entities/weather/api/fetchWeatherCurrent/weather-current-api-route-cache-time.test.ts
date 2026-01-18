import { getSecondsUntilNextTenMinutes } from "./current-weather-cache-time";

describe("getSecondsUntilNextTenMinutes", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("XX:00~XX:09 구간 (데이터 업데이트 대기 중)", () => {
    it("03:00:00 -> 03:10:00까지 600초", () => {
      jest.setSystemTime(new Date("2026-01-18T03:00:00"));
      const result = getSecondsUntilNextTenMinutes();
      expect(result).toBe(600); // 10분 = 600초
    });

    it("03:05:00 -> 03:10:00까지 300초", () => {
      jest.setSystemTime(new Date("2026-01-18T03:05:00"));
      const result = getSecondsUntilNextTenMinutes();
      expect(result).toBe(300); // 5분 = 300초
    });

    it("03:09:30 -> 03:10:00까지 30초", () => {
      jest.setSystemTime(new Date("2026-01-18T03:09:30"));
      const result = getSecondsUntilNextTenMinutes();
      expect(result).toBe(30);
    });

    it("03:09:59 -> 03:10:00까지 1초", () => {
      jest.setSystemTime(new Date("2026-01-18T03:09:59"));
      const result = getSecondsUntilNextTenMinutes();
      expect(result).toBe(1);
    });
  });

  describe("XX:10~XX:19 구간 (다음 20분까지)", () => {
    it("03:10:00 -> 03:20:00까지 600초", () => {
      jest.setSystemTime(new Date("2026-01-18T03:10:00"));
      const result = getSecondsUntilNextTenMinutes();
      expect(result).toBe(600);
    });

    it("03:15:00 -> 03:20:00까지 300초", () => {
      jest.setSystemTime(new Date("2026-01-18T03:15:00"));
      const result = getSecondsUntilNextTenMinutes();
      expect(result).toBe(300);
    });

    it("03:19:45 -> 03:20:00까지 15초", () => {
      jest.setSystemTime(new Date("2026-01-18T03:19:45"));
      const result = getSecondsUntilNextTenMinutes();
      expect(result).toBe(15);
    });
  });

  describe("XX:20~XX:29 구간 (다음 30분까지)", () => {
    it("03:20:00 -> 03:30:00까지 600초", () => {
      jest.setSystemTime(new Date("2026-01-18T03:20:00"));
      const result = getSecondsUntilNextTenMinutes();
      expect(result).toBe(600);
    });

    it("03:25:30 -> 03:30:00까지 270초", () => {
      jest.setSystemTime(new Date("2026-01-18T03:25:30"));
      const result = getSecondsUntilNextTenMinutes();
      expect(result).toBe(270);
    });
  });

  describe("XX:30~XX:39 구간 (다음 40분까지)", () => {
    it("03:30:00 -> 03:40:00까지 600초", () => {
      jest.setSystemTime(new Date("2026-01-18T03:30:00"));
      const result = getSecondsUntilNextTenMinutes();
      expect(result).toBe(600);
    });

    it("03:35:15 -> 03:40:00까지 285초", () => {
      jest.setSystemTime(new Date("2026-01-18T03:35:15"));
      const result = getSecondsUntilNextTenMinutes();
      expect(result).toBe(285);
    });
  });

  describe("XX:40~XX:49 구간 (다음 50분까지)", () => {
    it("03:40:00 -> 03:50:00까지 600초", () => {
      jest.setSystemTime(new Date("2026-01-18T03:40:00"));
      const result = getSecondsUntilNextTenMinutes();
      expect(result).toBe(600);
    });

    it("03:45:20 -> 03:50:00까지 280초", () => {
      jest.setSystemTime(new Date("2026-01-18T03:45:20"));
      const result = getSecondsUntilNextTenMinutes();
      expect(result).toBe(280);
    });
  });

  describe("XX:50~XX:59 구간 (다음 시간 00분까지)", () => {
    it("03:50:00 -> 04:00:00까지 600초", () => {
      jest.setSystemTime(new Date("2026-01-18T03:50:00"));
      const result = getSecondsUntilNextTenMinutes();
      expect(result).toBe(600);
    });

    it("03:55:00 -> 04:00:00까지 300초", () => {
      jest.setSystemTime(new Date("2026-01-18T03:55:00"));
      const result = getSecondsUntilNextTenMinutes();
      expect(result).toBe(300);
    });

    it("03:59:59 -> 04:00:00까지 1초", () => {
      jest.setSystemTime(new Date("2026-01-18T03:59:59"));
      const result = getSecondsUntilNextTenMinutes();
      expect(result).toBe(1);
    });
  });

  describe("경계값 테스트", () => {
    it("23:59:59 -> 다음날 00:00:00까지 1초", () => {
      jest.setSystemTime(new Date("2026-01-18T23:59:59"));
      const result = getSecondsUntilNextTenMinutes();
      expect(result).toBe(1);
    });

    it("00:00:00 -> 00:10:00까지 600초", () => {
      jest.setSystemTime(new Date("2026-01-18T00:00:00"));
      const result = getSecondsUntilNextTenMinutes();
      expect(result).toBe(600);
    });

    it("00:09:59 -> 00:10:00까지 1초", () => {
      jest.setSystemTime(new Date("2026-01-18T00:09:59"));
      const result = getSecondsUntilNextTenMinutes();
      expect(result).toBe(1);
    });

    it("00:10:00 -> 00:20:00까지 600초", () => {
      jest.setSystemTime(new Date("2026-01-18T00:10:00"));
      const result = getSecondsUntilNextTenMinutes();
      expect(result).toBe(600);
    });
  });

  describe("랜덤 시간대 검증", () => {
    it("14:23:47 -> 14:30:00까지 373초", () => {
      jest.setSystemTime(new Date("2026-01-18T14:23:47"));
      const result = getSecondsUntilNextTenMinutes();
      expect(result).toBe(373); // (30-23)*60 - 47 = 7*60 - 47 = 373
    });

    it("09:07:22 -> 09:10:00까지 158초", () => {
      jest.setSystemTime(new Date("2026-01-18T09:07:22"));
      const result = getSecondsUntilNextTenMinutes();
      expect(result).toBe(158); // (10-7)*60 - 22 = 180 - 22 = 158
    });

    it("18:52:11 -> 19:00:00까지 469초", () => {
      jest.setSystemTime(new Date("2026-01-18T18:52:11"));
      const result = getSecondsUntilNextTenMinutes();
      expect(result).toBe(469); // (60-52)*60 - 11 = 480 - 11 = 469
    });
  });
});
