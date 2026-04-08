import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Smartphone, CheckCircle2, Circle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAllAppConfigs, useDeleteAppConfig } from "../hooks/useAppConfig";
import { AppConfigDialog } from "./AppConfigDialog";
import { AppConfig } from "../schemas/appConfig.schema";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { toast } from "sonner";

export function AppConfigs() {
  const { t } = useTranslation();
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
      toast.success(t("settings.appConfigs.deleteSuccess"));
    } catch (error) {
      toast.error(t("settings.errorSaving"));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Smartphone className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">{t("settings.appConfigs.title")}</h2>
        </div>
        <Button onClick={handleCreate} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          {t("settings.appConfigs.newConfig")}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">{t("settings.appConfigs.loading")}</div>
      ) : (
        <div className="space-y-3">
          {configs?.length === 0 ? (
            <div className="text-center py-8 border border-dashed rounded-lg text-muted-foreground bg-muted/10">
              {t("settings.appConfigs.noConfigs")}
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
                            {t("settings.appConfigs.active")}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                        <span>{t("settings.appConfigs.minVersion")}: {config.min_supported_version}</span>
                        <span>•</span>
                        <span>{t("settings.appConfigs.updates")}: {config.update_mode}</span>
                        {config.maintenance_mode && (
                          <>
                            <span>•</span>
                            <span className="text-destructive">{t("settings.appConfigs.maintenance")}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(config)}>
                      {t("settings.appConfigs.edit")}
                    </Button>
                    {!isInitialDefault && (
                      <ConfirmationModal
                        title={t("settings.appConfigs.deleteTitle")}
                        description={t("settings.appConfigs.deleteDesc", { version: config.latest_version })}
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