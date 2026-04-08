import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { User, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppConfigs } from "@/modules/settings/components/AppConfigs";

interface Profile {
  id: string;
  name: string;
  phone: string | null;
  email: string;
}

export default function Settings() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });

  const fetchProfile = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", user.email)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setFormData({ name: data.name, phone: data.phone || "" });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error(t("settings.errorSaving"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    try {
      // German Mobile Validation
      const phoneRegex = /^(\+49|0049|0)\s?1[567]\d{1,2}\s?\d{7,8}$/;
      if (formData.phone && !phoneRegex.test(formData.phone)) {
        toast.error(t("settings.validation.invalidPhone"));
        setSaving(false);
        return;
      }

      // Duplicate Check
      if (formData.phone && formData.phone !== profile.phone) {
        const { data: existingUsers } = await supabase
          .from("users")
          .select("id")
          .eq("phone", formData.phone)
          .neq("email", profile.email);

        if (existingUsers && existingUsers.length > 0) {
          toast.error(t("settings.validation.phoneExists"));
          setSaving(false);
          return;
        }
      }

      const { error } = await supabase
        .from("users")
        .update({
          name: formData.name,
          phone: formData.phone || null,
        })
        .eq("email", profile.email);

      if (error) throw error;

      toast.success(t("settings.changeSaved"));
      fetchProfile();
    } catch (error) {
      toast.error(t("settings.errorSaving"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">{t("settings.loading")}</div>;
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto space-y-8 max-w-4xl pr-2 pb-4 custom-scrollbar">
      <div>
        <h1 className="page-header">{t("settings.title")}</h1>
        <p className="text-muted-foreground">{t("settings.subtitle")}</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6 bg-input">
          <TabsTrigger value="profile" className="flex items-center gap-2 cursor-pointer">
            <User className="w-4 h-4" />
            {t("settings.profile")}
          </TabsTrigger>
          <TabsTrigger value="app-config" className="flex items-center gap-2 cursor-pointer">
            <Smartphone className="w-4 h-4" />
            {t("settings.appConfiguration")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-8">
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">{t("settings.profileSettings")}</h2>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("settings.fullName")}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-input border-border"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t("settings.phoneNumber")}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^\d+\s]/g, "") })}
                  className="bg-input border-border"
                  placeholder="+49 151 12345678"
                />
              </div>

              <Button type="submit" disabled={saving}>
                {saving ? t("settings.saving") : t("settings.saveChanges")}
              </Button>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="app-config">
          <div className="stat-card">
            <AppConfigs />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}