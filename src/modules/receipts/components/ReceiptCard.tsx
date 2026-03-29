// receipts/components/ReceiptCard.tsx
import { Link } from "react-router-dom";
import { User, MapPin, IndianRupee, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { ReceiptListResponse } from "../schemas/receipt.schema";
import { cn } from "@/lib/utils";

export function ReceiptCard({ receipt }: { receipt: ReceiptListResponse }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-all group">
      <div className="space-y-4">
        {/* Top Section: Amount & Date */}
        <div className="flex justify-between items-start">
          <div className="flex items-center text-xl font-bold text-green-500">
            <IndianRupee className="w-4 h-4 mr-0.5" />
            {receipt.amount?.toFixed(2)}
          </div>
          <span className="text-[10px] text-muted-foreground uppercase font-bold bg-secondary px-2 py-1 rounded">
            {format(new Date(receipt.created_at), "dd/MM/yyyy")}
          </span>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <h3 className="font-semibold text-foreground leading-tight">
            {receipt.description || "No description"}
          </h3>
          
          {/* Employee Link - Clickable */}
          <Link 
            to={`/employees/${receipt.users?.id}`}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
          >
            <User className="w-3.5 h-3.5" />
            <span>{receipt.users?.name || "Unknown employee"}</span>
          </Link>
        </div>

        <div className="pt-3 border-t border-border/50 flex items-center justify-between">
          {/* Trip Link - Clickable badge style */}
          <Link 
            to={`/trip/${receipt.trips?.id}`}
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/80",
              "text-[11px] font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
            )}
          >
            <MapPin className="w-3 h-3" />
            Trip on {receipt.trips?.trip_date ? format(new Date(receipt.trips.trip_date), "MMM d") : "N/A"}
          </Link>

          {/* Receipt View Link */}
          <a 
            href={receipt.receipt_url} 
            target="_blank" 
            rel="noreferrer"
            className="text-xs text-blue-500 font-medium hover:underline flex items-center gap-1"
          >
            View Receipt <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}