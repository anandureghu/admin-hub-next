import { Receipt } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ReceiptCard } from "../../receipts/components/ReceiptCard"; 
import { TripDetailResponse } from "../schemas/trip.schema";

export function TripReceipts({ receipts }: { receipts: TripDetailResponse['receipts'] }) {
    const { t } = useTranslation();

    return (
        <div className="pt-8 mt-4 border-t border-border">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    {t("trips.receipts.title")}
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
                    <p className="text-base font-medium">{t("trips.receipts.noReceipts")}</p>
                </div>
            )}
        </div>
    );
}