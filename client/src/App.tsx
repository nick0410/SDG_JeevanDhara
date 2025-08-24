import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { NotificationContainer, useNotifications } from "@/components/ui/notification";

// Pages
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/dashboard" component={Dashboard} />
        </>
      )}
      {/* Public routes available for all users */}
      <Route path="/explore" component={Landing} />
      <Route path="/submit" component={Landing} />
      <Route path="/verify" component={Landing} />
      <Route path="/help" component={Landing} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <NotificationContainer 
          notifications={notifications} 
          onRemove={removeNotification}
          position="top-right"
        />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
