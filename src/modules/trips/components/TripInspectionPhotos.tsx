import { Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { TripDetailResponse } from "../schemas/trip.schema";
import { PhotoFrame } from "@/components/ui/photo-frame";

export function TripInspectionPhotos({ trip }: { trip: TripDetailResponse }) {
    const getPhoto = (type: string) => trip.vehicle_photos?.find(p => p.photo_type === type)?.photo_url;

    return (
        <div className="pt-8 mt-4 border-t border-border">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
                Inspection & Odometer Photos
            </h3>

            <div className="space-y-6">
                {/* START PHASE PHOTOS */}
                <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        <h4 className="font-semibold text-foreground">Start of Trip Inspection</h4>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                        <PhotoFrame title="Odometer" url={trip.start_image} />
                        <PhotoFrame title="Front" url={getPhoto('START_FRONT')} />
                        <PhotoFrame title="Back" url={getPhoto('START_BACK')} />
                        <PhotoFrame title="Left" url={getPhoto('START_LEFT')} />
                        <PhotoFrame title="Right" url={getPhoto('START_RIGHT')} />
                    </div>
                </div>

                {/* END PHASE PHOTOS */}
                <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-5">
                        {trip.status === "ENDED" ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                        )}
                        <h4 className="font-semibold text-foreground">End of Trip Inspection</h4>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                        <PhotoFrame title="Odometer" url={trip.end_image} />
                        <PhotoFrame title="Front" url={getPhoto('END_FRONT')} />
                        <PhotoFrame title="Back" url={getPhoto('END_BACK')} />
                        <PhotoFrame title="Left" url={getPhoto('END_LEFT')} />
                        <PhotoFrame title="Right" url={getPhoto('END_RIGHT')} />
                    </div>
                </div>
            </div>
        </div>
    );
}