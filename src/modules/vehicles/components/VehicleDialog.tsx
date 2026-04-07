import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/ImageUploadV1";
import { useVehicleMutations } from "../hooks/useVehicleMutations";
import {
  vehicleFormSchema,
  VehicleFormValues,
  Vehicle,
  vehicleTypes,
} from "../schemas/vehicle.schema";

interface VehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
}

export function VehicleDialog({
  open,
  onOpenChange,
  vehicle,
}: VehicleDialogProps) {
  const { t } = useTranslation();
  const { createVehicle, updateVehicle, isCreating, isUpdating } =
    useVehicleMutations();
  const [vehicleImage, setVehicleImage] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      vehicle_number: "",
      vehicle_type: "",
    },
  });

  useEffect(() => {
    if (vehicle && open) {
      form.reset({
        vehicle_number: vehicle.vehicle_number,
        vehicle_type: vehicle.vehicle_type,
      });
      setExistingImageUrl(vehicle.image_url || "");
    } else if (open) {
      form.reset({ vehicle_number: "", vehicle_type: "" });
      setExistingImageUrl("");
    }
    setVehicleImage(null);
  }, [vehicle, form, open]);

  async function checkDuplicateVehicleNumber(
    vehicleNumber: string,
    currentId: string | null
  ) {
    let query = supabase
      .from("vehicles")
      .select("id")
      .eq("vehicle_number", vehicleNumber.toUpperCase());

    if (currentId) {
      query = query.neq("id", currentId);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error checking duplicate vehicle:", error);
      throw new Error(t("vehicles.dialog.errorValidation"));
    }

    return data && data.length > 0;
  }

  async function onSubmit(values: VehicleFormValues) {
    try {
      const isDuplicate = await checkDuplicateVehicleNumber(
        values.vehicle_number,
        vehicle?.id || null
      );
      if (isDuplicate) {
        toast.error(t("vehicles.dialog.errorDuplicate"));
        form.setError("vehicle_number", {
          type: "manual",
          message: t("vehicles.dialog.errorDuplicate"),
        });
        return;
      }

      if (vehicle) {
        await updateVehicle({
          id: vehicle.id,
          updates: {
            vehicle_number: values.vehicle_number.toUpperCase(),
            vehicle_type: values.vehicle_type,
            image_url: existingImageUrl,
          },
          file: vehicleImage,
        });
      } else {
        await createVehicle({
          vehicle: {
            vehicle_number: values.vehicle_number.toUpperCase(),
            vehicle_type: values.vehicle_type,
          },
          file: vehicleImage,
        });
      }

      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  }

  const isSaving = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {vehicle ? t("vehicles.dialog.titleEdit") : t("vehicles.dialog.titleAdd")}
          </DialogTitle>
          <DialogDescription>
            {vehicle
              ? t("vehicles.dialog.descriptionEdit")
              : t("vehicles.dialog.descriptionAdd")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="vehicle_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("vehicles.dialog.vehicleNumberLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("vehicles.dialog.vehicleNumberPlaceholder")}
                      className="bg-input uppercase"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vehicle_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("vehicles.dialog.vehicleTypeLabel")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-input border-border">
                        <SelectValue placeholder={t("vehicles.dialog.vehicleTypePlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-card border-border">
                      {vehicleTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {t(`vehicles.types.${type}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>{t("vehicles.dialog.vehiclePictureLabel")}</FormLabel>
              <ImageUpload
                value={existingImageUrl}
                onChange={(file) => setVehicleImage(file)}
                onRemove={() => {
                  setVehicleImage(null);
                  setExistingImageUrl("");
                }}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                disabled={isSaving}
              >
                {t("vehicles.dialog.cancel")}
              </Button>
              <Button type="submit" className="flex-1" disabled={isSaving}>
                {isSaving
                  ? t("vehicles.dialog.saving")
                  : vehicle
                    ? t("vehicles.dialog.update")
                    : t("vehicles.dialog.add")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}