import { useEffect, useRef, useCallback } from "react";
import { AlertOctagon, Loader2 } from "lucide-react";
import { useAccidentsQuery } from "../hooks/useAccidentsQuery";
import { AccidentCard } from "./AccidentCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Accidents() {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useAccidentsQuery();

  const accidents = data?.pages.flatMap((page) => page.data) ?? [];

  // Intersection Observer Callback
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  // Set up the observer
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "200px", // Trigger fetch 200px before user reaches bottom
      threshold: 0,
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-header">Accident Reports</h1>
        <p className="text-muted-foreground">Monitor and review incident logs</p>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)
        ) : accidents.length === 0 ? (
          <div className="text-center py-20 bg-card border border-dashed rounded-2xl">
            <AlertOctagon className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No accidents reported yet.</p>
          </div>
        ) : (
          accidents.map((accident) => (
            <AccidentCard key={accident.id} accident={accident} />
          ))
        )}

        {/* Sentinel Element for Infinite Scroll */}
        <div ref={sentinelRef} className="py-8 flex justify-center items-center">
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">Loading more reports...</span>
            </div>
          )}
          {!hasNextPage && accidents.length > 0 && (
            <p className="text-sm text-muted-foreground italic">
              All incident reports have been loaded.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}