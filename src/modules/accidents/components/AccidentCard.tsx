import { AccidentListResponse } from "../schemas/accident.schema";
import { Calendar, User, FileText, ExternalLink, MapPin, Image } from "lucide-react"; // Import 'Image'
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AccidentCard({ accident }: { accident: AccidentListResponse }) {
    return (
        <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-all group">
            <div className="flex flex-col sm:flex-row gap-5">
                {/* Incident Image / Icon placeholder */}
                <div className="shrink-0">
                    {accident.photo_url ? (
                        <img
                            src={accident.photo_url}
                            alt="Incident"
                            className="w-full sm:w-24 h-40 sm:h-24 rounded-lg object-cover border border-border"
                            onError={(e) => {
                                // Replace broken image with a placeholder UI
                                (e.target as HTMLImageElement).style.display = 'none';
                                const parent = (e.target as HTMLElement).parentElement;
                                if (parent) {
                                    const placeholder = document.createElement('div');
                                    placeholder.className = "w-full sm:w-24 h-24 rounded-lg bg-secondary flex items-center justify-center border border-border";
                                    placeholder.innerHTML = `<svg class="w-10 h-10 text-muted-foreground/30" ...></svg>`; // simplified for brevity
                                    parent.appendChild(placeholder);
                                }
                            }}
                        />
                    ) : (
                        // Placeholder icon for when photo_url is missing
                        <div className="w-full sm:w-24 h-24 rounded-lg bg-secondary flex items-center justify-center border border-border">
                            <Image className="w-10 h-10 text-muted-foreground/30" strokeWidth={1} />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1 overflow-hidden w-full">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <h3 className="font-bold text-lg leading-tight text-foreground truncate block cursor-pointer">
                                        {accident.description || "No description"}
                                    </h3>
                                </TooltipTrigger>
                                {accident.description && (
                                    <TooltipContent side="top" className="max-w-[400px] break-words text-left">
                                        <p>{accident.description}</p>
                                    </TooltipContent>
                                )}
                            </Tooltip>
                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                                {/* Employee Link */}
                                <Link
                                    to={`/employees/${accident.user_id}`}
                                    className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors font-medium"
                                >
                                    <User className="w-4 h-4 text-primary/60" />
                                    {accident.users?.name || "Unknown Employee"}
                                </Link>

                                {/* Date Reference */}
                                <span className="flex items-center gap-1.5 text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    {format(new Date(accident.created_at), "MMM d, yyyy • p")}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-border/50 flex flex-wrap items-center justify-between gap-4">
                        {/* Trip Link */}
                        <Link
                            to={`/trip/${accident.trip_id}`}
                            className={cn(
                                "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50",
                                "text-xs font-semibold text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
                            )}
                        >
                            <MapPin className="w-3 h-3" />
                            Trip on {accident.trips?.trip_date ? format(new Date(accident.trips.trip_date), "PP") : "Unknown Date"}
                            <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}