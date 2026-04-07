import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, MapPin, Calendar, User, FileText, Image as ImageIcon, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { getCoordinatesFromHex } from "@/lib/geo";
import { useAccidentDetailQuery } from "../hooks/useAccidentsQuery";

export default function AccidentDetails() {
    const { t } = useTranslation();
    const { accidentId } = useParams<{ accidentId: string }>();
    const navigate = useNavigate();

    const [imageError, setImageError] = useState(false);

    const { data: accident, isLoading } = useAccidentDetailQuery(accidentId);

    if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
    
    if (!accident) return (
        <div className="text-center p-10 text-muted-foreground">
            {t("accidents.details.notFound")}
        </div>
    );

    const coordinates = getCoordinatesFromHex(accident.location);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* HEADER */}
            <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="h-9 w-9 shrink-0 rounded-full bg-card"
                    title={t("accidents.details.back")}
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <h1 className="text-2xl font-bold tracking-tight mt-0.5">
                    {t("accidents.details.title")}
                </h1>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">

                {/* LEFT COLUMN: Photo & Description */}
                <div className="flex flex-col gap-6">

                    {/* Photo Card */}
                    <div className="stat-card overflow-hidden p-0 border-border">
                        {accident.photo_url && !imageError ? (
                            <img
                                src={accident.photo_url}
                                alt={t("accidents.details.photoAlt")}
                                className="w-full h-64 sm:h-80 object-cover"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="w-full h-64 sm:h-80 bg-secondary/30 flex flex-col items-center justify-center text-muted-foreground">
                                <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
                                <p className="font-medium">
                                    {accident.photo_url 
                                        ? t("accidents.details.photoError") 
                                        : t("accidents.details.noPhoto")}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Description Card */}
                    <div className="stat-card space-y-4">
                        <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-amber-500" />
                            <h2 className="font-semibold text-foreground">
                                {t("accidents.details.incidentDescription")}
                            </h2>
                        </div>
                        <p className="text-foreground leading-relaxed bg-secondary/20 p-4 rounded-lg border border-border/50">
                            {accident.description}
                        </p>
                    </div>
                </div>

                {/* RIGHT COLUMN: Metadata & Map */}
                <div className="flex flex-col gap-6">

                    {/* Metadata Card */}
                    <div className="stat-card space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" /> {t("accidents.details.reportedOn")}
                                </p>
                                <p className="font-medium">{format(new Date(accident.created_at), "PPP p")}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                                    <User className="w-4 h-4" /> {t("accidents.details.reportedBy")}
                                </p>
                                <Link to={`/employees/${accident.user_id}`} className="font-medium text-primary hover:underline">
                                    {accident.users?.name || t("accidents.details.unknown")}
                                </Link>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border">
                            <Link
                                to={`/trip/${accident.trip_id}`}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50 text-sm font-semibold text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all border border-border"
                            >
                                <MapPin className="w-4 h-4" />
                                {accident.trips?.trip_date 
                                    ? t("accidents.details.tripOn", { date: format(new Date(accident.trips.trip_date), "PPP") }) 
                                    : t("accidents.details.unknown")}
                                <ExternalLink className="w-3 h-3 ml-2 opacity-50" />
                            </Link>
                        </div>
                    </div>

                    {/* Map Card */}
                    <div className="stat-card flex flex-col flex-1 min-h-[300px]">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-blue-500" />
                                <h2 className="font-semibold text-foreground">
                                    {t("accidents.details.incidentLocation")}
                                </h2>
                            </div>
                        </div>

                        {coordinates ? (
                            <div className="w-full flex-1 rounded-xl overflow-hidden border border-border relative mt-2 min-h-[250px]">
                                <iframe
                                    title={t("accidents.details.incidentLocation")}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src={`https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lng}&z=16&output=embed`}
                                    className="absolute inset-0 z-10"
                                />
                            </div>
                        ) : (
                            <div className="w-full flex-1 rounded-xl border border-dashed border-border/60 bg-secondary/20 flex flex-col items-center justify-center text-muted-foreground p-6 text-center min-h-[250px]">
                                <MapPin className="w-10 h-10 mb-3 opacity-20" />
                                <p className="font-medium text-foreground mb-1">
                                    {t("accidents.details.noCoordinates")}
                                </p>
                                <p className="text-sm">
                                    {t("accidents.details.noLocationData")}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}