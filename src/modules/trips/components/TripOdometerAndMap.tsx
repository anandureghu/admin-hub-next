import { Route, MapPin, Loader2 } from "lucide-react";
import { getCoordinatesFromHex } from "@/lib/geo";
import { TripDetailResponse } from "../schemas/trip.schema";

export function TripOdometerAndMap({ trip }: { trip: TripDetailResponse }) {
    const startCoords = getCoordinatesFromHex(trip.start_location);
    const endCoords = getCoordinatesFromHex(trip.end_location);

    return (
        <div className="space-y-6">
            {/* Odometer Numeric Card */}
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

            {/* Trip Route Map Card */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trip Route</h3>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" /> Start
                        </span>
                        {startCoords ? (
                            <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">Pinned</span>
                        ) : (
                            <span className="text-xs text-muted-foreground">Missing</span>
                        )}
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500" /> End
                        </span>
                        {endCoords ? (
                            <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">Pinned</span>
                        ) : (
                            <span className="text-xs text-muted-foreground">Missing</span>
                        )}
                    </div>

                    {(startCoords || endCoords) ? (
                        <div className="w-full h-48 sm:h-56 rounded-lg overflow-hidden border border-border relative mt-4 bg-secondary/20">
                            <div className="absolute inset-0 flex items-center justify-center -z-10">
                                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                            </div>
                            <iframe
                                title="Trip Route"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                                src={
                                    startCoords && endCoords
                                        ? `https://maps.google.com/maps?saddr=${startCoords.lat},${startCoords.lng}&daddr=${endCoords.lat},${endCoords.lng}&output=embed`
                                        : startCoords
                                            ? `https://maps.google.com/maps?q=${startCoords.lat},${startCoords.lng}&z=15&output=embed`
                                            : `https://maps.google.com/maps?q=${endCoords?.lat},${endCoords?.lng}&z=15&output=embed`
                                }
                                className="absolute inset-0 z-10"
                            />
                        </div>
                    ) : (
                        <div className="w-full h-32 mt-4 rounded-lg border border-dashed border-border/60 bg-secondary/20 flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
                            <MapPin className="w-6 h-6 mb-2 opacity-20" />
                            <p className="text-xs">No location data captured</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}