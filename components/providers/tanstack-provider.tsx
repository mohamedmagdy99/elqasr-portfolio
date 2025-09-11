"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider,DehydratedState,HydrationBoundary } from "@tanstack/react-query";

interface TanstackProviderProps {
    children: ReactNode;
}
export const TanstackProvider = ({
                                     children,
                                     dehydratedState,
                                 }: TanstackProviderProps & { dehydratedState?: unknown }) => {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <HydrationBoundary state={dehydratedState as DehydratedState | null | undefined}>
                {children}
            </HydrationBoundary>
        </QueryClientProvider>
    );
};


