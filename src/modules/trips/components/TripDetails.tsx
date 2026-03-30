import { useParams, useNavigate } from "react-router-dom";
import { useTripDetailQuery } from "../hooks/useTripsQuery";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    Calendar,
    Clock,
    Loader2,
    User,
    Car,
    Receipt,
    Route,
    Image as ImageIcon
} from "lucide-react";
import { format } from "date-fns";
import { StatusBadge } from "@/components/ui/status-badge";
import { WorkSessionCard } from "./WorkSessionCard";
import { ReceiptCard } from "../../receipts/components/ReceiptCard";

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
        <div className="space-y-8 pb-10 max-w-7xl mx-auto">
            {/* --- HEADER --- */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="shrink-0">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight">Trip Summary</h1>
                            <StatusBadge status={trip.status === "STARTED" ? "started" : "ended"} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* --- LEFT COLUMN (Wider) --- */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Unified Overview Card */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                            
                            {/* Date */}
                            <div className="flex gap-4 items-start">
                                <div className="p-2.5 bg-primary/10 rounded-lg shrink-0">
                                    <Calendar className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Date</p>
                                    <p className="font-medium text-foreground">{format(new Date(trip.trip_date), "MMMM do, yyyy")}</p>
                                </div>
                            </div>

                            {/* Timeframe */}
                            <div className="flex gap-4 items-start">
                                <div className="p-2.5 bg-primary/10 rounded-lg shrink-0">
                                    <Clock className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Timeframe</p>
                                    <p className="font-medium text-foreground">
                                        {trip.start_time ? format(new Date(trip.start_time), "h:mm a") : "—"} 
                                        <span className="text-muted-foreground mx-1">→</span> 
                                        {trip.end_time ? format(new Date(trip.end_time), "h:mm a") : <span className="text-primary font-medium">Active Now</span>}
                                    </p>
                                </div>
                            </div>

                            {/* Driver */}
                            <div className="flex gap-4 items-start">
                                <div className="p-2.5 bg-primary/10 rounded-lg shrink-0">
                                    <User className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Driver</p>
                                    <p className="font-medium text-foreground">{trip.users?.name || "Unassigned"}</p>
                                    <p className="text-sm text-muted-foreground mt-0.5">{trip.users?.email}</p>
                                </div>
                            </div>

                            {/* Vehicle */}
                            <div className="flex gap-4 items-start">
                                <div className="p-2.5 bg-primary/10 rounded-lg shrink-0">
                                    <Car className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Vehicle</p>
                                    <p className="font-medium text-foreground">{trip.vehicles?.vehicle_number || "Unassigned"}</p>
                                    <p className="text-sm text-muted-foreground mt-0.5">{trip.vehicles?.vehicle_type}</p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Work Sessions Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                Work Sessions
                                <span className="flex items-center justify-center w-5 h-5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                                    {trip.work_sessions?.length || 0}
                                </span>
                            </h3>
                        </div>

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
                            <div className="flex flex-col items-center justify-center py-12 bg-card/30 border border-dashed border-border rounded-xl text-muted-foreground">
                                <Clock className="w-8 h-8 mb-3 opacity-20" />
                                <p className="text-sm font-medium">No work sessions recorded</p>
                                <p className="text-xs mt-1">Sessions will appear here when the driver logs them.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- RIGHT COLUMN (Narrower) --- */}
                <div className="space-y-6">
                    
                    {/* Odometer Card */}
                    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-5">
                            <Route className="w-4 h-4 text-muted-foreground" />
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Odometer Readings</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b border-border/50">
                                <span className="text-sm text-muted-foreground font-medium">Start Reading</span>
                                <span className="text-base font-semibold">{trip.start_km ? `${trip.start_km.toLocaleString()} km` : "—"}</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-border/50">
                                <span className="text-sm text-muted-foreground font-medium">End Reading</span>
                                <span className="text-base font-semibold">{trip.end_km ? `${trip.end_km.toLocaleString()} km` : "—"}</span>
                            </div>
                            
                            <div className="pt-2 bg-secondary/30 -mx-5 -mb-5 p-5 rounded-b-xl border-t border-border/50 mt-4">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Total Distance</span>
                                <p className="text-3xl font-bold text-primary">
                                    {trip.start_km !== null && trip.end_km !== null ? `${(trip.end_km - trip.start_km).toLocaleString()} km` : "—"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Photos Card */}
                    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-5">
                            <ImageIcon className="w-4 h-4 text-muted-foreground" />
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trip Photos</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <p className="text-[10px] font-semibold uppercase text-muted-foreground text-center">Start Image</p>
                                {trip.start_image ? (
                                    <div className="relative group rounded-lg overflow-hidden border border-border">
                                        <img src={trip.start_image} alt="Start" className="object-cover aspect-square w-full hover:scale-105 transition-transform duration-300" />
                                    </div>
                                ) : (
                                    <div className="aspect-square bg-secondary/50 rounded-lg border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground">
                                        <ImageIcon className="w-5 h-5 mb-1 opacity-20" />
                                        <span className="text-[10px] uppercase tracking-wider">Empty</span>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-semibold uppercase text-muted-foreground text-center">End Image</p>
                                {trip.end_image ? (
                                    <div className="relative group rounded-lg overflow-hidden border border-border">
                                        <img src={trip.end_image} alt="End" className="object-cover aspect-square w-full hover:scale-105 transition-transform duration-300" />
                                    </div>
                                ) : (
                                    <div className="aspect-square bg-secondary/50 rounded-lg border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground">
                                        <ImageIcon className="w-5 h-5 mb-1 opacity-20" />
                                        <span className="text-[10px] uppercase tracking-wider">Empty</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- BOTTOM SECTION: Receipts --- */}
            <div className="pt-8 mt-4 border-t border-border">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        Trip Receipts
                        <span className="flex items-center justify-center w-6 h-6 text-sm font-medium bg-primary/10 text-primary rounded-full">
                            {trip.receipts?.length || 0}
                        </span>
                    </h3>
                </div>

                {trip.receipts && trip.receipts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {trip.receipts.map((receipt) => (
                            <ReceiptCard key={receipt.id} receipt={receipt} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 bg-card/30 border border-dashed border-border rounded-xl text-muted-foreground">
                        <Receipt className="w-10 h-10 mb-3 opacity-20" />
                        <p className="text-base font-medium">No receipts submitted</p>
                        <p className="text-sm mt-1">Expenses recorded during this trip will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}