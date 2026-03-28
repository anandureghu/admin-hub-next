import { useParams, useNavigate } from "react-router-dom";
import { useTripDetailQuery } from "../hooks/useTripsQuery";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    MapPin,
    Calendar,
    Clock,
    Loader2,
    User,
    Car,
    ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { StatusBadge } from "@/components/ui/status-badge";
import { WorkSessionCard } from "./WorkSessionCard";

export default function TripDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: trip, isLoading, error } = useTripDetailQuery(id || "");

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !trip) {
        return (
            <div className="text-center py-20">
                <p className="text-destructive mb-4">Trip not found or an error occurred.</p>
                <Button onClick={() => navigate("/trips")}>Back to Trips</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10">
            {/* Header Navigation */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight">Trip Details</h1>
                            <StatusBadge status={trip.status === "STARTED" ? "started" : "ended"} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Left Column: Trip Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="stat-card grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span className="text-xs font-medium uppercase">Date</span>
                            </div>
                            <p className="font-semibold">{format(new Date(trip.trip_date), "PPP")}</p>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span className="text-xs font-medium uppercase">Timeframe</span>
                            </div>
                            <p className="font-semibold">
                                {trip.start_time ? format(new Date(trip.start_time), "p") : "—"} to{" "}
                                {trip.end_time ? format(new Date(trip.end_time), "p") : "In Progress"}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <User className="w-4 h-4" />
                                <span className="text-xs font-medium uppercase">Driver</span>
                            </div>
                            <p className="font-semibold">{trip.users?.name || "N/A"}</p>
                            <p className="text-xs text-muted-foreground">{trip.users?.email}</p>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Car className="w-4 h-4" />
                                <span className="text-xs font-medium uppercase">Vehicle</span>
                            </div>
                            <p className="font-semibold">{trip.vehicles?.vehicle_number || "N/A"}</p>
                            <p className="text-xs text-muted-foreground">{trip.vehicles?.vehicle_type}</p>
                        </div>
                    </div>

                    {/* Work Sessions List */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            Work Sessions
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                {trip.work_sessions?.length || 0}
                            </span>
                        </h3>

                        {trip.work_sessions && trip.work_sessions.length > 0 ? (
                            <div className="grid gap-3">
                                {trip.work_sessions.map((session, index) => (
                                    <WorkSessionCard
                                        key={session.id}
                                        session={session}
                                        tripId={trip.id}
                                        index={index}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-xl text-muted-foreground">
                                <Clock className="w-8 h-8 mb-2 opacity-20" />
                                <p className="text-sm">No work sessions recorded</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Distance & Images */}
                <div className="space-y-6">
                    <div className="stat-card">
                        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Odometer Readings</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-end border-b pb-2">
                                <span className="text-sm text-muted-foreground">Start KM</span>
                                <span className="text-xl font-bold">{trip.start_km ?? "—"}</span>
                            </div>
                            <div className="flex justify-between items-end border-b pb-2">
                                <span className="text-sm text-muted-foreground">End KM</span>
                                <span className="text-xl font-bold">{trip.end_km ?? "—"}</span>
                            </div>
                            <div className="pt-2">
                                <span className="text-xs text-muted-foreground">Total Distance</span>
                                <p className="text-2xl font-black text-primary">
                                    {trip.start_km !== null && trip.end_km !== null ? `${trip.end_km - trip.start_km} km` : "—"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Images Section */}
                    <div className="stat-card space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Trip Photos</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase text-muted-foreground">Start Image</p>
                                {trip.start_image ? (
                                    <img src={trip.start_image} alt="Start" className="rounded-lg object-cover aspect-square border" />
                                ) : (
                                    <div className="aspect-square bg-secondary rounded-lg flex items-center justify-center text-[10px]">No image</div>
                                )}
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase text-muted-foreground">End Image</p>
                                {trip.end_image ? (
                                    <img src={trip.end_image} alt="End" className="rounded-lg object-cover aspect-square border" />
                                ) : (
                                    <div className="aspect-square bg-secondary rounded-lg flex items-center justify-center text-[10px]">No image</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}