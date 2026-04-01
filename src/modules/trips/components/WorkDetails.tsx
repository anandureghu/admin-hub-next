import { useParams, useNavigate } from "react-router-dom";
import { useWorkDetailQuery } from "../hooks/useWorkQuery";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, StickyNote, Loader2, MapPin, Hourglass } from "lucide-react";
import { format } from "date-fns";
import { getCoordinatesFromHex } from "@/lib/geo";

export default function WorkDetail() {
  const { workId } = useParams<{ workId: string }>();
  const navigate = useNavigate();
  const { data: work, isLoading } = useWorkDetailQuery(workId || "");

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>;
  if (!work) return <div className="text-center p-10 text-muted-foreground">Work session not found.</div>;

  const duration = work.end_time
    ? `${Math.round((new Date(work.end_time).getTime() - new Date(work.start_time).getTime()) / 60000)} mins`
    : "In Progress";

  const coordinates = getCoordinatesFromHex(work.location);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="h-9 w-9 shrink-0 rounded-full bg-card"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight mt-0.5">
          Work Session Details
        </h1>
      </div>

      {/* NEW STACKED LAYOUT */}
      <div className="flex flex-col gap-6">
        
        {/* TOP ROW: Metadata (3 columns on desktop, 1 on mobile) */}
        <div className="stat-card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            
            {/* Timing */}
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-primary/10 rounded-lg shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Timing</p>
                <p className="font-semibold text-foreground">
                  {format(new Date(work.start_time), "pp")} - {work.end_time ? format(new Date(work.end_time), "pp") : "Active"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(work.start_time), "PP")}
                </p>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-start gap-4 md:border-l md:border-border/50 md:pl-8">
              <div className="p-2.5 bg-blue-500/10 rounded-lg shrink-0">
                <Hourglass className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Duration</p>
                <p className="font-semibold text-foreground">{duration}</p>
              </div>
            </div>

            {/* Notes */}
            <div className="flex items-start gap-4 md:border-l md:border-border/50 md:pl-8">
              <div className="p-2.5 bg-amber-500/10 rounded-lg shrink-0">
                <StickyNote className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Notes</p>
                <p className="text-sm text-foreground leading-relaxed line-clamp-3">
                  {work.notes || "No notes provided for this session."}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM ROW: Map (Spans full width) */}
        <div className="stat-card flex flex-col min-h-[450px]">
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Location Tracking</h2>
            </div>

            {/* Status Badge */}
            {coordinates ? (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Captured
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1 bg-destructive/10 text-destructive rounded-full text-xs font-medium">
                <span className="h-2 w-2 rounded-full bg-destructive"></span>
                Not Recorded
              </div>
            )}
          </div>

          {coordinates ? (
            <div className="w-full flex-1 rounded-xl overflow-hidden border border-border bg-secondary/30 relative mt-2">
              <div className="absolute inset-0 flex items-center justify-center -z-10">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
              <iframe
                title="Session Location"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lng}&z=15&output=embed`}
                className="absolute inset-0 z-10"
              />
            </div>
          ) : (
            <div className="w-full flex-1 mt-2 rounded-xl border border-dashed border-border/60 bg-secondary/20 flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
              <MapPin className="w-10 h-10 mb-3 opacity-20" />
              <p className="font-medium text-foreground mb-1">No coordinates available</p>
              <p className="text-sm">Location tracking was disabled or unavailable during this session.</p>
            </div>
          )}
          
        </div>

      </div>
    </div>
  );
}