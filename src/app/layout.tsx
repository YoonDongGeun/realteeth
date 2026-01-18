import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers/providers";
import { PropsWithChildren, ReactNode } from "react";
import { AddressSearchInput } from "@features/search-address";
import { CurrentLocationSummaryCard, FavoriteAddressWeatherList } from "@widgets/favorite-address-weather-list";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "날씨 앱",
  description: "날씨 앱",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  "use cache";
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <GlobalLayout>{children}</GlobalLayout>
        </Providers>
      </body>
    </html>
  );
}

const GlobalLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex min-h-screen justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-7xl flex-col items-center py-10 px-6 bg-white dark:bg-black sm:items-start gap-8">
        <Header title="Weather App" content={<AddressSearchInput placeholder="도시, 구, 동으로 검색" />} />

        <GridColumn>
          {/* 왼쪽 */}
          <MainContentLayout>{children}</MainContentLayout>
          {/* 오른쪽 */}
          <SideContentLayout>
            <CurrentLocationSummaryCard />
            <FavoriteAddressWeatherList />
          </SideContentLayout>
        </GridColumn>
      </main>
    </div>
  );
};

type HeaderProps = {
  title: string;
  content: ReactNode;
};

const Header = ({ title, content }: HeaderProps) => (
  <div className="w-full max-w-2xl space-y-4">
    <div className="flex items-center justify-between">
      <Link href={"/"} prefetch={false}>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 ">{title}</h1>
      </Link>
    </div>
    <div className="w-full relative z-20">{content}</div>
  </div>
);

const MainContentLayout = ({ children }: PropsWithChildren) => (
  <div className="w-full lg:col-span-2 space-y-6 order-1 lg:order-1">{children}</div>
);

const SideContentLayout = ({ children }: PropsWithChildren) => (
  <div className="w-full h-full lg:col-span-1 border-t pt-8 lg:pt-0 lg:border-t-0 lg:border-l lg:pl-10 border-zinc-100 dark:border-zinc-800 order-1 lg:order-2">
    <div className="lg:sticky lg:top-10 space-y-4">{children}</div>
  </div>
);

const GridColumn = ({ children }: PropsWithChildren) => (
  <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">{children}</div>
);
