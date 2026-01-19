import { dehydrate, HydrationBoundary, QueryClient, UseQueryOptions } from "@tanstack/react-query";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QueryOption = UseQueryOptions<any, any, unknown, any[]>;

type Prefetchable = QueryOption;

type Props = {
  prefetchOption: Prefetchable;
  children: React.ReactNode;
};

export async function PrefetchBoundary({ prefetchOption, children }: Props) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(prefetchOption);

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
