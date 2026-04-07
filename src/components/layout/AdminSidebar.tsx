import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  MapPin, 
  Receipt, 
  Settings, 
  LogOut,
  Truck,
  AlertOctagon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ConfirmationModal } from "../ui/confirmation-modal";
import { LanguageSwitcher } from "../LanguageSwitcher";

const getNavItems = (t: TFunction) => [
  { to: "/dashboard", label: t("navigation.dashboard"), icon: LayoutDashboard },
  { to: "/employees", label: t("navigation.employees"), icon: Users },
  { to: "/vehicles", label: t("navigation.vehicles"), icon: Car },
  { to: "/trips", label: t("navigation.trips"), icon: MapPin },
  { to: "/accidents", label: t("navigation.accidents"), icon: AlertOctagon },
  { to: "/receipts", label: t("navigation.receipts"), icon: Receipt },
  { to: "/settings", label: t("navigation.settings"), icon: Settings },
];

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const navItems = getNavItems(t);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      navigate("/auth");
    }
  };

  return (
    <aside className="w-64 h-full bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="stat-icon w-10 h-10 flex items-center justify-center bg-primary rounded-lg">
            <Truck className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">TripTrack</h1>
            <p className="text-xs text-muted-foreground">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "nav-link",
                isActive && "nav-link-active"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Language Switcher and Logout */}
      <div className="space-y-3 p-4 border-t border-sidebar-border mt-auto">
        <LanguageSwitcher />
        <ConfirmationModal
          title={t("sidebar.areYouSure")}
          description={t("sidebar.logoutDescription")}
          confirmText={t("sidebar.confirmLogout")}
          variant="destructive"
          onConfirm={handleLogout}
        >
          {/* This button becomes the 'children' and acts as the trigger */}
          <button className="nav-link w-full text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer">
            <LogOut className="w-5 h-5" />
            <span>{t("sidebar.logout")}</span>
          </button>
        </ConfirmationModal>
      </div>
    </aside>
  );
}