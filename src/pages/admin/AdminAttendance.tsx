import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarX, Search, Download, Calendar, TrendingDown, Users, AlertTriangle } from "lucide-react";
import { RecordAttendanceDialog } from "@/components/admin/RecordAttendanceDialog";

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  course: string;
  className: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  reason?: string;
}

interface AbsenceStatistics {
  studentId: string;
  studentName: string;
  course: string;
  totalAbsences: number;
  excusedAbsences: number;
  unexcusedAbsences: number;
  attendanceRate: number;
}

const AdminAttendance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>("");
  
  const [attendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: "1",
      studentId: "STU001",
      studentName: "أحمد محمد علي",
      course: "القرآن الكريم",
      className: "فصل القرآن الكريم - المستوى الأول",
      date: "2024-01-15",
      status: "absent",
      reason: "مرض",
    },
    {
      id: "2",
      studentId: "STU002",
      studentName: "فاطمة خالد أحمد",
      course: "اللغة الإنجليزية",
      className: "دورة اللغة الإنجليزية المتقدمة",
      date: "2024-01-15",
      status: "present",
    },
    {
      id: "3",
      studentId: "STU001",
      studentName: "أحمد محمد علي",
      course: "القرآن الكريم",
      className: "فصل القرآن الكريم - المستوى الأول",
      date: "2024-01-14",
      status: "late",
    },
    {
      id: "4",
      studentId: "STU003",
      studentName: "محمد عبدالله",
      course: "الرياضيات",
      className: "فصل الرياضيات للمرحلة الثانوية",
      date: "2024-01-15",
      status: "excused",
      reason: "ظرف عائلي",
    },
    {
      id: "5",
      studentId: "STU002",
      studentName: "فاطمة خالد أحمد",
      course: "اللغة الإنجليزية",
      className: "دورة اللغة الإنجليزية المتقدمة",
      date: "2024-01-13",
      status: "absent",
    },
  ]);

  // Calculate absence statistics
  const absenceStats: AbsenceStatistics[] = [];
  const studentGroups = attendanceRecords.reduce((acc, record) => {
    if (!acc[record.studentId]) {
      acc[record.studentId] = [];
    }
    acc[record.studentId].push(record);
    return acc;
  }, {} as Record<string, AttendanceRecord[]>);

  Object.entries(studentGroups).forEach(([studentId, records]) => {
    const totalAbsences = records.filter(r => r.status === "absent" || r.status === "excused").length;
    const excusedAbsences = records.filter(r => r.status === "excused").length;
    const unexcusedAbsences = records.filter(r => r.status === "absent").length;
    const presentCount = records.filter(r => r.status === "present" || r.status === "late").length;
    const attendanceRate = Math.round((presentCount / records.length) * 100);

    absenceStats.push({
      studentId,
      studentName: records[0].studentName,
      course: records[0].course,
      totalAbsences,
      excusedAbsences,
      unexcusedAbsences,
      attendanceRate,
    });
  });

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === "all" || record.course === selectedCourse;
    const matchesDate = !selectedDate || record.date === selectedDate;
    
    return matchesSearch && matchesCourse && matchesDate;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge variant="default">حاضر</Badge>;
      case "absent":
        return <Badge variant="destructive">غائب</Badge>;
      case "late":
        return <Badge variant="secondary">متأخر</Badge>;
      case "excused":
        return <Badge variant="outline">غياب معذور</Badge>;
      default:
        return <Badge variant="outline">غير محدد</Badge>;
    }
  };

  const totalAbsences = attendanceRecords.filter(r => r.status === "absent" || r.status === "excused").length;
  const unexcusedAbsences = attendanceRecords.filter(r => r.status === "absent").length;
  const studentsWithHighAbsences = absenceStats.filter(s => s.attendanceRate < 80).length;

  const courses = Array.from(new Set(attendanceRecords.map(r => r.course)));

  const handleExportReport = () => {
    // Export functionality would be implemented here
    console.log("Exporting attendance report...");
  };

  const handleRecordAttendance = () => {
    // Record attendance functionality would be implemented here
    console.log("Opening attendance recording form...");
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCourse("all");
    setSelectedDate("");
  };

  const handleEditAttendance = (recordId: string) => {
    // Edit attendance functionality would be implemented here
    console.log(`Editing attendance record: ${recordId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <CalendarX className="w-8 h-8 text-primary" />
            إدارة الغيابات والحضور
          </h1>
          <p className="text-muted-foreground">متابعة حضور الطلاب وإدارة الغيابات</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExportReport()}>
            <Download className="w-4 h-4 mr-2" />
            تصدير التقرير
          </Button>
          <RecordAttendanceDialog />
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-education-orange to-education-orange/80 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90">إجمالي الغيابات</p>
                <h3 className="text-3xl font-bold">{totalAbsences}</h3>
              </div>
              <TrendingDown className="w-12 h-12 text-white/70" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-destructive to-destructive/80 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90">الغيابات غير المعذورة</p>
                <h3 className="text-3xl font-bold">{unexcusedAbsences}</h3>
              </div>
              <AlertTriangle className="w-12 h-12 text-white/70" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/90">طلاب بغيابات عالية</p>
                <h3 className="text-3xl font-bold">{studentsWithHighAbsences}</h3>
              </div>
              <Users className="w-12 h-12 text-primary-foreground/70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="البحث بالاسم أو رقم الطالب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الدورة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الدورات</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course} value={course}>{course}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              placeholder="اختر التاريخ"
            />
            <Button variant="outline" onClick={() => handleResetFilters()}>
              إعادة تعيين
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily">الحضور اليومي</TabsTrigger>
          <TabsTrigger value="statistics">إحصائيات الغياب</TabsTrigger>
          <TabsTrigger value="reports">التقارير</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <Card>
            <CardHeader>
              <CardTitle>سجل الحضور اليومي ({filteredRecords.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRecords.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        record.status === 'present' ? 'bg-education-green/20' :
                        record.status === 'absent' ? 'bg-destructive/20' :
                        record.status === 'late' ? 'bg-education-orange/20' :
                        'bg-muted'
                      }`}>
                        <Users className={`w-5 h-5 ${
                          record.status === 'present' ? 'text-education-green' :
                          record.status === 'absent' ? 'text-destructive' :
                          record.status === 'late' ? 'text-education-orange' :
                          'text-muted-foreground'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{record.studentName}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>رقم الطالب: {record.studentId}</span>
                          <span>• الدورة: {record.course}</span>
                          <span>• {new Date(record.date).toLocaleDateString('ar-SA')}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{record.className}</p>
                        {record.reason && (
                          <p className="text-sm text-muted-foreground">السبب: {record.reason}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(record.status)}
                      <Button size="sm" variant="outline" onClick={() => handleEditAttendance(record.id)}>
                        تعديل
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics">
          <Card>
            <CardHeader>
              <CardTitle>إحصائيات الغياب لكل طالب</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {absenceStats
                  .sort((a, b) => b.totalAbsences - a.totalAbsences)
                  .map((stat) => (
                    <div key={stat.studentId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${
                          stat.attendanceRate >= 90 ? 'bg-education-green/20' :
                          stat.attendanceRate >= 80 ? 'bg-education-orange/20' :
                          'bg-destructive/20'
                        }`}>
                          <Users className={`w-5 h-5 ${
                            stat.attendanceRate >= 90 ? 'text-education-green' :
                            stat.attendanceRate >= 80 ? 'text-education-orange' :
                            'text-destructive'
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{stat.studentName}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>رقم الطالب: {stat.studentId}</span>
                            <span>• الدورة: {stat.course}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-left space-y-1">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">إجمالي الغيابات</p>
                            <p className="font-bold text-lg">{stat.totalAbsences}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">معذور</p>
                            <p className="font-bold text-education-green">{stat.excusedAbsences}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">غير معذور</p>
                            <p className="font-bold text-destructive">{stat.unexcusedAbsences}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">معدل الحضور</p>
                            <p className={`font-bold text-lg ${
                              stat.attendanceRate >= 90 ? 'text-education-green' :
                              stat.attendanceRate >= 80 ? 'text-education-orange' :
                              'text-destructive'
                            }`}>
                              {stat.attendanceRate}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>التقارير الشهرية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  تقرير الحضور الشهري - يناير 2024
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  تقرير الغيابات غير المعذورة
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  تقرير الطلاب المعرضين للخطر
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>التقارير المخصصة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">فترة التقرير</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="date" placeholder="من تاريخ" />
                    <Input type="date" placeholder="إلى تاريخ" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">نوع التقرير</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع التقرير" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="attendance">تقرير الحضور</SelectItem>
                      <SelectItem value="absence">تقرير الغيابات</SelectItem>
                      <SelectItem value="statistics">تقرير إحصائي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  إنشاء التقرير
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAttendance;