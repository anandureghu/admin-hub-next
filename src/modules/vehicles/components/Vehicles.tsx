import { useCallback, useRef, useState } from "react";
import { Plus, Search, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import VehicleCard from "./VehicleCard";
import VehicleCardSkeleton from "./VehicleCardSkeleton";
import { Vehicle } from "../schemas/vehicle.schema";
import { useVehiclesQuery } from "../hooks/useVehiclesQuery";
import { useVehicleMutations } from "../hooks/useVehicleMutations";
import { VehicleDialog } from "./VehicleDialog";
import { DebouncedInput } from "@/components/ui/debounced-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Vehicles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } = useVehiclesQuery({
    search: searchQuery,
    status: statusFilter as "all" | "available" | "unavailable",
  });

  const { toggleVehicleStatus, isToggling } = useVehicleMutations();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const intersectionObserver = useRef<IntersectionObserver | null>(null);

  const lastVehicleRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetching || !hasNextPage) return;
      if (intersectionObserver.current) intersectionObserver.current.disconnect();
      intersectionObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) {
        intersectionObserver.current.observe(node);
      }
    },
    [isFetching, hasNextPage, fetchNextPage],
  );

  function handleOpenAddDialog() {
    setEditingVehicle(null);
    setDialogOpen(true);
  }

  const handleOpenEditDialog = useCallback((vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setDialogOpen(true);
  }, []);

  const vehicles = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="flex flex-col h-full gap-6 overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="page-header">Vehicles</h1>
          <p className="text-muted-foreground">Manage your Vehicles</p>
        </div>
        <Button onClick={handleOpenAddDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0 pl-1 w-full max-w-2xl">
        {/* Search */}
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <DebouncedInput
            placeholder="Search vehicles..."
            value={(searchQuery as string) ?? ""}
            onChange={(value) => setSearchQuery(value as string)}
            className="pl-10 bg-input border-border"
            debounce={400}
          />
        </div>

        {/* NEW: Status Dropdown */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40 bg-input border-border">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Vehicles</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="unavailable">Unavailable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 min-h-0 overflow-y-auto pr-2 pb-4 custom-scrollbar content-start">
        {isLoading &&
          Array.from({ length: 6 }).map((_, index) => (
            <VehicleCardSkeleton key={`init-skeleton-${index}`} />
          ))}

        {vehicles.map((vehicle, i) => {
          const isLast = vehicles.length === i + 1;

          return (
            <VehicleCard
              key={vehicle.id}
              ref={isLast ? lastVehicleRef : null}
              vehicle={vehicle}
              toggleVehicleStatus={(id, status) => toggleVehicleStatus({ id, currentStatus: status })}
              handleOpenEditDialog={handleOpenEditDialog}
              isToggling={isToggling}
            />
          );
        })}

        {!isLoading && vehicles.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchQuery || statusFilter !== "all"
                ? "No vehicles match your filters"
                : "No vehicles yet. Add your first vehicle to get started."}
            </p>
          </div>
        )}

        {isFetching && !isLoading &&
          Array.from({ length: 3 }).map((_, index) => (
            <VehicleCardSkeleton key={`loading-more-${index}`} />
          ))}
      </div>

      <VehicleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        vehicle={editingVehicle}
      />
    </div>
  );
}