import { getSecondsUntilNextDailyWeatherUpdate } from "./current-weather-cache-time";

describe("getSecondsUntilNextDailyWeatherUpdate", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("02시 발표 (02:10 데이터 제공)", () => {
    it("01:30:00 -> 02:10:00까지 2400초", () => {
      jest.setSystemTime(new Date("2026-01-18T01:30:00"));
      const result = getSecondsUntilNextDailyWeatherUpdate();
      expect(result).toBe(2400); // 40분 = 2400초
    });

    it("02:00:00 -> 02:10:00까지 600초", () => {
      jest.setSystemTime(new Date("2026-01-18T02:00:00"));
      const result = getSecondsUntilNextDailyWeatherUpdate();
      expect(result).toBe(600); // 10분 = 600초
    });

    it("02:09:59 -> 02:10:00까지 1초", () => {
      jest.setSystemTime(new Date("2026-01-18T02:09:59"));
      const result = getSecondsUntilNextDailyWeatherUpdate();
      expect(result).toBe(1);
    });

    it("02:10:00 -> 05:10:00까지 10800초", () => {
      jest.setSystemTime(new Date("2026-01-18T02:10:00"));
      const result = getSecondsUntilNextDailyWeatherUpdate();
      expect(result).toBe(10800); // 3시간 = 10800초
    });
  });

  describe("05시 발표 (05:10 데이터 제공)", () => {
    it("04:30:00 -> 05:10:00까지 2400초", () => {
      jest.setSystemTime(new Date("2026-01-18T04:30:00"));
      const result = getSecondsUntilNextDailyWeatherUpdate();
      expect(result).toBe(2400);
    });

    it("05:05:00 -> 05:10:00까지 300초", () => {
      jest.setSystemTime(new Date("2026-01-18T05:05:00"));
      const result = getSecondsUntilNextDailyWeatherUpdate();
      expect(result).toBe(300);
    });

    it("05:10:00 -> 08:10:00까지 10800초", () => {
      jest.setSystemTime(new Date("2026-01-18T05:10:00"));
      const result = getSecondsUntilNextDailyWeatherUpdate();
      expect(result).toBe(10800);
    });
  });

  describe("08시 발표 (08:10 데이터 제공)", () => {
    it("07:45:30 -> 08:10:00까지 1470초", () => {
      jest.setSystemTime(new Date("2026-01-18T07:45:30"));
      const result = getSecondsUntilNextDailyWeatherUpdate();
      expect(result).toBe(1470); // 24분 30초 = 1470초
    });

    it("08:09:00 -> 08:10:00까지 60초", () => {
      jest.setSystemTime(new Date("2026-01-18T08:09:00"));
      const result = getSecondsUntilNextDailyWeatherUpdate();
      expect(result).toBe(60);
    });

    it("08:10:01 -> 11:10:00까지 10799초", () => {
      jest.setSystemTime(new Date("2026-01-18T08:10:01"));
      const result = getSecondsUntilNextDailyWeatherUpdate();
      expect(result).toBe(10799);
    });
  });

  describe("11시 발표 (11:10 데이터 제공)", () => {
    it("10:00:00 -> 11:10:00까지 4200초", () => {
      jest.setSystemTime(new Date("2026-01-18T10:00:00"));
      const result = getSecondsUntilNextDailyWeatherUpdate();
      expect(result).toBe(4200); // 1시간 10분 = 4200초
    });

    it("11:10:00 -> 14:10:00까지 10800초", () => {
      jest.setSystemTime(new Date("2026-01-18T11:10:00"));
      const result = getSecondsUntilNextDailyWeatherUpdate();
      expect(result).toBe(10800);
    });
  });

  describe("14시 발표 (14:10 데이터 제공)", () => {
    it("13:20:00 -> 14:10:00까지 3000초", () => {
      jest.setSystemTime(new Date("2026-01-18T13:20:00"));
      const result = getSecondsUntilNextDailyWeatherUpdate();
      expect(result).toBe(3000); // 50분 = 3000초
    });

    it("14:10:00 -> 17:10:00까지 10800초", () => {
      jest.setSystemTime(new Date("2026-01-18T14:10:00"));
      const result = getSecondsUntilNextDailyWeatherUpdate();
      expect(result).toBe(10800);
    });
  });

  describe("17시 발표 (17:10 데이터 제공)", () => {
    it("16:30:00 -> 17:10:00까지 2400초", () => {
      jest.setSystemTime(new Date("2026-01-18T16:30:00"));
      const result = getSecondsUntilNextDailyWeatherUpdate();
      expect(result).toBe(2400);
    });

    it("17:10:00 -> 20:10:00까지 10800초", () => {
      jest.setSystemTime(new Date("2026-01-18T17:10:00"));
      const result = getSecondsUntilNextDailyWeatherUpdate();
      expect(result).toBe(10800);
    });
  });

  describe("20시 발표 (20:10 데이터 제공)", () => {
    it("19:00:00 -> 20:10:00까지 4200초", () => {
      jest.setSystemTime(new Date("2026-01-18T19:00:00"));
      const result = getSecondsUntilNextDailyWeatherUpdate();
      expect(result).toBe(4200);
    });

    it("20:10:00 -> 23:10:00까지 10800초", () => {
      jest.setSystemTime(new Date("2026-01-18T20:10:00"));
      const result = getSecondsUntilNextDailyWeatherUpdate();
      expect(result).toBe(10800);
    });
  });

  describe("23시 발표 (23:10 데이터 제공)", () => {
    it("22:30:00 -> 23:10:00까지 2400초", () => {
      jest.setSystemTime(new Date("2026-01-18T22:30:00"));
      const result = getSecondsUntilNextDailyWeatherUpdate();
      expect(result).toBe(2400);
    });

    it("23:05:00 -> 23:10:00까지 300초", () => {
      jest.setSystemTime(new Date("2026-01-18T23:05:00"));
      const result = getSecondsUntilNextDailyWeatherUpdate();
      expect(result).toBe(300);
    });

    it("23:10:00 -> 내일 02:10:00까지 10800초 (3시간)", () => {
      jest.setSystemTime(new Date("2026-01-18T23:10:00"));
      const result = getSecondsUntilNextDailyWeatherUpdate();
      expect(result).toBe(10800); // 3시간 = 10800초
    });

    it("23:30:00 -> 내일 02:10:00까지 9600초 (2시간 40분)", () => {
      jest.setSystemTime(new Date("2026-01-18T23:30:00"));
      const result = getSecondsUntilNextDailyWeatherUpdate();
      expect(result).toBe(9600); // 2시간 40분 = 9600초
    });
  });

  describe("자정~02:10 구간 (내일 02시 발표 대기)", () => {
    it("00:00:00 -> 02:10:00까지 7800초", () => {
      jest.setSystemTime(new Date("2026-01-18T00:00:00"));
      const result = getSecondsUntilNextDailyWeatherUpdate();
      expect(result).toBe(7800); // 2시간 10분 = 7800초
    });

    it("01:00:00 -> 02:10:00까지 4200초", () => {
      jest.setSystemTime(new Date("2026-01-18T01:00:00"));
      const result = getSecondsUntilNextDailyWeatherUpdate();
      expect(result).toBe(4200); // 1시간 10분 = 4200초
    });

    it("01:59:59 -> 02:10:00까지 601초", () => {
      jest.setSystemTime(new Date("2026-01-18T01:59:59"));
      const result = getSecondsUntilNextDailyWeatherUpdate();
      expect(result).toBe(601);
    });
  });

  describe("경계값 테스트", () => {
    it("02:09:59 -> 02:10:00까지 1초", () => {
      jest.setSystemTime(new Date("2026-01-18T02:09:59"));
      const result = getSecondsUntilNextDailyWeatherUpdate();
      expect(result).toBe(1);
    });

    it("05:09:59 -> 05:10:00까지 1초", () => {
      jest.setSystemTime(new Date("2026-01-18T05:09:59"));
      const result = getSecondsUntilNextDailyWeatherUpdate();
      expect(result).toBe(1);
    });

    it("23:59:59 -> 내일 02:10:00까지 7801초 (2시간 10분 1초)", () => {
      jest.setSystemTime(new Date("2026-01-18T23:59:59"));
      const result = getSecondsUntilNextDailyWeatherUpdate();
      expect(result).toBe(7801); // 2시간 10분 1초 = 7801초
    });
  });

  describe("랜덤 시간대 검증", () => {
    it("03:27:14 -> 05:10:00까지 6166초", () => {
      jest.setSystemTime(new Date("2026-01-18T03:27:14"));
      const result = getSecondsUntilNextDailyWeatherUpdate();
      // 05:10:00 - 03:27:14 = 1시간 42분 46초 = 6166초
      expect(result).toBe(6166);
    });

    it("12:45:33 -> 14:10:00까지 5067초", () => {
      jest.setSystemTime(new Date("2026-01-18T12:45:33"));
      const result = getSecondsUntilNextDailyWeatherUpdate();
      // 14:10:00 - 12:45:33 = 1시간 24분 27초 = 5067초
      expect(result).toBe(5067);
    });

    it("21:18:47 -> 23:10:00까지 6673초", () => {
      jest.setSystemTime(new Date("2026-01-18T21:18:47"));
      const result = getSecondsUntilNextDailyWeatherUpdate();
      // 23:10:00 - 21:18:47 = 1시간 51분 13초 = 6673초
      expect(result).toBe(6673);
    });
  });
});
