import { Car, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { Vehicle } from "../schemas/vehicle.schema";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface VehicleCardProps {
  vehicle: Vehicle;
  toggleVehicleStatus: (id: string, currentStatus: boolean) => void;
  handleOpenEditDialog: (vehicle: Vehicle) => void;
  isToggling?: boolean;
}

const VehicleCard = forwardRef<HTMLDivElement, VehicleCardProps>(
  ({ vehicle, toggleVehicleStatus, handleOpenEditDialog, isToggling }, ref) => {
    const { t } = useTranslation();

    return (
      <div ref={ref} className="stat-card animate-fade-in flex flex-col h-full">
        <div className="flex items-start justify-center mb-4">
          {vehicle.image_url ? (
            <img
              src={vehicle.image_url}
              alt={t("vehicles.card.imageAlt")}
              className="h-52 w-80 object-cover"
            />
          ) : (
            <div className="stat-icon h-52 w-80">
              <Car className="w-44 h-44 text-primary-foreground" />
            </div>
          )}
        </div>
        <div className="flex flex-row justify-between">
          <div className="overflow-hidden mr-2">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {vehicle.vehicle_number.toUpperCase()}
            </h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-muted-foreground text-sm mb-4 truncate block cursor-pointer">
                  {/* Translate the type stored in the database */}
                  {t(`vehicles.types.${vehicle.vehicle_type}`)}
                </p>
              </TooltipTrigger>
              {vehicle.vehicle_type && (
                <TooltipContent side="top" className="max-w-[280px] break-words text-center">
                  <p>{t(`vehicles.types.${vehicle.vehicle_type}`)}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </div>
          <div className="flex flex-row items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-16 text-muted-foreground hover:text-foreground"
              onClick={() => handleOpenEditDialog(vehicle)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <StatusBadge
              status={vehicle.is_active ? "active" : "inactive"}
              label={vehicle.is_active ? t("vehicles.card.available") : t("vehicles.card.unavailable")}
            />
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
          <span className="text-xs text-muted-foreground">
            {t("vehicles.card.added", { date: new Date(vehicle.created_at).toLocaleDateString() })}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={isToggling}
              onClick={() => toggleVehicleStatus(vehicle.id, vehicle.is_active)}
            >
              {vehicle.is_active ? t("vehicles.card.markUnavailable") : t("vehicles.card.markAvailable")}
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

export default VehicleCard;