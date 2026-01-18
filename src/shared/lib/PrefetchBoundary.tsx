import { dehydrate, HydrationBoundary, QueryClient, UseQueryOptions } from "@tanstack/react-query";

type Prefetchable<T = unknown> =
  | UseQueryOptions<T, unknown, T, readonly unknown[]>
  | UseQueryOptions<T, unknown, T, readonly unknown[]>[];
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
