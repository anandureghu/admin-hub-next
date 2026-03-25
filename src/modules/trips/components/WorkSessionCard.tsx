import { format } from "date-fns";
import { ChevronRight, Clock, StickyNote } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface WorkSessionCardProps {
  session: {
    id?: string;
    start_time?: string;
    end_time?: string;
    created_at?: string;
    notes?: string;
    location?: string | null;
  };
  tripId: string;
  index: number;
}

export function WorkSessionCard({ session, tripId, index }: WorkSessionCardProps) {
  const navigate = useNavigate();
  const isActive = !session.end_time;

  return (
    <div
      onClick={() => navigate(`/trips/${tripId}/work/${session.id}`)}
      className={cn(
        "group flex items-center justify-between p-4 border border-border rounded-xl bg-card transition-all cursor-pointer hover:border-primary hover:shadow-sm",
        isActive && "border-l-4 border-l-primary" // Highlight active sessions
      )}
    >
      <div className="flex items-center gap-4">
        {/* Index Circle */}
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          {index + 1}
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">
              {format(new Date(session.start_time), "p")} -{" "}
              {session.end_time ? format(new Date(session.end_time), "p") : "Active Now"}
            </p>
            {isActive && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <StickyNote className="w-3 h-3" />
            <p className="line-clamp-1 italic">
              {session.notes || "No notes provided"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {session.end_time && (
          <span className="hidden sm:block text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
            Completed
          </span>
        )}
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
}