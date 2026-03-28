import { ReceiptListResponse } from "../schemas/receipt.schema";
import { Calendar, User, FileText, ExternalLink, MapPin, IndianRupee } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function ReceiptCard({ receipt }: { receipt: ReceiptListResponse }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all group">
      <div className="space-y-4">
        {/* Receipt Image / Placeholder */}
        <a href={receipt.receipt_url} target="_blank" rel="noreferrer" className="block relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-secondary">
          <img 
            src={receipt.receipt_url} 
            alt="Receipt" 
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            onError={(e) => { (e.currentTarget.src = "/placeholder-receipt.png"); }} // Handle 404
          />
          <div className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <ExternalLink className="w-3 h-3" />
          </div>
        </a>

        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center text-lg font-bold text-primary">
              <IndianRupee className="w-4 h-4 mr-0.5" />
              {receipt.amount?.toLocaleString() || "0.00"}
            </div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">
              {format(new Date(receipt.created_at), "MMM d, yyyy")}
            </span>
          </div>

          <p className="text-sm text-foreground line-clamp-1 font-medium">
            {receipt.description || "No description provided"}
          </p>

          <div className="pt-2 border-t border-border/50 space-y-2">
            <Link 
              to={`/employees/${receipt.user_id}`}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <User className="w-3 h-3" />
              {receipt.users?.name || "Unknown"}
            </Link>
            
            <Link 
              to={`/trip/${receipt.trip_id}`}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <MapPin className="w-3 h-3" />
              Trip on {receipt.trips?.trip_date ? format(new Date(receipt.trips.trip_date), "PP") : "N/A"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}