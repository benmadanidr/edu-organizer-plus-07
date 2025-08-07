import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Eye, Users } from "lucide-react";
import { AddTeacherDialog } from "@/components/admin/AddTeacherDialog";

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

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState<TeacherRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const teacherRecords: TeacherRecord[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('teacher_')) {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        teacherRecords.push(data);
      }
    }

    setTeachers(teacherRecords);
  }, []);

  const filteredTeachers = teachers.filter(teacher =>
    teacher.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadData = () => {
    const blob = new Blob([JSON.stringify(teachers, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'teachers_data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleViewDetails = (registrationNumber: string) => {
    // View details functionality would be implemented here
    console.log(`Viewing teacher details: ${registrationNumber}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            إدارة المعلمين
          </h1>
          <p className="text-muted-foreground">عرض وإدارة طلبات التدريس</p>
        </div>
        <AddTeacherDialog />
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="البحث بالاسم، رقم التسجيل، أو البريد الإلكتروني..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={downloadData} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              تصدير البيانات
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Teachers List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            قائمة المعلمين المتقدمين ({filteredTeachers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTeachers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                لا توجد طلبات تدريس
              </div>
            ) : (
              filteredTeachers.map((teacher) => (
                <div key={teacher.registrationNumber} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">
                        {teacher.firstName} {teacher.lastName}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>رقم التسجيل: {teacher.registrationNumber}</span>
                        <span>البريد: {teacher.email}</span>
                        <span>الهاتف: {teacher.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline">{teacher.qualification}</Badge>
                        {teacher.subjects?.slice(0, 3).map((subject, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                        {teacher.subjects?.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{teacher.subjects.length - 3} أخرى
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        تاريخ التقديم: {new Date(teacher.registrationDate).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleViewDetails(teacher.registrationNumber)}>
                      <Eye className="w-4 h-4 mr-2" />
                      عرض التفاصيل
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTeachers;