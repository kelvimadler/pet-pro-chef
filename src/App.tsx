import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import Productions from "./pages/Productions";
import Products from "./pages/Products";
import Menus from "./pages/Menus";
import Inventory from "./pages/Inventory";
import Labels from "./pages/Labels";
import Clients from "./pages/Clients";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NewProduction from "./pages/NewProduction";
import EditProduction from "./pages/EditProduction";
import ProductionView from "./pages/ProductionView";
import NotFound from "./pages/NotFound";
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user && location.pathname !== '/auth') {
      navigate('/auth');
    }
  }, [user, loading, navigate, location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user && location.pathname !== '/auth') {
    return null;
  }

  return <>{children}</>;
}

function AppContent() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout><Dashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/productions" element={
        <ProtectedRoute>
          <Layout><Productions /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/productions/new" element={
        <ProtectedRoute>
          <Layout><NewProduction /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/productions/view/:id" element={
        <ProtectedRoute>
          <Layout><ProductionView /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/productions/edit/:id" element={
        <ProtectedRoute>
          <Layout><EditProduction /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/products" element={
        <ProtectedRoute>
          <Layout><Products /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/menus" element={
        <ProtectedRoute>
          <Layout><Menus /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/inventory" element={
        <ProtectedRoute>
          <Layout><Inventory /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/labels" element={
        <ProtectedRoute>
          <Layout><Labels /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/clients" element={
        <ProtectedRoute>
          <Layout><Clients /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute>
          <Layout><Reports /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Layout><Settings /></Layout>
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
