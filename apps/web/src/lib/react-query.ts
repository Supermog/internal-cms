import type { DefaultOptions } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";

export const reactQueryDefaultOptions: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: true,
    retry: 0,
  },
  mutations: {
    retry: 0,
  },
};

export const queryClient = new QueryClient({
  defaultOptions: reactQueryDefaultOptions,
});
