import { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, Loader2, Download } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { useTripsQuery } from "../hooks/useTripsQuery";
import { useUsersQuery } from "../hooks/useUserQuery";
import type { TripListResponse as Trip } from "../schemas/trip.schema";
import { UserMultiSelect } from "@/components/UserMultiSelect";
import { DateRange } from "react-day-picker";
import { TripCard } from "./TripCard";
import { Button } from "@/components/ui/button";
import { ExportTripsDialog } from "./ExportTripsDialog";

export default function Trips() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const [exportModalOpen, setExportModalOpen] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const { data: usersData = [], isLoading: usersLoading } = useUsersQuery();

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTripsQuery(statusFilter, selectedUserIds, dateRange);

  const trips: Trip[] = data?.pages.flatMap((page) => page.data) ?? [];

  if (error) {
    toast.error("Failed to load trips");
  }

  const filteredTrips = trips.filter((trip) => {
    return (
      trip.vehicles?.vehicle_number.toLowerCase() ||
      trip.users?.name.toLowerCase() ||
      trip.users?.email.toLowerCase()
    );
  });

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

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
      <div className="shrink-0">
        <h1 className="page-header">Trips</h1>
        <p className="text-muted-foreground">Track all trip activities</p>
      </div>

      {/* Page Filters */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 shrink-0 pl-1 w-full">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto flex-1">
          <div className="w-full sm:w-auto">
            <UserMultiSelect
              users={usersData}
              selectedIds={selectedUserIds}
              onChange={setSelectedUserIds}
              isLoading={usersLoading}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-input border-border">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="STARTED">In Progress</SelectItem>
              <SelectItem value="ENDED">Completed</SelectItem>
            </SelectContent>
          </Select>

          <DatePickerWithRange
            date={dateRange}
            onDateChange={setDateRange}
            className="w-full lg:w-72 shrink-0"
          />
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={() => setExportModalOpen(true)}
                disabled={isLoading}
                className="w-full lg:w-auto shrink-0 bg-input border-border hover:bg-accent hover:text-accent-foreground lg:ml-auto"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[250px] text-center">
              <p>Configure and export trip data</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Trips List */}
      <div className="flex-1 min-h-0 space-y-4 overflow-y-auto pr-2 pb-4 custom-scrollbar">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading trips...
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="stat-card text-center py-12">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {statusFilter !== "all" || selectedUserIds.length > 0 || dateRange
                ? "No trips match your filters"
                : "No trips recorded yet. Trips will appear here when employees start tracking."}
            </p>
          </div>
        ) : (
          filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))
        )}

        <div ref={sentinelRef} className="py-4 flex justify-center">
          {isFetchingNextPage && (
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          )}
          {!hasNextPage && trips.length > 0 && !isLoading && (
            <p className="text-sm text-muted-foreground">All trips loaded</p>
          )}
        </div>
      </div>

      <ExportTripsDialog
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        initialStatus={statusFilter}
        initialUserIds={selectedUserIds}
        initialDateRange={dateRange}
        usersData={usersData}
        usersLoading={usersLoading}
      />
    </div>
  );
}