import { Link } from "react-router-dom";
import { User, MapPin, IndianRupee, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { ReceiptListResponse } from "../schemas/receipt.schema";
import { cn } from "@/lib/utils";
import { useUpdateReceiptStatus } from "../hooks/useReceiptsQuery";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ReceiptCard({ receipt }: { receipt: ReceiptListResponse }) {
  const { t } = useTranslation();
  const updateStatus = useUpdateReceiptStatus();

  const handleStatusChange = (newStatus: "PENDING" | "VERIFIED" | "REJECTED") => {
    updateStatus.mutate(
      { id: receipt.id, status: newStatus },
      {
        onSuccess: () => toast.success(t("receipts.statusUpdated")),
        onError: () => toast.error(t("receipts.statusUpdateFailed")),
      }
    );
  };

  const statusColors = {
    PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    VERIFIED: "bg-green-500/10 text-green-500 border-green-500/20",
    REJECTED: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-all group">
      <div className="space-y-4">

        {/* Top Section: Amount & Status Dropdown */}
        <div className="flex justify-between items-start">
          <div className="flex items-center text-xl font-bold text-foreground">
            <IndianRupee className="w-4 h-4 mr-0.5 text-muted-foreground" />
            {receipt.amount?.toFixed(2)}
          </div>

          <Select
            value={receipt.status}
            onValueChange={handleStatusChange}
            disabled={updateStatus.isPending}
          >
            <SelectTrigger
              className={cn(
                "w-fit gap-2 h-7 text-[10px] uppercase font-bold px-2 py-0 border tracking-wider cursor-pointer",
                statusColors[receipt.status as keyof typeof statusColors],
                updateStatus.isPending && "opacity-50"
              )}
            >
              <SelectValue>
                {/* Dynamically translate the current status display */}
                {t(`receipts.${receipt.status?.toLowerCase()}`)}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="PENDING" className="text-[11px] font-medium uppercase text-yellow-500 cursor-pointer">
                {t("receipts.pending")}
              </SelectItem>
              <SelectItem value="VERIFIED" className="text-[11px] font-medium uppercase text-green-500 cursor-pointer">
                {t("receipts.verify")}
              </SelectItem>
              <SelectItem value="REJECTED" className="text-[11px] font-medium uppercase text-destructive cursor-pointer">
                {t("receipts.reject")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Description & Employee */}
        <div className="space-y-2 overflow-hidden">
          <Tooltip>
            <TooltipTrigger asChild>
              <h3 className="font-semibold text-foreground leading-tight truncate block cursor-pointer">
                {receipt.description || t("receipts.noDescription")}
              </h3>
            </TooltipTrigger>
            {receipt.description && (
              <TooltipContent side="top" className="max-w-[280px] break-words text-center">
                <p>{receipt.description}</p>
              </TooltipContent>
            )}
          </Tooltip>

          <div className="flex items-center justify-between">
            <Link
              to={`/employees/${receipt.users?.id}`}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
            >
              <User className="w-3.5 h-3.5" />
              <span>{receipt.users?.name || t("receipts.unknownEmployee")}</span>
            </Link>

            <span className="text-[10px] text-muted-foreground font-medium">
              {format(new Date(receipt.created_at), "dd MMM yyyy")}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-border/50 flex items-center justify-between">
          <Link
            to={`/trip/${receipt.trips?.id}`}
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/80",
              "text-[11px] font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
            )}
          >
            <MapPin className="w-3 h-3" />
            {receipt.trips?.trip_date 
              ? t("receipts.tripOn", { date: format(new Date(receipt.trips.trip_date), "MMM d") }) 
              : t("receipts.noTrip")}
          </Link>

          <a
            href={receipt.image_url}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-500 font-medium hover:underline flex items-center gap-1"
          >
            {t("receipts.viewReceipt")} <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}