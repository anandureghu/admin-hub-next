import { AlertOctagon, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AccidentCard } from "@/modules/accidents/components/AccidentCard";
import { TripDetailResponse } from "../schemas/trip.schema";

export function TripIncidents({ trip }: { trip: TripDetailResponse }) {
    const { t } = useTranslation();

    return (
        <div className="pt-8 mt-4 border-t border-border">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <AlertOctagon className="w-5 h-5 text-destructive" />
                    {t("trips.incidents.title")}
                    <span className="flex items-center justify-center px-2 py-0.5 text-xs font-semibold bg-destructive/10 text-destructive rounded-full">
                        {trip.accident_reports?.length || 0}
                    </span>
                </h3>
            </div>

            {trip.accident_reports && trip.accident_reports.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {trip.accident_reports.map((accident) => (
                        <AccidentCard
                            key={accident.id}
                            accident={{
                                ...accident,
                                user_id: trip.user_id,
                                trip_id: trip.id,
                                users: trip.users,
                                trips: {
                                    trip_date: trip.trip_date,
                                    status: trip.status
                                },
                                updated_at: accident.created_at
                            }}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-10 bg-card/30 border border-dashed border-border rounded-xl text-muted-foreground">
                    <CheckCircle2 className="w-8 h-8 mb-2 text-green-500/50" />
                    <p className="text-sm font-medium">{t("trips.incidents.noIncidents")}</p>
                    <p className="text-xs mt-1">{t("trips.incidents.safeTrip")}</p>
                </div>
            )}
        </div>
    );
}