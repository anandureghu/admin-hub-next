import { useEffect, useRef, useCallback, useState } from "react";
import { AlertOctagon, Loader2, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAccidentsQuery } from "../hooks/useAccidentsQuery";
import { AccidentCard } from "./AccidentCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { UserMultiSelect } from "../../../components/UserMultiSelect";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { DateRange } from "react-day-picker";

export default function Accidents() {
  const [search, setSearch] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Fetch lightweight user list for the multi-select dropdown
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["users-dropdown"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, email")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  // Fetch accidents with applied filters
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useAccidentsQuery({ search, userIds: selectedUserIds, dateRange });

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
      rootMargin: "200px",
      threshold: 0,
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="flex flex-col h-full gap-6 overflow-hidden">
      <div className="flex flex-col gap-4 shrink-0">
        <div>
          <h1 className="page-header">Accident Reports</h1>
          <p className="text-muted-foreground">Monitor and review incident logs</p>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row pl-1 items-center gap-4">
          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search description..."
              className="pl-10 bg-input border-border"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* User Multi-Select */}
          <div className="w-full sm:w-auto">
            <UserMultiSelect
              users={users}
              selectedIds={selectedUserIds}
              onChange={setSelectedUserIds}
              isLoading={usersLoading}
            />
          </div>

          {/* Date Range Picker */}
          <DatePickerWithRange
            date={dateRange}
            onDateChange={setDateRange}
            className="w-full lg:w-72"
          />
        </div>
      </div>

      {/* Accidents List */}
      <div className="flex-1 min-h-0 space-y-4 overflow-y-auto pr-2 pb-4 custom-scrollbar">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)
        ) : accidents.length === 0 ? (
          <div className="text-center py-20 bg-card border border-dashed rounded-2xl">
            <AlertOctagon className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {search || selectedUserIds.length > 0 || dateRange
                ? "No accidents match your filters."
                : "No accidents reported yet."}
            </p>
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
          {!hasNextPage && accidents.length > 0 && !isLoading && (
            <p className="text-sm text-muted-foreground italic">
              All incident reports have been loaded.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}