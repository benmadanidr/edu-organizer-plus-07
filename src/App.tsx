import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StudentRegistration from "./pages/StudentRegistration";
import CategorySelection from "./pages/CategorySelection";
import QuranRegistration from "./pages/QuranRegistration";
import AcademicRegistration from "./pages/AcademicRegistration";
import LanguageRegistration from "./pages/LanguageRegistration";
import VerifyRegistration from "./pages/VerifyRegistration";
import TeachersLanding from "./pages/TeachersLanding";
import TeacherRegistration from "./pages/TeacherRegistration";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import { AdminAuthProvider } from "./hooks/useAdminAuth";

const queryClient = new QueryClient();

const KeyboardListener = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "F7") {
        event.preventDefault();
        navigate("/admin-login");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminAuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <KeyboardListener />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<CategorySelection />} />
            <Route path="/register/quran" element={<QuranRegistration />} />
            <Route path="/register/academic" element={<AcademicRegistration />} />
            <Route path="/register/languages" element={<LanguageRegistration />} />
            <Route path="/register/general" element={<StudentRegistration />} />
            <Route path="/verify" element={<VerifyRegistration />} />
            <Route path="/teachers" element={<TeachersLanding />} />
            <Route path="/teacher-register" element={<TeacherRegistration />} />
            <Route path="/verify-teacher" element={<VerifyRegistration />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
