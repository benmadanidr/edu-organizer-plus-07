import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
  requiredPermission?: keyof ReturnType<typeof useAdminAuth>['adminUser']['permissions'];
}

const ProtectedAdminRoute = ({ children, requiredPermission }: ProtectedAdminRouteProps) => {
  const { isAuthenticated, hasPermission, adminUser } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Add a small delay to ensure AdminAuthProvider has loaded from localStorage
    const checkAuth = () => {
      if (!isAuthenticated) {
        navigate("/admin-login", { replace: true });
        return;
      }

      if (requiredPermission && !hasPermission(requiredPermission)) {
        navigate("/admin", { replace: true });
        return;
      }
    };

    // Check immediately if adminUser is already loaded
    if (adminUser !== null || !isAuthenticated) {
      checkAuth();
    } else {
      // If adminUser is null but we might be loading from localStorage, wait a bit
      const timeoutId = setTimeout(checkAuth, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isAuthenticated, hasPermission, requiredPermission, navigate, adminUser]);

  if (!isAuthenticated) {
    return null;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-muted-foreground mb-2">
            ليس لديك صلاحية للوصول
          </h2>
          <p className="text-muted-foreground">
            تحتاج إلى صلاحيات إضافية للوصول إلى هذه الصفحة
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;