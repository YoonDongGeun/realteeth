"use client";
import { useLocationStore } from "@shared/model";
import { IconButton, Text } from "@shared/ui";
import { WeatherDetailCSR } from "@widgets/weather-detail";
import { MdGpsFixed } from "react-icons/md";

export default function Home() {
  const { location, _rehydrated, isFetchTried, fetchGPSLocation, isGpsRefreshing } = useLocationStore();
  const notReady = _rehydrated || !isFetchTried || isGpsRefreshing;
  const showAddress = notReady ? "위치 찾는중..." : location?.address || "서울특별시";
  return (
    <>
      <Header
        displayName={notReady ? "위치 찾는중..." : showAddress}
        onRefresh={fetchGPSLocation}
        isRefreshing={isGpsRefreshing}
      />
      {notReady ? <WeatherDetailCSR.Skeleton /> : <WeatherDetailCSR address={showAddress} />}
    </>
  );
}

const Header = ({
  displayName,
  onRefresh,
  isRefreshing,
}: {
  displayName: string;
  onRefresh: () => Promise<void>;
  isRefreshing: boolean;
}) => {
  const handleRefresh = () => {
    onRefresh();
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <IconButton
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="위치 새로고침"
        title="위치 새로고침"
        icon={MdGpsFixed}
        iconClassName={`${isRefreshing ? "animate-pulse text-primary-700" : ""}`}
      />
      <Text variant="h5" weight="semibold">
        현재위치 : {displayName}
      </Text>
    </div>
  );
};
