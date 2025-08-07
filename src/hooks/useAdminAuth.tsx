import { useState, useEffect, createContext, useContext, ReactNode } from "react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: {
    students: boolean;
    teachers: boolean;
    financial: boolean;
    settings: boolean;
    classrooms: boolean;
    attendance: boolean;
  };
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  login: (user: AdminUser) => void;
  logout: () => void;
  hasPermission: (permission: keyof AdminUser['permissions']) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("adminUser");
    if (storedUser) {
      try {
        setAdminUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("adminUser");
      }
    }
  }, []);

  const login = (user: AdminUser) => {
    setAdminUser(user);
    localStorage.setItem("adminUser", JSON.stringify(user));
  };

  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem("adminUser");
    // Redirect to login page after logout
    window.location.href = "/admin-login";
  };

  const hasPermission = (permission: keyof AdminUser['permissions']) => {
    return adminUser?.permissions[permission] || false;
  };

  const value = {
    adminUser,
    isAuthenticated: !!adminUser,
    login,
    logout,
    hasPermission,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};