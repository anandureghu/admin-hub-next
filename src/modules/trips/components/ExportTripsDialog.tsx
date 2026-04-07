import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Download } from "lucide-react";
import { toast } from "sonner";
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { DateRange } from "react-day-picker";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { UserMultiSelect } from "@/components/UserMultiSelect";

import { tripApi } from "../api/trip.api";
import { downloadCSV } from "@/lib/csv";
import type { TripListResponse as Trip } from "../schemas/trip.schema"; // IMPORTED TRIP TYPE

// NEW: Defined the UserData interface to replace 'any'
interface UserData {
    id?: string;
    name?: string;
    email?: string;
    is_active?: boolean;
    avatar_url?: string;
    company_id?: string;
    phone?: string;
    role?: "ADMIN" | "EMPLOYEE";
}

interface ExportTripsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialStatus: string;
    initialUserIds: string[];
    initialDateRange: DateRange | undefined;
    usersData: UserData[];
    usersLoading: boolean;
}

export function ExportTripsDialog({
    open,
    onOpenChange,
    initialStatus,
    initialUserIds,
    initialDateRange,
    usersData,
    usersLoading,
}: ExportTripsDialogProps) {
    const { t } = useTranslation();
    const [isExporting, setIsExporting] = useState(false);
    const [exportStatus, setExportStatus] = useState<string>("all");
    const [exportUserIds, setExportUserIds] = useState<string[]>([]);
    const [exportDateRange, setExportDateRange] = useState<DateRange | undefined>();
    const [datePreset, setDatePreset] = useState<string>("custom");

    const [exportCount, setExportCount] = useState<number | null>(null);
    const [isCounting, setIsCounting] = useState(false);

    useEffect(() => {
        if (open) {
            setExportStatus(initialStatus);
            setExportUserIds(initialUserIds);
            setExportDateRange(initialDateRange);
            setDatePreset("custom");
        }
    }, [open, initialStatus, initialUserIds, initialDateRange]);

    useEffect(() => {
        if (!open) return;

        let isMounted = true;
        setIsCounting(true);

        const timer = setTimeout(async () => {
            try {
                const count = await tripApi.getExportCount(exportStatus, exportUserIds, exportDateRange);
                if (isMounted) {
                    setExportCount(count);
                }
            } catch (error) {
                console.error("Failed to get count", error);
                if (isMounted) setExportCount(0);
            } finally {
                if (isMounted) setIsCounting(false);
            }
        }, 300);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [exportStatus, exportUserIds, exportDateRange, open]);

    const handleDatePresetChange = (preset: string) => {
        setDatePreset(preset);
        const now = new Date();

        switch (preset) {
            case "today":
                setExportDateRange({ from: startOfDay(now), to: endOfDay(now) });
                break;
            case "this_week":
                setExportDateRange({ from: startOfWeek(now, { weekStartsOn: 1 }), to: endOfWeek(now, { weekStartsOn: 1 }) });
                break;
            case "this_month":
                setExportDateRange({ from: startOfMonth(now), to: endOfMonth(now) });
                break;
            case "all_time":
                setExportDateRange(undefined);
                break;
            default:
                break;
        }
    };

    const handleClearModalFilters = () => {
        setExportUserIds([]);
        setExportStatus("all");
        setExportDateRange(undefined);
        setDatePreset("all_time");
    };

    const confirmExport = async () => {
        try {
            setIsExporting(true);

            const allData = await tripApi.exportTrips(exportStatus, exportUserIds, exportDateRange);

            const finalDataToExport = allData.filter((trip) => {
                return (
                    trip.vehicles?.vehicle_number?.toLowerCase() ||
                    trip.users?.name?.toLowerCase() ||
                    trip.users?.email?.toLowerCase()
                );
            });

            if (finalDataToExport.length === 0) {
                toast.error(t("trips.export.noDataError"), { id: "export-toast" });
                return;
            }

            downloadCSV(finalDataToExport, `Trips_Export_${format(new Date(), "yyyy-MM-dd")}`);
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast.error(t("trips.export.failError"), { id: "export-toast" });
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/* UI FIX: Increased max-width to 525px for longer German words */}
            <DialogContent className="bg-card border-border sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>{t("trips.export.title")}</DialogTitle>
                    <DialogDescription>
                        {t("trips.export.description")}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-2 flex flex-col w-full [&>*]:w-full">
                        <Label>{t("trips.export.employees")}</Label>
                        <UserMultiSelect
                            users={usersData}
                            selectedIds={exportUserIds}
                            onChange={setExportUserIds}
                            isLoading={usersLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>{t("trips.export.tripStatus")}</Label>
                        <Select value={exportStatus} onValueChange={setExportStatus}>
                            <SelectTrigger className="w-full bg-input border-border">
                                <SelectValue placeholder={t("trips.export.allStatus")} />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border">
                                <SelectItem value="all">{t("trips.export.allStatus")}</SelectItem>
                                <SelectItem value="STARTED">{t("trips.export.inProgress")}</SelectItem>
                                <SelectItem value="ENDED">{t("trips.export.completed")}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>{t("trips.export.quickSelect")}</Label>
                        <Select value={datePreset} onValueChange={handleDatePresetChange}>
                            <SelectTrigger className="w-full bg-input border-border">
                                <SelectValue placeholder={t("trips.export.selectTimeframe")} />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border">
                                <SelectItem value="today">{t("trips.export.today")}</SelectItem>
                                <SelectItem value="this_week">{t("trips.export.thisWeek")}</SelectItem>
                                <SelectItem value="this_month">{t("trips.export.thisMonth")}</SelectItem>
                                <SelectItem value="all_time">{t("trips.export.allTime")}</SelectItem>
                                <SelectItem value="custom">{t("trips.export.custom")}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>{t("trips.export.specificRange")}</Label>
                        <DatePickerWithRange
                            date={exportDateRange}
                            onDateChange={(range) => {
                                setExportDateRange(range);
                                setDatePreset("custom");
                            }}
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-4 mt-6 pt-4 border-t border-border">
                    <div className="flex items-center text-sm">
                        {isCounting ? (
                            <span className="flex items-center text-muted-foreground">
                                <Loader2 className="w-3 h-3 mr-2 animate-spin" /> {t("trips.export.calculating")}
                            </span>
                        ) : exportCount !== null ? (
                            <span>
                                <span className={`font-semibold ${exportCount === 0 ? "text-destructive" : "text-primary"}`}>
                                    {exportCount}
                                </span>
                                <span className="text-muted-foreground"> {t("trips.export.matchingTrips")}</span>
                            </span>
                        ) : null}
                    </div>

                    {/* UI FIX: Changed sm:gap-0 to gap-4 to ensure buttons don't overlap */}
                    <DialogFooter className="flex flex-col sm:flex-row sm:justify-between w-full gap-4">
                        <Button
                            variant="ghost"
                            onClick={handleClearModalFilters}
                            className="w-full sm:w-auto text-muted-foreground hover:text-foreground"
                        >
                            {t("trips.export.clearFilters")}
                        </Button>

                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 sm:flex-none">
                                {t("trips.export.cancel")}
                            </Button>
                            <Button
                                onClick={confirmExport}
                                disabled={isExporting || isCounting || exportCount === 0}
                                className="flex-1 sm:flex-none"
                            >
                                {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                                {isExporting ? t("trips.export.exporting") : t("trips.export.confirmExport")}
                            </Button>
                        </div>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}