import { localDayjs } from "@shared/lib";

/**
 * 단기예보 캐시 만료 시간 계산
 * 기상청 단기예보는 02, 05, 08, 11, 14, 17, 20, 23시에 발표되고 각 발표 시간 + 10분 후 조회 가능
 * 다음 발표 시간 + 10분까지 캐시 유지
 */
export function getSecondsUntilNextDailyWeatherUpdate(): number {
  const now = localDayjs();
  const currentHour = now.hour();
  const currentMinute = now.minute();

  const baseHours = [2, 5, 8, 11, 14, 17, 20, 23];

  // 다음 발표 시간 찾기
  let nextBaseHour = baseHours.find((h) => h > currentHour || (h === currentHour && currentMinute < 10));

  // 오늘 안에 다음 발표 시간이 없으면 내일 02시
  if (!nextBaseHour) {
    nextBaseHour = 2;
    const tomorrow = now.add(1, "day").hour(2).minute(10).second(0);
    return tomorrow.diff(now, "second");
  }

  // 다음 발표 시간 + 10분까지의 시간 계산
  const nextUpdate = now.hour(nextBaseHour).minute(10).second(0);

  // 이미 지나갔으면 다음 발표 시간으로
  if (nextUpdate.isBefore(now)) {
    const nextIndex = baseHours.indexOf(nextBaseHour) + 1;
    if (nextIndex < baseHours.length) {
      const afterNextHour = baseHours[nextIndex];
      const afterNextUpdate = now.hour(afterNextHour).minute(10).second(0);
      return afterNextUpdate.diff(now, "second");
    } else {
      // 내일 02:10
      const tomorrow = now.add(1, "day").hour(2).minute(10).second(0);
      return tomorrow.diff(now, "second");
    }
  }

  return nextUpdate.diff(now, "second");
}
