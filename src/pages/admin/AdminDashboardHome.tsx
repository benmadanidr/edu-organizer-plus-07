import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminDashboardStats } from "@/components/admin/AdminDashboardStats";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Activity, TrendingUp, Calendar, Users, Clock, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

interface StudentRecord {
  registrationNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  course: string;
  registrationDate: string;
  status?: "pending" | "approved" | "rejected";
}

interface TeacherRecord {
  registrationNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  qualification: string;
  subjects: string[];
  registrationDate: string;
}

const AdminDashboardHome = () => {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [teachers, setTeachers] = useState<TeacherRecord[]>([]);
  const [pendingStudents, setPendingStudents] = useState<StudentRecord[]>([]);

  useEffect(() => {
    // Load students and teachers from localStorage
    const studentRecords: StudentRecord[] = [];
    const teacherRecords: TeacherRecord[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('student_')) {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        studentRecords.push(data);
      } else if (key?.startsWith('teacher_')) {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        teacherRecords.push(data);
      }
    }

    setStudents(studentRecords);
    setTeachers(teacherRecords);
    
    // Filter pending students
    const pending = studentRecords.filter(student => student.status === "pending");
    setPendingStudents(pending);
  }, []);

  return (
    <div className="space-y-4 lg:space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground truncate">مرحباً بك في لوحة الإدارة</h1>
          <p className="text-sm lg:text-base text-muted-foreground mt-1">نظرة عامة على أداء المؤسسة التعليمية</p>
        </div>
        <Button className="shrink-0 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span>تقرير اليوم</span>
            <Calendar className="w-4 h-4" />
          </div>
        </Button>
      </div>

      <AdminDashboardStats studentsCount={students.length} teachersCount={teachers.length} />

      {/* Pending Registrations Alert */}
      {pendingStudents.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            يوجد <strong>{pendingStudents.length}</strong> طلب تسجيل قيد المراجعة.{" "}
            <Link to="/admin/review-registrations" className="underline font-semibold hover:text-orange-900">
              اضغط هنا للمراجعة
            </Link>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="w-5 h-5 text-primary shrink-0" />
              النشاط الأخير
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <Users className="w-5 h-5 text-primary shrink-0 ml-2" />
                <div className="min-w-0 flex-1 text-right">
                  <p className="font-medium text-sm lg:text-base truncate">تسجيل طالب جديد</p>
                  <p className="text-xs lg:text-sm text-muted-foreground">منذ ساعتين</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <Users className="w-5 h-5 text-education-green shrink-0 ml-2" />
                <div className="min-w-0 flex-1 text-right">
                  <p className="font-medium text-sm lg:text-base truncate">طلب تدريس جديد</p>
                  <p className="text-xs lg:text-sm text-muted-foreground">منذ 4 ساعات</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-education-orange shrink-0 ml-2" />
                <div className="min-w-0 flex-1 text-right">
                  <p className="font-medium text-sm lg:text-base truncate">دفعة مالية</p>
                  <p className="text-xs lg:text-sm text-muted-foreground">منذ يوم واحد</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-primary shrink-0" />
              إحصائيات سريعة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="font-bold text-primary shrink-0 ml-2">+12%</span>
                <span className="text-muted-foreground text-sm lg:text-base truncate flex-1 text-right">معدل التسجيلات الشهرية</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-bold shrink-0 ml-2">24</span>
                <span className="text-muted-foreground text-sm lg:text-base truncate flex-1 text-right">الفصول النشطة</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-bold text-education-green shrink-0 ml-2">94.5%</span>
                <span className="text-muted-foreground text-sm lg:text-base truncate flex-1 text-right">معدل الحضور</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-bold text-education-orange shrink-0 ml-2">6</span>
                <span className="text-muted-foreground text-sm lg:text-base truncate flex-1 text-right">المدفوعات المعلقة</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardHome;