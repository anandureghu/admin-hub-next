import { useParams, useNavigate } from "react-router-dom";
import { useWorkDetailQuery } from "../hooks/useWorkQuery";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, StickyNote, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function WorkDetail() {
  const { workId } = useParams<{ workId: string }>();
  const navigate = useNavigate();
  const { data: work, isLoading } = useWorkDetailQuery(workId || "");

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
  if (!work) return <div className="text-center p-10">Work session not found.</div>;

  const duration = work.end_time 
    ? `${Math.round((new Date(work.end_time).getTime() - new Date(work.start_time).getTime()) / 60000)} mins`
    : "In Progress";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="page-header">Work Session Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="stat-card space-y-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Timing</p>
              <p className="font-medium">
                {format(new Date(work.start_time), "pp")} - {work.end_time ? format(new Date(work.end_time), "pp") : "Active"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-5 h-5 flex items-center justify-center font-bold text-xs bg-primary/10 text-primary rounded">Σ</div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">{duration}</p>
            </div>
          </div>
        </div>

        <div className="stat-card space-y-4">
          <div className="flex items-start gap-3">
            <StickyNote className="w-5 h-5 text-primary mt-1" />
            <div>
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="text-foreground leading-relaxed">
                {work.notes || "No notes provided for this session."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}