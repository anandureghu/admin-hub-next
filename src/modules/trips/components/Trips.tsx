import { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, Calendar, Clock, Loader2 } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { useTripsQuery } from "../hooks/useTripsQuery";
import { useUsersQuery } from "../hooks/useUsersQuery";
import type { TripListResponse as Trip } from "../schemas/trip.schema";
import { UserMultiSelect } from "@/components/userMultiSelect";
import { DateRange } from "react-day-picker";

export default function Trips() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
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

  // Client-side search filter only (status + user filtering is server-side)
  const filteredTrips = trips.filter((trip) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      trip.vehicles?.vehicle_number.toLowerCase().includes(q) ||
      trip.users?.name.toLowerCase().includes(q) ||
      trip.users?.email.toLowerCase().includes(q)
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

  function formatTime(timestamp: string | null) {
    if (!timestamp) return "—";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function calculateDistance(startKm: number | null, endKm: number | null) {
    if (startKm === null || endKm === null) return "—";
    return `${endKm - startKm} km`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-header">Trips</h1>
        <p className="text-muted-foreground">Track all trip activities</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">

        <UserMultiSelect
          users={usersData}
          selectedIds={selectedUserIds}
          onChange={setSelectedUserIds}
          isLoading={usersLoading}
        />

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-input border-border">
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
          className="w-64"
        />
      </div>

      {/* Trips List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading trips...
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="stat-card text-center py-12">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchQuery || statusFilter !== "all" || selectedUserIds.length > 0 || dateRange
                ? "No trips match your filters"
                : "No trips recorded yet. Trips will appear here when employees start tracking."}
            </p>
          </div>
        ) : (
          filteredTrips.map((trip) => (
            <div key={trip.id} className="stat-card animate-fade-in">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="stat-icon">
                    <MapPin className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-foreground">Trip</h3>
                      <StatusBadge
                        status={trip.status === "STARTED" ? "started" : "ended"}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {trip.vehicles?.vehicle_number || "No vehicle"} •{" "}
                      {trip.vehicles?.vehicle_type || ""} •{" "}
                      {trip.users?.name || "Unknown user"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{new Date(trip.trip_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {formatTime(trip.start_time)} -{" "}
                      {formatTime(trip.end_time)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Distance:</span>
                    <span className="font-medium">
                      {calculateDistance(trip.start_km, trip.end_km)}
                    </span>
                  </div>
                </div>
              </div>

              {(trip.start_km || trip.end_km) && (
                <div className="mt-4 pt-4 border-t border-border flex gap-6 text-sm">
                  <div>
                    <span className="text-muted-foreground">Start KM:</span>{" "}
                    <span className="font-medium">{trip.start_km ?? "—"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">End KM:</span>{" "}
                    <span className="font-medium">{trip.end_km ?? "—"}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {/* Sentinel + loading spinner */}
        <div ref={sentinelRef} className="py-4 flex justify-center">
          {isFetchingNextPage && (
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          )}
          {!hasNextPage && trips.length > 0 && !isLoading && (
            <p className="text-sm text-muted-foreground">All trips loaded</p>
          )}
        </div>
      </div>
    </div>
  );
}