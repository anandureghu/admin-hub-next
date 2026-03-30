import { useEffect, useRef, useCallback, useState } from "react";
import { FileText, Loader2, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useReceiptsQuery } from "../hooks/useReceiptsQuery";
import { ReceiptCard } from "./ReceiptCard";
import { UserMultiSelect } from "@/components/UserMultiSelect"; // Adjust path if needed
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReceiptFilters } from "../schemas/receipt.schema";

export default function Receipts() {
  // --- States for Filters ---
  const [search, setSearch] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [statusFilter, setStatusFilter] = useState<ReceiptFilters["status"]>("all");
  
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // --- 1. Fetch Users for Dropdown ---
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

  // --- 2. Fetch Receipts (Hook handles Infinite Scroll + Filtering) ---
  const { 
    data, 
    isLoading, 
    isFetchingNextPage, 
    fetchNextPage, 
    hasNextPage 
  } = useReceiptsQuery({ 
    search, 
    userIds: selectedUserIds, 
    dateRange, 
    status: statusFilter 
  });

  // Flatten the pages array into a single list of receipts
  const receipts = data?.pages.flatMap((page) => page.data) ?? [];

  // --- 3. Intersection Observer for Infinite Scroll ---
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      // Trigger fetch when sentinel comes into view inside the scrolling container
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
      root: null, // Uses the closest scrollable ancestor (our flex-1 div below)
      rootMargin: "200px", 
      threshold: 0,
    });
    
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    // Outer container: Flex column, hiding overflow to prevent page scrolling
    <div className="flex flex-col overflow-hidden">
      
      {/* --- STATIC TOP SECTION (Header + Filters) --- */}
      <div className="shrink-0 space-y-6 pb-6 pl-1 border-b border-border/40">
        <div>
          <h1 className="page-header">Receipts</h1>
          <p className="text-muted-foreground">Manage and track trip expenses</p>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col lg:flex-row items-center gap-4">
          
          {/* Search Bar */}
          <div className="relative w-full lg:w-72 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search description..."
              className="pl-10 bg-input border-border"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* User Multi-Select */}
          <div className="w-full lg:w-auto shrink-0">
            <UserMultiSelect
              users={users}
              selectedIds={selectedUserIds}
              onChange={setSelectedUserIds}
              isLoading={usersLoading}
            />
          </div>

          {/* Status Filter */}
          <Select 
            value={statusFilter} 
            onValueChange={(val) => setStatusFilter(val as ReceiptFilters["status"])}
          >
            <SelectTrigger className="w-full lg:w-40 bg-input border-border shrink-0">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="VERIFIED">Verified</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Picker */}
          <DatePickerWithRange
            date={dateRange}
            onDateChange={setDateRange}
            className="w-full lg:w-64 shrink-0"
          />
        </div>
      </div>
      {/* --- END STATIC TOP SECTION --- */}


      {/* --- SCROLLING LIST SECTION --- */}
      {/* flex-1 makes it fill remaining space, overflow-y-auto handles the scrolling */}
      <div className="flex-1 overflow-y-auto max-h-165 pt-6 pr-2 custom-scrollbar">
        
        {isLoading ? (
          // Loading Skeletons
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 pb-10">
            {Array(8).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        ) : receipts.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20 bg-card/30 border border-dashed border-border rounded-2xl text-muted-foreground">
            <FileText className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-base font-medium text-foreground">No receipts found</p>
            <p className="text-sm mt-1">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          // Receipts Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {receipts.map((receipt) => (
              <ReceiptCard key={receipt.id} receipt={receipt} />
            ))}
          </div>
        )}

        {/* Infinite Scroll Sentinel (Must stay inside the scrollable container!) */}
        <div ref={sentinelRef} className="py-8 flex justify-center items-center h-20">
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">Loading older receipts...</span>
            </div>
          )}
          {!hasNextPage && receipts.length > 0 && !isLoading && (
            <p className="text-sm text-muted-foreground italic">
              All receipts loaded.
            </p>
          )}
        </div>
      </div>
      {/* --- END SCROLLING LIST SECTION --- */}

    </div>
  );
}