import { KOREA_DISTRICTS_DATA, ParcelAddress } from "@shared/model";

import { WeatherDetail } from "@widgets/weather-detail";

type Params = {
  q: string | undefined;
};

type Props = { searchParams: Promise<Params> };

const PARCEL_ADDRESS_SET = new Set(KOREA_DISTRICTS_DATA);
export default async function Search({ searchParams }: Props) {
  const q = (await searchParams).q;
  if (isInValidQuery(q)) return <NO_WEATHER_DETAIL />;

  return <WeatherDetail address={q} />;
}

const isInValidQuery = (q?: string): q is undefined => {
  return !q || !PARCEL_ADDRESS_SET.has(q);
};

function NO_WEATHER_DETAIL() {
  return (
    <div className="w-full text-center">
      <h2>찾을 수 없는 지역입니다.</h2>
      <p>정확한 지역을 입력해주세요.</p>
    </div>
  );
}
