import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";
import {
  AdminAuthProvider,
  useAdminAuth,
} from "@/components/admin/AdminAuthContext";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminLayout from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/admin")({
  component: AdminRouteContainer,
});

function AdminRouteContainer() {
  return (
    <AdminAuthProvider>
      <AdminRouteComponent />
    </AdminAuthProvider>
  );
}

function AdminRouteComponent() {
  const { token, isMounted } = useAdminAuth();

  if (!isMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!token) {
    return <AdminLogin />;
  }

  return <AdminLayout />;
}
