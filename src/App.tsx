import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "@/components/ToastProvider";
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import FindBuyers from "@/pages/FindBuyers";
import BuyerDetails from "@/pages/BuyerDetails";
import SavedBuyers from "@/pages/SavedBuyers";
import EmailCampaigns from "@/pages/EmailCampaigns";
import EmailHistory from "@/pages/EmailHistory";
import Settings from "@/pages/Settings";

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/find-buyers" element={<FindBuyers />} />
          <Route path="/buyer-details" element={<BuyerDetails />} />
          <Route path="/saved-buyers" element={<SavedBuyers />} />
          <Route path="/email-campaigns" element={<EmailCampaigns />} />
          <Route path="/email-history" element={<EmailHistory />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
