import { Users, Car, MapPin, Receipt, Clock } from "lucide-react";
import { StatCard } from "./StatCard";
import { StatusBadge } from "@/components/ui/status-badge";
import { useDashboardQuery } from "../hooks/useDashboardQuery";

export default function Dashboard() {
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
        <h1 className="page-header">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your fleet overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Employees"
          value={isLoading ? "..." : stats.totalEmployees}
          icon={Users}
        />
        <StatCard
          title="Active Vehicles"
          value={isLoading ? "..." : stats.activeVehicles}
          icon={Car}
        />
        <StatCard
          title="Trips Today"
          value={isLoading ? "..." : stats.activeTrips}
          icon={MapPin}
        />
        <StatCard
          title="Pending Receipts"
          value={isLoading ? "..." : stats.totalReceipts}
          icon={Receipt}
        />
      </div>

      {/* Recent Trips Table */}
      <div className="stat-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Recent Trips</h2>
          <Clock className="w-5 h-5 text-muted-foreground" />
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading dashboard data...</div>
        ) : recentTrips.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No trips recorded yet. Trips will appear here once employees start tracking.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Vehicle</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTrips.map((trip) => (
                <tr key={trip.id} className="animate-fade-in">
                  <td className="font-medium">{trip.users?.name || "Unknown"}</td>
                  <td>{trip.vehicles?.vehicle_number || "N/A"}</td>
                  <td>{new Date(trip.trip_date).toLocaleDateString()}</td>
                  <td>
                    <StatusBadge
                      status={trip.status === "STARTED" ? "started" : "ended"}
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
