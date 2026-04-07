import { Calendar, Clock, User, Car } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { TripDetailResponse } from "../schemas/trip.schema";

export function TripOverview({ trip }: { trip: TripDetailResponse }) {
    const { t } = useTranslation();

    return (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                <div className="flex gap-4 items-start">
                    <div className="p-2.5 bg-primary/10 rounded-lg shrink-0">
                        <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                            {t("trips.overview.date")}
                        </p>
                        <p className="font-medium text-foreground">
                            {format(new Date(trip.trip_date), "MMMM do, yyyy")}
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 items-start">
                    <div className="p-2.5 bg-primary/10 rounded-lg shrink-0">
                        <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                            {t("trips.overview.timeframe")}
                        </p>
                        <p className="font-medium text-foreground">
                            {trip.start_time ? format(new Date(trip.start_time), "h:mm a") : "—"}
                            <span className="text-muted-foreground mx-1">→</span>
                            {trip.end_time ? (
                                format(new Date(trip.end_time), "h:mm a")
                            ) : (
                                <span className="text-primary font-medium">
                                    {t("trips.overview.activeNow")}
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 items-start">
                    <div className="p-2.5 bg-primary/10 rounded-lg shrink-0">
                        <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                            {t("trips.overview.driver")}
                        </p>
                        <p className="font-medium text-foreground">
                            {trip.users?.name || t("trips.overview.unassigned")}
                        </p>
                        <p className="text-sm text-muted-foreground mt-0.5">{trip.users?.email}</p>
                    </div>
                </div>

                <div className="flex gap-4 items-start">
                    <div className="p-2.5 bg-primary/10 rounded-lg shrink-0">
                        <Car className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                            {t("trips.overview.vehicle")}
                        </p>
                        <p className="font-medium text-foreground">
                            {trip.vehicles?.vehicle_number || t("trips.overview.unassigned")}
                        </p>
                        <p className="text-sm text-muted-foreground mt-0.5">{trip.vehicles?.vehicle_type}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}