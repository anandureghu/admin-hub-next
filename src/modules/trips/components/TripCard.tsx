import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { TripListResponse as Trip } from "../schemas/trip.schema";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
                        <p className="text-sm text-muted-foreground w-full lg:max-w-xs truncate">
                            {trip.vehicles?.vehicle_number || "No vehicle"}

                            {/* Conditionally render the entire Tooltip block only if vehicle_type exists */}
                            {trip.vehicles?.vehicle_type ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="cursor-pointed">
                                            {" "}• {trip.vehicles.vehicle_type} •{" "}
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent
                                        side="top"
                                        className="max-w-[400px] whitespace-normal break-words text-left"
                                    >
                                        {trip.vehicles.vehicle_type}
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                <span> • </span>
                            )}

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
                            className="bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white border border-blue-500/20 rounded-lg px-4 py-2 text-sm font-semibold transition-all inline-flex items-center gap-2 group/link"
                        >
                            View Details
                            <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
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