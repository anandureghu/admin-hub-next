import { useState } from "react";
import { Plus, Smartphone, CheckCircle2, Circle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAllAppConfigs, useDeleteAppConfig } from "../hooks/useAppConfig";
import { AppConfigDialog } from "./AppConfigDialog";
import { AppConfig } from "../schemas/appConfig.schema";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { toast } from "sonner";

export function AppConfigs() {
  const { data: configs, isLoading } = useAllAppConfigs();
  const { mutateAsync: deleteAppConfig } = useDeleteAppConfig();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<AppConfig | null>(null);

  const handleCreate = () => {
    setSelectedConfig(null);
    setDialogOpen(true);
  };

  const handleEdit = (config: AppConfig) => {
    setSelectedConfig(config);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAppConfig(id);
      toast.success("App configuration deleted");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to delete configuration");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Smartphone className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">App Versions & Configuration</h2>
        </div>
        <Button onClick={handleCreate} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          New Configuration
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading configurations...</div>
      ) : (
        <div className="space-y-3">
          {configs?.length === 0 ? (
            <div className="text-center py-8 border border-dashed rounded-lg text-muted-foreground bg-muted/10">
              No configurations found. Create one to get started.
            </div>
          ) : (
            configs?.map((config, index) => {
              const isInitialDefault = index === configs.length - 1;
              return (
              <div
                key={config.id}
                className={`p-4 border rounded-lg flex items-center justify-between transition-colors hover:bg-muted/30 ${
                  config.is_active ? "border-primary/50 bg-primary/5" : "border-border bg-card"
                }`}
              >
                <div 
                  className="flex items-center gap-4 cursor-pointer flex-1"
                  onClick={() => handleEdit(config)}
                >
                  {config.is_active ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">v{config.latest_version}</span>
                      {config.is_active && (
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground flexitems-center gap-2 mt-1">
                      <span>Min: {config.min_supported_version}</span>
                      <span>•</span>
                      <span>Updates: {config.update_mode}</span>
                      {config.maintenance_mode && (
                        <>
                          <span>•</span>
                          <span className="text-destructive">Maintenance</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(config)}>
                    Edit
                  </Button>
                  {!isInitialDefault && (
                    <ConfirmationModal
                      title="Delete Configuration"
                      description={`Are you sure you want to delete version ${config.latest_version}? This action cannot be undone.`}
                      variant="destructive"
                      onConfirm={() => handleDelete(config.id)}
                    >
                      <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </ConfirmationModal>
                  )}
                </div>
              </div>
              );
            })
          )}
        </div>
      )}

      <AppConfigDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        config={selectedConfig}
      />
    </div>
  );
}
