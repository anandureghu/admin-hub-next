import { Receipt } from "lucide-react";
import { ReceiptCard } from "../../receipts/components/ReceiptCard"; // Adjust path as needed
import { TripDetailResponse } from "../schemas/trip.schema";

export function TripReceipts({ receipts }: { receipts: TripDetailResponse['receipts'] }) {
    return (
        <div className="pt-8 mt-4 border-t border-border">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    Trip Receipts
                    <span className="flex items-center justify-center w-6 h-6 text-sm font-medium bg-primary/10 text-primary rounded-full">
                        {receipts?.length || 0}
                    </span>
                </h3>
            </div>

            {receipts && receipts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {receipts.map((receipt) => (
                        <ReceiptCard key={receipt.id} receipt={receipt} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-card/30 border border-dashed border-border rounded-xl text-muted-foreground">
                    <Receipt className="w-10 h-10 mb-3 opacity-20" />
                    <p className="text-base font-medium">No receipts submitted</p>
                </div>
            )}
        </div>
    );
}