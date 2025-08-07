import { Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import Navigation from "@/components/Navigation";
import AdminDashboardHome from "./admin/AdminDashboardHome";
import AdminStudents from "./admin/AdminStudents";
import AdminTeachers from "./admin/AdminTeachers";
import AdminPermissions from "./admin/AdminPermissions";
import AdminTransactions from "./admin/AdminTransactions";
import AdminCards from "./admin/AdminCards";
import AdminClassrooms from "./admin/AdminClassrooms";
import AdminAttendance from "./admin/AdminAttendance";
import AdminSettings from "./admin/AdminSettings";
import AdminReviewRegistrations from "./admin/AdminReviewRegistrations";
import AdminContentManagement from "./admin/AdminContentManagement";
import AdminCardDesign from "./admin/AdminCardDesign";
import ProtectedAdminRoute from "@/components/admin/ProtectedAdminRoute";

const AdminDashboard = () => {
  return (
    <>
      <Navigation />
      <SidebarProvider>
        <div className="flex min-h-screen w-full" dir="rtl">
          <AdminSidebar />
          <div className="flex-1 overflow-hidden">
            <header className="h-14 flex items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6 shrink-0">
              <SidebarTrigger className="ml-2 lg:ml-4" />
              <div></div>
            </header>
            
            <main className="p-4 lg:p-6 bg-gradient-to-br from-background to-muted/50 overflow-auto h-[calc(100vh-3.5rem)]">
              <ProtectedAdminRoute>
                <Routes>
                  <Route path="/" element={<AdminDashboardHome />} />
                  <Route 
                    path="/review-registrations" 
                    element={
                      <ProtectedAdminRoute requiredPermission="students">
                        <AdminReviewRegistrations />
                      </ProtectedAdminRoute>
                    } 
                  />
                  <Route 
                    path="/students" 
                    element={
                      <ProtectedAdminRoute requiredPermission="students">
                        <AdminStudents />
                      </ProtectedAdminRoute>
                    } 
                  />
                  <Route 
                    path="/teachers" 
                    element={
                      <ProtectedAdminRoute requiredPermission="teachers">
                        <AdminTeachers />
                      </ProtectedAdminRoute>
                    } 
                  />
                  <Route 
                    path="/card-design" 
                    element={
                      <ProtectedAdminRoute requiredPermission="settings">
                        <AdminCardDesign />
                      </ProtectedAdminRoute>
                    } 
                  />
                  <Route 
                    path="/content" 
                    element={
                      <ProtectedAdminRoute requiredPermission="settings">
                        <AdminContentManagement />
                      </ProtectedAdminRoute>
                    } 
                  />
                  <Route 
                    path="/permissions" 
                    element={
                      <ProtectedAdminRoute requiredPermission="settings">
                        <AdminPermissions />
                      </ProtectedAdminRoute>
                    } 
                  />
                  <Route 
                    path="/transactions" 
                    element={
                      <ProtectedAdminRoute requiredPermission="financial">
                        <AdminTransactions />
                      </ProtectedAdminRoute>
                    } 
                  />
                  <Route 
                    path="/cards" 
                    element={
                      <ProtectedAdminRoute requiredPermission="financial">
                        <AdminCards />
                      </ProtectedAdminRoute>
                    } 
                  />
                  <Route 
                    path="/classrooms" 
                    element={
                      <ProtectedAdminRoute requiredPermission="classrooms">
                        <AdminClassrooms />
                      </ProtectedAdminRoute>
                    } 
                  />
                  <Route 
                    path="/attendance" 
                    element={
                      <ProtectedAdminRoute requiredPermission="attendance">
                        <AdminAttendance />
                      </ProtectedAdminRoute>
                    } 
                  />
                  <Route 
                    path="/settings" 
                    element={
                      <ProtectedAdminRoute requiredPermission="settings">
                        <AdminSettings />
                      </ProtectedAdminRoute>
                    } 
                  />
                </Routes>
              </ProtectedAdminRoute>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
};

export default AdminDashboard;