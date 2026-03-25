import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { TripListResponse as Trip } from "../schemas/trip.schema";

interface TripCardProps {
  trip: Trip;
}

export function TripCard({ trip }: TripCardProps) {
  // Helper to format time locally
  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return "—";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper for distance display
  const calculateDistance = (startKm: number | null, endKm: number | null) => {
    if (startKm === null || endKm === null) return "—";
    return `${endKm - startKm} km`;
  };

  return (
    <div className="stat-card animate-fade-in group">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="stat-icon group-hover:bg-primary transition-colors">
            <MapPin className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-semibold text-foreground italic">Trip</h3>
              <StatusBadge
                status={trip.status === "STARTED" ? "started" : "ended"}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {trip.vehicles?.vehicle_number || "No vehicle"} •{" "}
              {trip.vehicles?.vehicle_type || ""} •{" "}
              <span className="font-medium text-foreground/80">
                {trip.users?.name || "Unknown user"}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap lg:flex-nowrap items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{new Date(trip.trip_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>
              {formatTime(trip.start_time)} - {formatTime(trip.end_time)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Distance:</span>
            <span className="font-medium">
              {calculateDistance(trip.start_km, trip.end_km)}
            </span>
          </div>
          
          <div className="flex items-center border-l border-border pl-6 ml-auto lg:ml-0">
            <Link
              to={`/trip/${trip.id}`}
              className="text-primary font-medium underline underline-offset-4 hover:text-primary/80 transition-colors inline-flex items-center gap-1 group/link"
            >
              View Details
              <ArrowRight className="w-3 h-3 transition-transform group-hover/link:translate-x-1" />
            </Link>
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
  );
}