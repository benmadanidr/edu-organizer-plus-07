import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Clock, MapPin, BookOpen, User, CalendarDays } from "lucide-react";

interface Classroom {
  id: string;
  name: string;
  course: string;
  teacher: string;
  capacity: number;
  enrolled: number;
  schedule: {
    days: string[];
    time: string;
    duration: string;
  };
  location: string;
  status: "active" | "inactive" | "full" | "upcoming";
  startDate: string;
  endDate: string;
}

interface ClassroomDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classroom: Classroom | null;
}

export const ClassroomDetailsDialog = ({ open, onOpenChange, classroom }: ClassroomDetailsDialogProps) => {
  if (!classroom) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">نشط</Badge>;
      case "inactive":
        return <Badge variant="secondary">غير نشط</Badge>;
      case "full":
        return <Badge variant="destructive">مكتمل</Badge>;
      case "upcoming":
        return <Badge variant="outline">قادم</Badge>;
      default:
        return <Badge variant="outline">غير محدد</Badge>;
    }
  };

  const enrollmentPercentage = (classroom.enrolled / classroom.capacity) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">تفاصيل الفصل الدراسي</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl mb-2">{classroom.name}</CardTitle>
                  <Badge variant="secondary" className="mb-2">{classroom.course}</Badge>
                </div>
                {getStatusBadge(classroom.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">المعلم</p>
                    <p className="font-medium">{classroom.teacher}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">المكان</p>
                    <p className="font-medium">{classroom.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">المادة</p>
                    <p className="font-medium">{classroom.course}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">العدد</p>
                    <p className="font-medium">{classroom.enrolled}/{classroom.capacity} طالب</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                الجدول الزمني
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">أيام الأسبوع</p>
                    <p className="font-medium">{classroom.schedule.days.join("، ")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">وقت البداية</p>
                    <p className="font-medium">{classroom.schedule.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">مدة الحصة</p>
                    <p className="font-medium">{classroom.schedule.duration}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">تاريخ البداية</p>
                  <p className="font-medium">{new Date(classroom.startDate).toLocaleDateString('ar-SA')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">تاريخ النهاية</p>
                  <p className="font-medium">{new Date(classroom.endDate).toLocaleDateString('ar-SA')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enrollment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                معلومات التسجيل
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">الطلاب المسجلين</span>
                  <span className="font-semibold">{classroom.enrolled}/{classroom.capacity}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all" 
                    style={{ width: `${enrollmentPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>معدل الإشغال: {Math.round(enrollmentPercentage)}%</span>
                  <span>المقاعد المتاحة: {classroom.capacity - classroom.enrolled}</span>
                </div>
              </div>

              {classroom.status === "full" && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <p className="text-destructive text-sm font-medium">الفصل مكتمل العدد</p>
                  <p className="text-destructive/80 text-xs">لا توجد مقاعد متاحة للتسجيل</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1">
              قائمة الطلاب
            </Button>
            <Button variant="outline" className="flex-1">
              سجل الحضور
            </Button>
            <Button className="flex-1">
              تعديل الفصل
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};