import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Clock, CheckCircle, XCircle, Eye, User, Calendar, Mail, Phone, MapPin, BookOpen, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatPhoneNumber } from "@/lib/localization";

interface StudentRecord {
  registrationNumber: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  phone: string;
  address: string;
  course: string;
  previousEducation: string;
  notes: string;
  registrationDate: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  reviewDate?: string;
  reviewNotes?: string;
}

const AdminReviewRegistrations = () => {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    const studentRecords: StudentRecord[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('student_')) {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        studentRecords.push(data);
      }
    }

    // ترتيب حسب تاريخ التسجيل (الأحدث أولاً)
    studentRecords.sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime());
    setStudents(studentRecords);
  };

  const filteredStudents = students.filter(student =>
    student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingStudents = filteredStudents.filter(s => s.status === "pending");
  const approvedStudents = filteredStudents.filter(s => s.status === "approved");
  const rejectedStudents = filteredStudents.filter(s => s.status === "rejected");

  const handleReview = (student: StudentRecord, action: "approved" | "rejected") => {
    const updatedStudent = {
      ...student,
      status: action,
      reviewedBy: "المدير العام", // في التطبيق الحقيقي، سيكون من نظام المصادقة
      reviewDate: new Date().toISOString(),
      reviewNotes: reviewNotes
    };

    localStorage.setItem(`student_${student.registrationNumber}`, JSON.stringify(updatedStudent));
    loadStudents();
    setIsDialogOpen(false);
    setReviewNotes("");
    setSelectedStudent(null);

    toast({
      title: action === "approved" ? "تمت الموافقة بنجاح" : "تم رفض التسجيل",
      description: action === "approved" 
        ? `تم قبول ${student.firstName} ${student.lastName} وإضافته إلى قائمة الطلاب المسجلين`
        : `تم رفض تسجيل ${student.firstName} ${student.lastName}`,
    });
  };

  const openReviewDialog = (student: StudentRecord) => {
    setSelectedStudent(student);
    setReviewNotes(student.reviewNotes || "");
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800"><Clock className="w-3 h-3 mr-1" />قيد المراجعة</Badge>;
      case "approved":
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />مقبول</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />مرفوض</Badge>;
      default:
        return <Badge variant="secondary">غير محدد</Badge>;
    }
  };

  const StudentCard = ({ student }: { student: StudentRecord }) => (
    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <User className="w-4 h-4" />
            {student.firstName} {student.lastName}
          </h3>
          <p className="text-sm text-muted-foreground">رقم التسجيل: {student.registrationNumber}</p>
        </div>
        {getStatusBadge(student.status)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
        <div className="flex items-center gap-2">
          <Mail className="w-3 h-3" />
          {student.email}
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-3 h-3" />
          {formatPhoneNumber(student.phone)}
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="w-3 h-3" />
          {student.course}
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3" />
          {formatDate(student.registrationDate)}
        </div>
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => openReviewDialog(student)}>
          <Eye className="w-4 h-4 mr-2" />
          مراجعة التفاصيل
        </Button>
        
        {student.status === "pending" && (
          <>
            <Button 
              size="sm" 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                setSelectedStudent(student);
                handleReview(student, "approved");
              }}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              موافقة
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => {
                setSelectedStudent(student);
                setIsDialogOpen(true);
              }}
            >
              <XCircle className="w-4 h-4 mr-2" />
              رفض
            </Button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            مراجعة طلبات التسجيل
          </h1>
          <p className="text-muted-foreground">مراجعة وإدارة طلبات تسجيل الطلاب الجدد</p>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="البحث بالاسم، رقم التسجيل، أو البريد الإلكتروني..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-orange-600">قيد المراجعة</span>
            </div>
            <div className="text-2xl font-bold">{pendingStudents.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-600">مقبول</span>
            </div>
            <div className="text-2xl font-bold">{approvedStudents.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-red-600">مرفوض</span>
            </div>
            <div className="text-2xl font-bold">{rejectedStudents.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Registrations */}
      {pendingStudents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <Clock className="w-5 h-5" />
              طلبات قيد المراجعة ({pendingStudents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingStudents.map((student) => (
                <StudentCard key={student.registrationNumber} student={student} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Registrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            جميع طلبات التسجيل ({filteredStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                لا توجد طلبات تسجيل
              </div>
            ) : (
              filteredStudents.map((student) => (
                <StudentCard key={student.registrationNumber} student={student} />
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>مراجعة طلب التسجيل</DialogTitle>
          </DialogHeader>
          
          {selectedStudent && (
            <div className="space-y-6">
              {/* Student Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>الاسم الكامل</Label>
                  <p className="font-semibold">{selectedStudent.firstName} {selectedStudent.lastName}</p>
                </div>
                <div>
                  <Label>رقم التسجيل</Label>
                  <p className="font-semibold">{selectedStudent.registrationNumber}</p>
                </div>
                <div>
                  <Label>تاريخ الميلاد</Label>
                  <p>{formatDate(selectedStudent.birthDate)}</p>
                </div>
                <div>
                  <Label>البريد الإلكتروني</Label>
                  <p>{selectedStudent.email}</p>
                </div>
                <div>
                  <Label>رقم الهاتف</Label>
                  <p>{formatPhoneNumber(selectedStudent.phone)}</p>
                </div>
                <div>
                  <Label>الدورة المطلوبة</Label>
                  <p>{selectedStudent.course}</p>
                </div>
              </div>

              <div>
                <Label>العنوان</Label>
                <p>{selectedStudent.address || "غير محدد"}</p>
              </div>

              <div>
                <Label>المؤهل الدراسي السابق</Label>
                <p>{selectedStudent.previousEducation || "غير محدد"}</p>
              </div>

              {selectedStudent.notes && (
                <div>
                  <Label>ملاحظات الطالب</Label>
                  <p className="bg-muted p-3 rounded">{selectedStudent.notes}</p>
                </div>
              )}

              <div>
                <Label htmlFor="reviewNotes">ملاحظات المراجعة</Label>
                <Textarea
                  id="reviewNotes"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="اكتب ملاحظاتك حول هذا الطلب..."
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleReview(selectedStudent, "approved")}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  موافقة على التسجيل
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => handleReview(selectedStudent, "rejected")}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  رفض التسجيل
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminReviewRegistrations;