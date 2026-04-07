import { useState, useEffect } from "react";
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

interface ExportTripsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    // Props to sync with the main page's current filters
    initialStatus: string;
    initialUserIds: string[];
    initialDateRange: DateRange | undefined;
    // User data for the dropdown
    usersData: any[];
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
    const [isExporting, setIsExporting] = useState(false);
    const [exportStatus, setExportStatus] = useState<string>("all");
    const [exportUserIds, setExportUserIds] = useState<string[]>([]);
    const [exportDateRange, setExportDateRange] = useState<DateRange | undefined>();
    const [datePreset, setDatePreset] = useState<string>("custom");

    const [exportCount, setExportCount] = useState<number | null>(null);
    const [isCounting, setIsCounting] = useState(false);

    // Sync initial filters when the dialog opens
    useEffect(() => {
        if (open) {
            setExportStatus(initialStatus);
            setExportUserIds(initialUserIds);
            setExportDateRange(initialDateRange);
            setDatePreset("custom");
        }
    }, [open, initialStatus, initialUserIds, initialDateRange]);

    // Live Count Fetcher
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

            const finalDataToExport = allData.filter((trip: any) => {
                return (
                    trip.vehicles?.vehicle_number.toLowerCase() ||
                    trip.users?.name.toLowerCase() ||
                    trip.users?.email.toLowerCase()
                );
            });

            if (finalDataToExport.length === 0) {
                toast.error("No data to export with selected filters", { id: "export-toast" });
                return;
            }

            downloadCSV(finalDataToExport, `Trips_Export_${format(new Date(), "yyyy-MM-dd")}`);
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to export data", { id: "export-toast" });
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card border-border sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Export Trips Data</DialogTitle>
                    <DialogDescription>
                        Adjust the filters below to configure what data gets exported to your CSV.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-2 flex flex-col w-full [&>*]:w-full">
                        <Label>Employees</Label>
                        <UserMultiSelect
                            users={usersData}
                            selectedIds={exportUserIds}
                            onChange={setExportUserIds}
                            isLoading={usersLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Trip Status</Label>
                        <Select value={exportStatus} onValueChange={setExportStatus}>
                            <SelectTrigger className="w-full bg-input border-border">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border">
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="STARTED">In Progress</SelectItem>
                                <SelectItem value="ENDED">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Quick Date Select</Label>
                        <Select value={datePreset} onValueChange={handleDatePresetChange}>
                            <SelectTrigger className="w-full bg-input border-border">
                                <SelectValue placeholder="Select timeframe" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border">
                                <SelectItem value="today">Today's Trips</SelectItem>
                                <SelectItem value="this_week">This Week's Trips</SelectItem>
                                <SelectItem value="this_month">This Month's Trips</SelectItem>
                                <SelectItem value="all_time">All Time</SelectItem>
                                <SelectItem value="custom">Custom Range</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Specific Date Range</Label>
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
                                <Loader2 className="w-3 h-3 mr-2 animate-spin" /> Calculating...
                            </span>
                        ) : exportCount !== null ? (
                            <span>
                                <span className={`font-semibold ${exportCount === 0 ? "text-destructive" : "text-primary"}`}>
                                    {exportCount}
                                </span>
                                <span className="text-muted-foreground"> matching trips found</span>
                            </span>
                        ) : null}
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row sm:justify-between w-full gap-4 sm:gap-0">
                        <Button
                            variant="ghost"
                            onClick={handleClearModalFilters}
                            className="w-full sm:w-auto text-muted-foreground hover:text-foreground"
                        >
                            Clear Filters
                        </Button>

                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 sm:flex-none">
                                Cancel
                            </Button>
                            <Button
                                onClick={confirmExport}
                                disabled={isExporting || isCounting || exportCount === 0}
                                className="flex-1 sm:flex-none"
                            >
                                {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                                {isExporting ? "Exporting..." : "Confirm Export"}
                            </Button>
                        </div>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}