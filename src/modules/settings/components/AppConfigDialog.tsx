import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
      toast.success(config ? "App configuration updated" : "App configuration created");
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to save app configuration");
    }
  };

  const updateMode = form.watch("update_mode");
  const maintenanceMode = form.watch("maintenance_mode");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle>{config ? "Edit App Configuration" : "New App Configuration"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="flex items-center justify-between border p-3 rounded-lg bg-muted/20">
            <div className="space-y-0.5">
              <Label>Active Configuration</Label>
              <p className="text-xs text-muted-foreground">
                Turning this on will automatically deactivate any other active configuration.
              </p>
            </div>
            <Switch
              checked={form.watch("is_active")}
              onCheckedChange={(val) => form.setValue("is_active", val)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Latest Version</Label>
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
              <Label>Min Supported Version</Label>
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
              <Label>Update Mode</Label>
              <Select
                value={updateMode}
                onValueChange={(val: "NONE" | "WARNING" | "FORCE") => form.setValue("update_mode", val)}
              >
                <SelectTrigger className="bg-input">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">None</SelectItem>
                  <SelectItem value="WARNING">Warning</SelectItem>
                  <SelectItem value="FORCE">Force</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>APK URL</Label>
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
            <h3 className="font-medium text-sm">Update Messages</h3>

            <div className="space-y-2">
              <Label>Warning Message</Label>
              <Textarea
                {...form.register("warning_message")}
                placeholder="Message shown for optional update"
                className="bg-input border-border resize-none"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Force Message</Label>
              <Textarea
                {...form.register("force_message")}
                placeholder="Message shown for forced update"
                className="bg-input border-border resize-none"
                rows={2}
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="font-medium text-sm flex items-center justify-between">
              <span>Maintenance Mode</span>
              <Switch
                checked={maintenanceMode}
                onCheckedChange={(val) => form.setValue("maintenance_mode", val)}
              />
            </h3>

            {maintenanceMode && (
              <div className="space-y-2">
                <Label>Maintenance Message</Label>
                <Textarea
                  {...form.register("maintenance_message")}
                  placeholder="Message shown during maintenance"
                  className="bg-input border-border resize-none"
                  rows={2}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
