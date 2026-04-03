import { format } from "date-fns";

export interface ExportTripRecord {
  trip_date: string;
  status: string;
  start_km: number | null;
  end_km: number | null;
  users?: {
    name: string;
    email?: string;
  } | null;
  vehicles?: {
    vehicle_number: string;
    vehicle_type?: string | null;
  } | null;
  work_sessions?: {
    start_time: string | null;
    end_time: string | null;
    notes: string | null;
  }[];
  accident_reports?: {
    description: string;
    created_at: string;
  }[];
  receipts?: {
    amount: number | string | null;
    description: string | null;
    created_at: string;
  }[];
}

type CSVValue = string | number | null | undefined;

const escapeCSV = (value: CSVValue): string => {
  if (value === null || value === undefined) return '""';
  const stringValue = String(value);
  return `"${stringValue.replace(/"/g, '""')}"`;
};

export function downloadCSV(data: ExportTripRecord[], filename: string) {
  if (!data || !data.length) return;

  const headers = [
    "Trip Date", "Driver", "Vehicle", "Status", "Distance (KM)", 
    "Work Sessions", "Incident Reports", "Receipts", "Total Expenses"
  ];
  
  const csvRows = data.map(trip => {
    // Calculate distance
    const distance = trip.start_km !== null && trip.end_km !== null 
      ? (trip.end_km - trip.start_km).toString() 
      : "N/A";

    const workSessions = trip.work_sessions && trip.work_sessions.length > 0 
      ? trip.work_sessions.map((w) => {
          const start = w.start_time ? format(new Date(w.start_time), "HH:mm") : "?";
          const end = w.end_time ? format(new Date(w.end_time), "HH:mm") : "Active";
          return `[${start} - ${end}] ${w.notes || "No notes"}`;
        }).join("\n")
      : "None";

    const accidents = trip.accident_reports && trip.accident_reports.length > 0
      ? trip.accident_reports.map((a) => `- ${a.description}`).join("\n")
      : "None";

    const receipts = trip.receipts && trip.receipts.length > 0
      ? trip.receipts.map((r) => `- ${r.description || "Expense"}: $${r.amount || 0}`).join("\n")
      : "None";

    const totalExpenses = trip.receipts && trip.receipts.length > 0
      ? trip.receipts.reduce((sum, r) => sum + (Number(r.amount) || 0), 0)
      : 0;

    return [
      trip.trip_date,
      trip.users?.name || "Unassigned",
      trip.vehicles?.vehicle_number || "Unassigned",
      trip.status,
      distance,
      workSessions,
      accidents,
      receipts,
      totalExpenses
    ];
  });

  // Combine headers and rows using the escape function
  const csvContent = [
    headers.join(","),
    ...csvRows.map(row => row.map(escapeCSV).join(","))
  ].join("\n");

  // Trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}