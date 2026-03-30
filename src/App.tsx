import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardLayout } from "@/components/DashboardLayout";
import OverviewPage from "./pages/OverviewPage";
import MonitoringPage from "./pages/MonitoringPage";
import IrrigationPage from "./pages/IrrigationPage";
import AlertsPage from "./pages/AlertsPage";
import ReservoirPage from "./pages/ReservoirPage";
import AirQualityPage from "./pages/AirQualityPage";
import DevicesPage from "./pages/DevicesPage";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/monitoring" element={<MonitoringPage />} />
            <Route path="/irrigation" element={<IrrigationPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/reservoir" element={<ReservoirPage />} />
            <Route path="/air-quality" element={<AirQualityPage />} />
            <Route path="/devices" element={<DevicesPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DashboardLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
