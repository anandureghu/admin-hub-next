
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import Auth from "./pages/Auth";
import Dashboard from "./modules/dashboard/components/Dashboard";
import Vehicles from "./modules/vehicles/components/Vehicles";
import Trips from "./modules/trips/components/Trips";
import Receipts from "./modules/receipts/components/Receipts";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import TripDetails from "./modules/trips/components/TripDetails";
import WorkDetails from "./modules/trips/components/WorkDetails";
import Employees from "./modules/employees/components/Employees";
import EmployeeDetail from "./modules/employees/components/EmployeeeDetail";
import Accidents from "./modules/accidents/components/Accidents";
import AccidentDetails from "./modules/accidents/components/AccidentDetails";


const queryClient = new QueryClient();

const App = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set default language to English if none is selected, otherwise use saved language
    const savedLang = localStorage.getItem("i18nextLng");
    if (!savedLang) {
      i18n.changeLanguage("en-GB");
      localStorage.setItem("i18nextLng", "en-GB");
    } else if (i18n.language !== savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="bottom-right" theme="dark" richColors />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/auth" element={<Auth />} />
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/trips" element={<Trips />} />
              <Route path="/accidents" element={<Accidents />} />
              <Route path="/accidents/:accidentId" element={<AccidentDetails />} />
              {/* New Dynamic Route for Trip Details */}
              <Route path="/trip/:id" element={<TripDetails />} />
              <Route path="/employees/:id" element={<EmployeeDetail />} />
              <Route path="/trips/:tripId/work/:workId" element={<WorkDetails />} />
              <Route path="/receipts" element={<Receipts />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
