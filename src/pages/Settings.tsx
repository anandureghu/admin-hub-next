import { useState, useEffect } from "react";
import { User, Building, Shield, Smartphone } from "lucide-react";
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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
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
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    try {
      // 1. NEW: Strict Format Validation (German Mobile Number)
      const phoneRegex = /^(\+49|0049|0)\s?1[567]\d{1,2}\s?\d{7,8}$/;
      if (formData.phone && !phoneRegex.test(formData.phone)) {
        toast.error("Please enter a valid German mobile number.");
        setSaving(false);
        return; // Stop the save
      }

      // 2. Duplicate Check
      if (formData.phone && formData.phone !== profile.phone) {
        const { data: existingUsers, error: checkError } = await supabase
          .from("users")
          .select("id")
          .eq("phone", formData.phone)
          .neq("email", profile.email);

        if (checkError) throw checkError;

        if (existingUsers && existingUsers.length > 0) {
          toast.error("An account with this phone number already exists.");
          setSaving(false);
          return; // Stop the save
        }
      }

      // 3. Proceed with update
      const { error } = await supabase
        .from("users")
        .update({
          name: formData.name,
          phone: formData.phone || null,
        })
        .eq("email", profile.email);

      if (error) throw error;

      toast.success("Profile updated successfully");
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">Loading settings...</div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto space-y-8 max-w-4xl pr-2 pb-4 custom-scrollbar">
      <div>
        <h1 className="page-header">Settings</h1>
        <p className="text-muted-foreground">Manage your account and app preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6 bg-input">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="app-config" className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            App Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-8">
          {/* Profile Settings */}
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Profile Settings</h2>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-input border-border"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    const cleanedValue = e.target.value.replace(/[^\d+\s]/g, "");
                    setFormData({ ...formData, phone: cleanedValue });
                  }}
                  className="bg-input border-border"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </div>

          {/* Company Settings (placeholder) */}
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-6">
              <Building className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Company Settings</h2>
            </div>
            <p className="text-muted-foreground text-sm">
              Company settings will be available in a future update. You'll be able to manage company details, branding, and team preferences here.
            </p>
          </div>

          {/* Security Settings (placeholder) */}
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Security</h2>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Security settings including password changes and two-factor authentication will be available in a future update.
            </p>
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
