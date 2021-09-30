import { QueryClient } from 'react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 2, //default stale time === 2 minutes
            // staleTime: 0,
        },
    },
});
