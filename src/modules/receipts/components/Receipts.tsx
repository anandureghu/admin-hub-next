import { useEffect, useRef, useCallback, useState } from "react";
import { FileText, Loader2, Search } from "lucide-react";
import { useReceiptsQuery } from "../hooks/useReceiptsQuery";
import { ReceiptCard } from "./ReceiptCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

export default function Receipts() {
  const [search, setSearch] = useState("");
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = 
    useReceiptsQuery({ search });

  const receipts = data?.pages.flatMap((page) => page.data) ?? [];

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { rootMargin: "200px" });
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="page-header">Receipts</h1>
          <p className="text-muted-foreground">Manage and track trip expenses</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search description..." 
            className="pl-10" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-xl" />)}
        </div>
      ) : receipts.length === 0 ? (
        <div className="text-center py-20 bg-card border border-dashed rounded-2xl">
          <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">No receipts found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {receipts.map((receipt) => <ReceiptCard key={receipt.id} receipt={receipt} />)}
        </div>
      )}

      <div ref={sentinelRef} className="py-10 flex justify-center">
        {isFetchingNextPage && <Loader2 className="w-6 h-6 animate-spin text-primary" />}
      </div>
    </div>
  );
}