import { Users, Car, MapPin, Receipt, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { StatCard } from "./StatCard";
import { StatusBadge } from "@/components/ui/status-badge";
import { useDashboardQuery } from "../hooks/useDashboardQuery";

export default function Dashboard() {
  const { t } = useTranslation();
  const { data, isLoading } = useDashboardQuery();

  const stats = data?.stats || {
    totalEmployees: 0,
    activeVehicles: 0,
    activeTrips: 0,
    totalReceipts: 0,
  };

  const recentTrips = data?.recentTrips || [];

  return (
    <div className="flex flex-col h-full overflow-y-auto space-y-8 pr-2 pb-4 custom-scrollbar">
      <div>
        <h1 className="page-header">{t("dashboard.title")}</h1>
        <p className="text-muted-foreground">{t("dashboard.subtitle")}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t("dashboard.activeEmployees")}
          value={isLoading ? "..." : stats.totalEmployees}
          icon={Users}
        />
        <StatCard
          title={t("dashboard.activeVehicles")}
          value={isLoading ? "..." : stats.activeVehicles}
          icon={Car}
        />
        <StatCard
          title={t("dashboard.tripsToday")}
          value={isLoading ? "..." : stats.activeTrips}
          icon={MapPin}
        />
        <StatCard
          title={t("dashboard.pendingReceipts")}
          value={isLoading ? "..." : stats.totalReceipts}
          icon={Receipt}
        />
      </div>

      {/* Recent Trips Table */}
      <div className="stat-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            {t("dashboard.recentTrips")}
          </h2>
          <Clock className="w-5 h-5 text-muted-foreground" />
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            {t("dashboard.loading")}
          </div>
        ) : recentTrips.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {t("dashboard.noTrips")}
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("dashboard.table.employee")}</th>
                <th>{t("dashboard.table.vehicle")}</th>
                <th>{t("dashboard.table.date")}</th>
                <th>{t("dashboard.table.status")}</th>
              </tr>
            </thead>
            <tbody>
              {recentTrips.map((trip) => (
                <tr key={trip.id} className="animate-fade-in">
                  <td className="font-medium">
                    {trip.users?.name || t("dashboard.unknown")}
                  </td>
                  <td>
                    {trip.vehicles?.vehicle_number || t("dashboard.notAvailable")}
                  </td>
                  <td>{new Date(trip.trip_date).toLocaleDateString()}</td>
                  <td>
                    <StatusBadge
                      status={trip.status === "STARTED" ? "started" : "ended"}
                      label={
                        trip.status === "STARTED"
                          ? t("dashboard.status.started")
                          : t("dashboard.status.ended")
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}