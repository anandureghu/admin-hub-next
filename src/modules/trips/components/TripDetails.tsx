import { useParams, useNavigate } from "react-router-dom";
import { useTripDetailQuery } from "../hooks/useTripsQuery";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";

import { TripOverview } from "./TripOverview";
import { TripWorkSessions } from "./TripWorkSessions";
import { TripOdometerAndMap } from "./TripOdometerAndMap";
import { TripInspectionPhotos } from "./TripInspectionPhotos";
import { TripReceipts } from "./TripReceipts";
import { TripIncidents } from "./TripIncidents";

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
        <div className="space-y-8 pb-10 w-full h-full overflow-y-auto pr-4 custom-scrollbar">
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

            {/* --- TOP GRID (Overview & Map) --- */}
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <TripOverview trip={trip} />
                    <TripWorkSessions tripId={trip.id} sessions={trip.work_sessions} />
                </div>
                <div className="space-y-6">
                    <TripOdometerAndMap trip={trip} />
                </div>
            </div>

            {/* --- BOTTOM SECTIONS --- */}
            <TripInspectionPhotos trip={trip} />
            <TripReceipts receipts={trip.receipts} />
            <TripIncidents trip={trip} />
        </div>
    );
}