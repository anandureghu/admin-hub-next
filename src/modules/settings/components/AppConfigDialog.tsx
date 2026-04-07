import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { appConfigFormSchema, AppConfigFormValues, AppConfig } from "../schemas/appConfig.schema";
import { useUpsertAppConfig } from "../hooks/useAppConfig";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AppConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config?: AppConfig | null;
}

export function AppConfigDialog({ open, onOpenChange, config }: AppConfigDialogProps) {
  const { t } = useTranslation();
  const { mutateAsync: upsertAppConfig, isPending } = useUpsertAppConfig();

  const form = useForm<AppConfigFormValues>({
    resolver: zodResolver(appConfigFormSchema),
    defaultValues: {
      latest_version: "",
      min_supported_version: "",
      update_mode: "NONE",
      warning_message: "",
      force_message: "",
      apk_url: "",
      maintenance_mode: false,
      maintenance_message: "",
      is_active: false,
    },
  });

  useEffect(() => {
    if (config && open) {
      form.reset({
        id: config.id,
        latest_version: config.latest_version,
        min_supported_version: config.min_supported_version,
        update_mode: config.update_mode,
        warning_message: config.warning_message || "",
        force_message: config.force_message || "",
        apk_url: config.apk_url || "",
        maintenance_mode: config.maintenance_mode || false,
        maintenance_message: config.maintenance_message || "",
        is_active: config.is_active || false,
      });
    } else if (open) {
      form.reset({
        latest_version: "",
        min_supported_version: "",
        update_mode: "NONE",
        warning_message: "",
        force_message: "",
        apk_url: "",
        maintenance_mode: false,
        maintenance_message: "",
        is_active: false,
      });
    }
  }, [config, open, form]);

  const onSubmit = async (data: AppConfigFormValues) => {
    try {
      await upsertAppConfig(data);
      toast.success(
        config 
          ? t("settings.appConfigs.dialog.successUpdate") 
          : t("settings.appConfigs.dialog.successCreate")
      );
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error(t("settings.errorSaving"));
    }
  };

  const updateMode = form.watch("update_mode");
  const maintenanceMode = form.watch("maintenance_mode");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle>
            {config ? t("settings.appConfigs.dialog.editTitle") : t("settings.appConfigs.dialog.newTitle")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="flex items-center justify-between border p-3 rounded-lg bg-muted/20">
            <div className="space-y-0.5">
              <Label>{t("settings.appConfigs.dialog.activeLabel")}</Label>
              <p className="text-xs text-muted-foreground">
                {t("settings.appConfigs.dialog.activeDesc")}
              </p>
            </div>
            <Switch
              checked={form.watch("is_active")}
              onCheckedChange={(val) => form.setValue("is_active", val)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("settings.appConfigs.dialog.latestVersion")}</Label>
              <Input
                {...form.register("latest_version")}
                placeholder="e.g. 1.0.0"
                className="bg-input border-border"
              />
              {form.formState.errors.latest_version && (
                <p className="text-sm text-destructive">{form.formState.errors.latest_version.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t("settings.appConfigs.dialog.minVersion")}</Label>
              <Input
                {...form.register("min_supported_version")}
                placeholder="e.g. 0.9.0"
                className="bg-input border-border"
              />
              {form.formState.errors.min_supported_version && (
                <p className="text-sm text-destructive">{form.formState.errors.min_supported_version.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t("settings.appConfigs.dialog.updateMode")}</Label>
              <Select
                value={updateMode}
                onValueChange={(val: "NONE" | "WARNING" | "FORCE") => form.setValue("update_mode", val)}
              >
                <SelectTrigger className="bg-input">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">{t("settings.appConfigs.dialog.mode.none")}</SelectItem>
                  <SelectItem value="WARNING">{t("settings.appConfigs.dialog.mode.warning")}</SelectItem>
                  <SelectItem value="FORCE">{t("settings.appConfigs.dialog.mode.force")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("settings.appConfigs.dialog.apkUrl")}</Label>
              <Input
                {...form.register("apk_url")}
                placeholder="https://..."
                className="bg-input border-border"
              />
              {form.formState.errors.apk_url && (
                <p className="text-sm text-destructive">{form.formState.errors.apk_url.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="font-medium text-sm">{t("settings.appConfigs.dialog.updateMessages")}</h3>

            <div className="space-y-2">
              <Label>{t("settings.appConfigs.dialog.warningMessage")}</Label>
              <Textarea
                {...form.register("warning_message")}
                placeholder={t("settings.appConfigs.dialog.warningPlaceholder")}
                className="bg-input border-border resize-none"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("settings.appConfigs.dialog.forceMessage")}</Label>
              <Textarea
                {...form.register("force_message")}
                placeholder={t("settings.appConfigs.dialog.forcePlaceholder")}
                className="bg-input border-border resize-none"
                rows={2}
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="font-medium text-sm flex items-center justify-between">
              <span>{t("settings.appConfigs.dialog.maintenanceMode")}</span>
              <Switch
                checked={maintenanceMode}
                onCheckedChange={(val) => form.setValue("maintenance_mode", val)}
              />
            </h3>

            {maintenanceMode && (
              <div className="space-y-2">
                <Label>{t("settings.appConfigs.dialog.maintenanceMessage")}</Label>
                <Textarea
                  {...form.register("maintenance_message")}
                  placeholder={t("settings.appConfigs.dialog.maintenancePlaceholder")}
                  className="bg-input border-border resize-none"
                  rows={2}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("settings.appConfigs.dialog.cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? t("settings.saving") : t("settings.appConfigs.dialog.save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}