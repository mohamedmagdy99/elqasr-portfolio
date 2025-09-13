// components/FeaturedProjectsWrapper.tsx
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import FeaturedProjects from "../FeaturedProjects/FeaturedProjects";
import { getAllProjects } from "@/server/Projects";

const FeaturedProjectsWrapper = async () => {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["project"],
        queryFn: () => getAllProjects({ page: 1, limit: 3 }).then(res => res.data),
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <FeaturedProjects />
        </HydrationBoundary>
    );
};

export default FeaturedProjectsWrapper;