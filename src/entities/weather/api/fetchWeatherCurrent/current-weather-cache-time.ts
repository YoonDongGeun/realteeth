import { localDayjs } from "@shared/lib";

/**
 * 현재 날씨 캐시 만료 시간 계산
 *
 * 기상청 초단기실황 API 특성:
 * - 매시 정각(HH:00) 데이터가 10분 후(HH:10)부터 제공됨
 * - 예: 03:00 데이터는 03:10부터 조회 가능
 * - 따라서 03:00~03:09 구간에는 02:00 데이터를 사용
 *
 * 캐시 전략:
 * - XX:00~XX:09: 다음 XX:10까지 캐시 (이전 시간 데이터 사용 중)
 * - XX:10~XX:59: 다음 10분 단위 시점까지 캐시
 */
export function getSecondsUntilNextTenMinutes(): number {
  const now = localDayjs();
  const currentMinute = now.minute();
  const currentSecond = now.second();

  // XX:00~XX:09 구간: 다음 10분(XX:10)까지 캐시
  if (currentMinute < 10) {
    const secondsUntilTen = (10 - currentMinute) * 60 - currentSecond;
    return secondsUntilTen;
  }

  // XX:10 이후: 다음 10분 단위(20, 30, 40, 50, 00)까지 캐시
  const nextTenMinuteMark = Math.ceil((currentMinute + 1) / 10) * 10;

  if (nextTenMinuteMark === 60) {
    // 다음 시간 00분까지
    const secondsUntilNextHour = (60 - currentMinute) * 60 - currentSecond;
    return secondsUntilNextHour;
  } else {
    // 같은 시간 내 다음 10분 단위까지
    const minutesUntilNext = nextTenMinuteMark - currentMinute;
    const secondsUntilNext = minutesUntilNext * 60 - currentSecond;
    return secondsUntilNext;
  }
}
