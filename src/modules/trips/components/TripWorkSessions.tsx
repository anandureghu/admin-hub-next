import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { WorkSessionCard } from "./WorkSessionCard";
import { TripDetailResponse } from "../schemas/trip.schema";

interface TripWorkSessionsProps {
    tripId: string;
    sessions: TripDetailResponse['work_sessions'];
}

export function TripWorkSessions({ tripId, sessions }: TripWorkSessionsProps) {
    const { t } = useTranslation();

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    {t("trips.workSessions.title")}
                    <span className="flex items-center justify-center w-5 h-5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                        {sessions?.length || 0}
                    </span>
                </h3>
            </div>

            {sessions && sessions.length > 0 ? (
                <div className="grid gap-3">
                    {sessions.map((session, index) => (
                        <WorkSessionCard key={session.id} session={session} tripId={tripId} index={index} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 bg-card/30 border border-dashed border-border rounded-xl text-muted-foreground">
                    <Clock className="w-8 h-8 mb-3 opacity-20" />
                    <p className="text-sm font-medium">
                        {t("trips.workSessions.noSessions")}
                    </p>
                </div>
            )}
        </div>
    );
}