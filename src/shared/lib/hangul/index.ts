/**
 * 한글 초성 검색 유틸리티 (복합 자음 분해)
 */

const HANGUL_START = 0xac00; // '가'
const HANGUL_END = 0xd7a3; // '힣'
const JUNGSUNG_COUNT = 21;

const CHOSUNG_LIST = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

// 중성 모음 리스트 (필터링용)
const JUNGSUNG_LIST = [
  "ㅏ",
  "ㅐ",
  "ㅑ",
  "ㅒ",
  "ㅓ",
  "ㅔ",
  "ㅕ",
  "ㅖ",
  "ㅗ",
  "ㅘ",
  "ㅙ",
  "ㅚ",
  "ㅛ",
  "ㅜ",
  "ㅝ",
  "ㅞ",
  "ㅟ",
  "ㅠ",
  "ㅡ",
  "ㅢ",
  "ㅣ",
];

// 종성 리스트 (28개)
const JONGSUNG_LIST = [
  "",
  "ㄱ",
  "ㄲ",
  "ㄳ",
  "ㄴ",
  "ㄵ",
  "ㄶ",
  "ㄷ",
  "ㄹ",
  "ㄺ",
  "ㄻ",
  "ㄼ",
  "ㄽ",
  "ㄾ",
  "ㄿ",
  "ㅀ",
  "ㅁ",
  "ㅂ",
  "ㅄ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

// 복합 자음의 첫 자음 맵
const COMPLEX_CONSONANT_FIRST: Record<string, string> = {
  ㄳ: "ㄱ",
  ㄵ: "ㄴ",
  ㄶ: "ㄴ",
  ㄺ: "ㄹ",
  ㄻ: "ㄹ",
  ㄼ: "ㄹ",
  ㄽ: "ㄹ",
  ㄾ: "ㄹ",
  ㄿ: "ㄹ",
  ㅀ: "ㄹ",
  ㅄ: "ㅂ",
};

function decomposeHangul(char: string): { chosung: number; jungsung: number; jongsung: number } | null {
  const code = char.charCodeAt(0);
  if (code < HANGUL_START || code > HANGUL_END) {
    return null;
  }

  const syllableIndex = code - HANGUL_START;
  const jongsung = syllableIndex % 28;
  const jungsung = Math.floor((syllableIndex % (JUNGSUNG_COUNT * 28)) / 28);
  const chosung = Math.floor(syllableIndex / (JUNGSUNG_COUNT * 28));

  return { chosung, jungsung, jongsung };
}

/**
 * 초성, 중성, 종성 인덱스로 한글 문자 조합
 */
function composeHangul(chosung: number, jungsung: number, jongsung: number): string {
  const code = HANGUL_START + chosung * JUNGSUNG_COUNT * 28 + jungsung * 28 + jongsung;
  return String.fromCharCode(code);
}

export function normalizeHangul(query: string): string {
  if (!query) return query;

  const lastChar = query[query.length - 1];

  // 마지막 문자가 단독 초성이나 중성이면 제거
  if (CHOSUNG_LIST.includes(lastChar) || JUNGSUNG_LIST.includes(lastChar)) {
    return query.slice(0, -1);
  }

  // 마지막 문자가 완전한 한글이고 종성이 복합 자음이면 첫 자음만 남기기
  const decomposed = decomposeHangul(lastChar);
  if (decomposed && decomposed.jongsung > 0) {
    const jongsungChar = JONGSUNG_LIST[decomposed.jongsung];
    const firstConsonant = COMPLEX_CONSONANT_FIRST[jongsungChar];

    if (firstConsonant) {
      // 복합 자음이면 첫 자음으로 교체
      const firstConsonantIndex = JONGSUNG_LIST.indexOf(firstConsonant);
      const normalized = composeHangul(decomposed.chosung, decomposed.jungsung, firstConsonantIndex);
      return query.slice(0, -1) + normalized;
    }
  }

  return query;
}
