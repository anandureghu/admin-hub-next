import { AccidentListResponse } from "../schemas/accident.schema";
import { Calendar, User, ExternalLink, MapPin, Image, ArrowRight } from "lucide-react";
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
        <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-all group relative">
            <div className="flex flex-col sm:flex-row gap-5">
                {/* Incident Image / Icon placeholder */}
                <div className="shrink-0">
                    {accident.photo_url ? (
                        <img
                            src={accident.photo_url}
                            alt="Incident"
                            className="w-full sm:w-24 h-40 sm:h-24 rounded-lg object-cover border border-border"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                const parent = (e.target as HTMLElement).parentElement;
                                if (parent) {
                                    const placeholder = document.createElement('div');
                                    placeholder.className = "w-full sm:w-24 h-24 rounded-lg bg-secondary flex items-center justify-center border border-border";
                                    placeholder.innerHTML = `<svg class="w-10 h-10 text-muted-foreground/30" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`;
                                    parent.appendChild(placeholder);
                                }
                            }}
                        />
                    ) : (
                        <div className="w-full sm:w-24 h-24 rounded-lg bg-secondary flex items-center justify-center border border-border">
                            <Image className="w-10 h-10 text-muted-foreground/30" strokeWidth={1} />
                        </div>
                    )}
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col flex-1 min-w-0 justify-between">

                    {/* TOP ROW: Title/Metadata (Left) & View Details Button (Right) */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">

                        {/* Title and Metadata */}
                        <div className="space-y-1 overflow-hidden flex-1 min-w-0">
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

                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm mt-1">
                                <Link
                                    to={`/employees/${accident.user_id}`}
                                    className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors font-medium"
                                >
                                    <User className="w-4 h-4 text-primary/60" />
                                    {accident.users?.name || "Unknown Employee"}
                                </Link>

                                <span className="flex items-center gap-1.5 text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    {format(new Date(accident.created_at), "MMM d, yyyy • p")}
                                </span>
                            </div>
                        </div>

                        {/* VIEW DETAILS BUTTON (Moved to Top Right) */}
                        <Link
                            to={`/accidents/${accident.id}`}
                            className="shrink-0 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white border border-blue-500/20 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all inline-flex items-center gap-1 group/link"
                        >
                            View Details
                            <ArrowRight className="w-3 h-3 transition-transform group-hover/link:translate-x-1" />
                        </Link>

                    </div>

                    {/* BOTTOM ROW: Trip Link */}
                    <div className="pt-3 mt-4 border-t border-border/50 flex items-center">
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