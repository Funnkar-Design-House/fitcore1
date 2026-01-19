import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "@/contexts/DataContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import MembersTestPage from "./pages/MembersTestPage";
import MembershipPlans from "./pages/MembershipPlans";
import Payments from "./pages/Payments";
import EntryLog from "./pages/EntryLog";
import ExpiryAlerts from "./pages/ExpiryAlerts";
import CalendarView from "./pages/CalendarView";
import Settings from "./pages/Settings";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();



import MemberLogin from "./pages/MemberLogin";
import MemberDashboard from "./pages/MemberDashboard";
import MemberCalendarView from "./pages/MemberCalendarView";
import MemberPaymentHistory from "./pages/MemberPaymentHistory";
import MemberSettings from "./pages/MemberSettings";
import MemberTrainingPlan from "./pages/MemberTrainingPlan";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              {/* Member login and dashboard routes (separate from admin panel) */}
              <Route path="/member-login" element={<MemberLogin />} />
              <Route
                path="/member-dashboard"
                element={
                  <ProtectedRoute roles={["member", "admin", "staff"]}>
                    <MemberDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/member-calendar"
                element={
                  <ProtectedRoute roles={["member", "admin", "staff"]}>
                    <MemberCalendarView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/member-payments"
                element={
                  <ProtectedRoute roles={["member", "admin", "staff"]}>
                    <MemberPaymentHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/member-settings"
                element={
                  <ProtectedRoute roles={["member", "admin", "staff"]}>
                    <MemberSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/member-training"
                element={
                  <ProtectedRoute roles={["member", "admin", "staff"]}>
                    <MemberTrainingPlan />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute roles={["admin", "staff"]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/members"
                element={
                  <ProtectedRoute roles={["admin", "staff"]}>
                    <Members />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/members-test"
                element={
                  <ProtectedRoute roles={["admin", "staff"]}>
                    <MembersTestPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/plans"
                element={
                  <ProtectedRoute roles={["admin", "staff"]}>
                    <MembershipPlans />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payments"
                element={
                  <ProtectedRoute roles={["admin", "staff"]}>
                    <Payments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/entry-log"
                element={
                  <ProtectedRoute roles={["admin", "staff"]}>
                    <EntryLog />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/expiry-alerts"
                element={
                  <ProtectedRoute roles={["admin", "staff"]}>
                    <ExpiryAlerts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute roles={["admin", "staff"]}>
                    <CalendarView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute roles={["admin", "staff"]}>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
