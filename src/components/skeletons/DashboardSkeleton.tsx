import { Skeleton } from "@/components/ui/skeleton"

export const DashboardSkeleton = () => {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center pb-6 border-b border-border/40">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64 bg-primary/10" />
                    <Skeleton className="h-4 w-96 bg-muted" />
                </div>
                <Skeleton className="h-10 w-32 rounded-lg bg-primary/10" />
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-card/50 border border-border/50 space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20 bg-muted" />
                                <Skeleton className="h-8 w-16 bg-primary/20" />
                            </div>
                            <Skeleton className="h-10 w-10 rounded-lg bg-primary/10" />
                        </div>
                        <Skeleton className="h-2 w-full rounded-full bg-muted" />
                    </div>
                ))}
            </div>

            {/* Content Area Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart/Feed Area */}
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-[300px] w-full rounded-2xl bg-card/30" />
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-24 w-full rounded-xl bg-card/20" />
                        ))}
                    </div>
                </div>

                {/* Sidebar/Suggestions Area */}
                <div className="space-y-6">
                    <Skeleton className="h-[400px] w-full rounded-2xl bg-card/30" />
                </div>
            </div>
        </div>
    )
}
