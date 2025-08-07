import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Users,
  GraduationCap,
  Settings,
  CreditCard,
  DollarSign,
  School,
  CalendarX,
  Shield,
  LayoutDashboard,
  LogOut,
  ClipboardList,
  Palette,
  Paintbrush
} from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const adminItems = [
  { title: "لوحة التحكم", url: "/admin", icon: LayoutDashboard },
  { title: "مراجعة طلبات التسجيل", url: "/admin/review-registrations", icon: ClipboardList },
  { title: "إدارة الطلاب", url: "/admin/students", icon: GraduationCap },
  { title: "إدارة المعلمين", url: "/admin/teachers", icon: Users },
  { title: "تصميم البطاقات", url: "/admin/card-design", icon: Paintbrush },
  { title: "البطاقات", url: "/admin/cards", icon: CreditCard },
  { title: "إدارة المحتوى", url: "/admin/content", icon: Palette },
  { title: "الصلاحيات", url: "/admin/permissions", icon: Shield },
  { title: "المعاملات المالية", url: "/admin/transactions", icon: DollarSign },
  { title: "إدارة الفصول", url: "/admin/classrooms", icon: School },
  { title: "إدارة الغيابات", url: "/admin/attendance", icon: CalendarX },
  { title: "الإعدادات", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { adminUser, hasPermission, logout } = useAdminAuth();

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted/50";

  // Filter admin items based on permissions
  const filteredAdminItems = adminItems.filter(item => {
    switch (item.url) {
      case "/admin/review-registrations":
        return hasPermission("students");
      case "/admin/students":
        return hasPermission("students");
      case "/admin/teachers":
        return hasPermission("teachers");
      case "/admin/card-design":
        return hasPermission("settings");
      case "/admin/content":
        return hasPermission("settings");
      case "/admin/permissions":
        return hasPermission("settings");
      case "/admin/transactions":
        return hasPermission("financial");
      case "/admin/cards":
        return hasPermission("financial");
      case "/admin/classrooms":
        return hasPermission("classrooms");
      case "/admin/attendance":
        return hasPermission("attendance");
      case "/admin/settings":
        return hasPermission("settings");
      default:
        return true; // Dashboard is always accessible
    }
  });

  return (
    <Sidebar side="right" className="border-l border-r-0">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-semibold text-right">
            لوحة تحكم الإدارة
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredAdminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <div className="flex items-center justify-between w-full">
                        <span className="text-foreground font-medium">{item.title}</span>
                        <item.icon className="h-4 w-4 text-foreground flex-shrink-0" />
                      </div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Info and Logout */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <div className="p-4 border-t">
              <div className="mb-3 text-right">
                <p className="font-medium text-sm text-foreground">{adminUser?.name}</p>
                <p className="text-xs text-muted-foreground">{adminUser?.role}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="w-full text-foreground hover:text-foreground hover:bg-muted"
              >
                <div className="flex items-center justify-between w-full">
                  <span>تسجيل الخروج</span>
                  <LogOut className="h-4 w-4 flex-shrink-0" />
                </div>
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}