import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, GraduationCap, User, Phone, Mail, MapPin, Calendar, BookOpen, CreditCard } from "lucide-react";

interface StudentDetailsDialogProps {
  student: {
    registrationNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    course: string;
    registrationDate: string;
    birthDate?: string;
    guardianName?: string;
    guardianPhone?: string;
    address?: string;
    notes?: string;
  };
}

export function StudentDetailsDialog({ student }: StudentDetailsDialogProps) {
  const [open, setOpen] = useState(false);

  // Mock attendance data - in real app, this would come from API
  const attendanceData = [
    { date: "2024-01-15", status: "present" },
    { date: "2024-01-14", status: "absent" },
    { date: "2024-01-13", status: "present" },
    { date: "2024-01-12", status: "late" },
    { date: "2024-01-11", status: "present" },
  ];

  // Mock financial data
  const financialData = {
    totalPaid: 15000,
    outstanding: 5000,
    lastPayment: "2024-01-10",
    paymentMethod: "نقداً"
  };

  const attendanceRate = Math.round((attendanceData.filter(a => a.status === "present" || a.status === "late").length / attendanceData.length) * 100);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge variant="default" className="text-xs">حاضر</Badge>;
      case "absent":
        return <Badge variant="destructive" className="text-xs">غائب</Badge>;
      case "late":
        return <Badge variant="secondary" className="text-xs">متأخر</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">غير محدد</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Eye className="w-4 h-4 mr-2" />
          عرض التفاصيل
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            تفاصيل الطالب: {student.firstName} {student.lastName}
          </DialogTitle>
          <DialogDescription>
            رقم التسجيل: {student.registrationNumber}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="personal" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">البيانات الشخصية</TabsTrigger>
            <TabsTrigger value="academic">البيانات الأكاديمية</TabsTrigger>
            <TabsTrigger value="attendance">الحضور والغياب</TabsTrigger>
            <TabsTrigger value="financial">البيانات المالية</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  المعلومات الشخصية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">الاسم الكامل</label>
                    <p className="text-base font-medium">{student.firstName} {student.lastName}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">تاريخ الميلاد</label>
                    <p className="text-base">{student.birthDate ? new Date(student.birthDate).toLocaleDateString('ar-SA') : "غير محدد"}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      البريد الإلكتروني
                    </label>
                    <p className="text-base">{student.email}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      رقم الهاتف
                    </label>
                    <p className="text-base">{student.phone}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      العنوان
                    </label>
                    <p className="text-base">{student.address || "غير محدد"}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      تاريخ التسجيل
                    </label>
                    <p className="text-base">{new Date(student.registrationDate).toLocaleDateString('ar-SA')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>معلومات ولي الأمر</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">اسم ولي الأمر</label>
                    <p className="text-base">{student.guardianName || "غير محدد"}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">رقم هاتف ولي الأمر</label>
                    <p className="text-base">{student.guardianPhone || "غير محدد"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {student.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>ملاحظات</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base">{student.notes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="academic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  المعلومات الأكاديمية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">الدورة المسجل بها</label>
                    <Badge variant="secondary" className="text-sm">{student.course}</Badge>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">معدل الحضور</label>
                    <p className={`text-base font-bold ${attendanceRate >= 90 ? 'text-green-600' : attendanceRate >= 80 ? 'text-orange-600' : 'text-red-600'}`}>
                      {attendanceRate}%
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">حالة التسجيل</label>
                    <Badge variant="default">نشط</Badge>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">المستوى</label>
                    <p className="text-base">المستوى الأول</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>سجل الحضور والغياب</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {attendanceData.map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {new Date(record.date).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                      {getStatusBadge(record.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  البيانات المالية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">إجمالي المدفوع</label>
                    <p className="text-lg font-bold text-green-600">{financialData.totalPaid.toLocaleString()} د.ج</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">المبلغ المتبقي</label>
                    <p className="text-lg font-bold text-orange-600">{financialData.outstanding.toLocaleString()} د.ج</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">آخر دفعة</label>
                    <p className="text-base">{new Date(financialData.lastPayment).toLocaleDateString('ar-SA')}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">طريقة الدفع</label>
                    <p className="text-base">{financialData.paymentMethod}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}