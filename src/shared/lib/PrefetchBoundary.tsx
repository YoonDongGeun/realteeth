import { dehydrate, HydrationBoundary, QueryClient, UseQueryOptions } from "@tanstack/react-query";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QueryOption = UseQueryOptions<any, any, unknown, any[]>;

type Prefetchable = QueryOption;

type Props = {
  prefetchOptions: Prefetchable;
  children: React.ReactNode;
};

export async function PrefetchBoundary({ prefetchOptions, children }: Props) {
  const queryClient = new QueryClient();
  if (prefetchOptions instanceof Array) {
    await Promise.all(prefetchOptions.map((prefetchOption) => queryClient.prefetchQuery(prefetchOption)));
  } else {
    await queryClient.prefetchQuery(prefetchOptions);
  }
  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
