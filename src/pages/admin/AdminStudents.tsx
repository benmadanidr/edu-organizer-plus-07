import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Download, Eye, BookOpen, GraduationCap, Edit, Trash2, MapPin, Calendar, Phone, Mail, User } from "lucide-react";
import { AddStudentDialog } from "@/components/admin/AddStudentDialog";
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatPhoneNumber } from "@/lib/localization";

interface StudentRecord {
  registrationNumber: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  birthPlace?: string;
  email: string;
  phone: string;
  phones?: string[];
  address: string;
  course: string;
  previousEducation: string;
  notes: string;
  registrationDate: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  reviewDate?: string;
  reviewNotes?: string;
  avatar?: string;
  profileImage?: string;
}

const AdminStudents = () => {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
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
        // عرض الطلاب المقبولين فقط
        if (data.status === "approved") {
          studentRecords.push(data);
        }
      }
    }

    // ترتيب حسب تاريخ المراجعة (الأحدث أولاً)
    studentRecords.sort((a, b) => new Date(b.reviewDate || b.registrationDate).getTime() - new Date(a.reviewDate || a.registrationDate).getTime());
    setStudents(studentRecords);
  };

  const filteredStudents = students.filter(student =>
    student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadData = () => {
    const blob = new Blob([JSON.stringify(students, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students_data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDoubleClick = (student: StudentRecord) => {
    setSelectedStudent(student);
    setEditingStudent({ ...student });
    setIsDetailDialogOpen(true);
  };

  const handleSaveChanges = () => {
    if (!editingStudent) return;
    
    localStorage.setItem(`student_${editingStudent.registrationNumber}`, JSON.stringify(editingStudent));
    setStudents(prev => prev.map(s => s.registrationNumber === editingStudent.registrationNumber ? editingStudent : s));
    setIsDetailDialogOpen(false);
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم تحديث بيانات الطالب بنجاح"
    });
  };

  const handleDeleteStudent = () => {
    if (!selectedStudent) return;
    
    localStorage.removeItem(`student_${selectedStudent.registrationNumber}`);
    setStudents(prev => prev.filter(s => s.registrationNumber !== selectedStudent.registrationNumber));
    setIsDetailDialogOpen(false);
    toast({
      title: "تم الحذف بنجاح",
      description: "تم حذف الطالب من النظام",
      variant: "destructive"
    });
  };

  const handleEditChange = (field: keyof StudentRecord, value: string) => {
    if (editingStudent) {
      setEditingStudent(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  const getStudentInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            إدارة الطلاب
          </h1>
          <p className="text-muted-foreground">عرض وإدارة تسجيلات الطلاب</p>
        </div>
        <AddStudentDialog />
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

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            قائمة الطلاب المسجلين ({filteredStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الصورة</TableHead>
                  <TableHead className="text-right">الاسم الكامل</TableHead>
                  <TableHead className="text-right">تاريخ ومكان الميلاد</TableHead>
                  <TableHead className="text-right">رقم الهاتف</TableHead>
                  <TableHead className="text-right">تاريخ التسجيل</TableHead>
                  <TableHead className="text-right">الدورات</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      لا توجد تسجيلات طلاب
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow 
                      key={student.registrationNumber} 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onDoubleClick={() => handleDoubleClick(student)}
                      title="انقر مرتين لعرض التفاصيل والتعديل"
                    >
                      <TableCell>
                        <div className="relative">
                           <Avatar 
                            className="w-12 h-12 transition-transform hover:scale-150 hover:z-10 hover:shadow-lg"
                            onMouseEnter={() => setHoveredImage(student.registrationNumber)}
                            onMouseLeave={() => setHoveredImage(null)}
                          >
                            <AvatarImage src={student.avatar || student.profileImage} />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {getStudentInitials(student.firstName, student.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          {hoveredImage === student.registrationNumber && (student.avatar || student.profileImage) && (
                            <div className="absolute top-0 left-16 z-20 bg-background border border-border rounded-lg shadow-xl p-2">
                              <img 
                                src={student.avatar || student.profileImage} 
                                alt={`${student.firstName} ${student.lastName}`}
                                className="w-32 h-32 object-cover rounded-lg"
                              />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-semibold text-foreground">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {student.registrationNumber}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            {formatDate(student.birthDate)}
                          </div>
                          {student.birthPlace && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              {student.birthPlace}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="w-3 h-3 text-muted-foreground" />
                          {formatPhoneNumber(student.phone || student.phones?.[0] || '')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(student.registrationDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-primary/10 text-primary border-primary/20">
                          <BookOpen className="w-3 h-3 mr-1" />
                          {student.course}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
                          مقبول
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Student Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <User className="w-6 h-6" />
              تفاصيل الطالب: {selectedStudent?.firstName} {selectedStudent?.lastName}
            </DialogTitle>
          </DialogHeader>
          
          {selectedStudent && editingStudent && (
            <div className="space-y-6">
              {/* Student Photo and Basic Info */}
              <div className="flex items-start gap-6 p-4 bg-muted/30 rounded-lg">
                <Avatar className="w-24 h-24 border-4 border-primary/20">
                  <AvatarImage src={selectedStudent.avatar || selectedStudent.profileImage} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                    {getStudentInitials(selectedStudent.firstName, selectedStudent.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <h3 className="text-2xl font-bold text-foreground">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </h3>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {selectedStudent.registrationNumber}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {selectedStudent.email}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
                    طالب مقبول
                  </Badge>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>الاسم الأول</Label>
                    <Input
                      value={editingStudent.firstName}
                      onChange={(e) => handleEditChange("firstName", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label>اسم العائلة</Label>
                    <Input
                      value={editingStudent.lastName}
                      onChange={(e) => handleEditChange("lastName", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>تاريخ الميلاد</Label>
                    <Input
                      type="date"
                      value={editingStudent.birthDate}
                      onChange={(e) => handleEditChange("birthDate", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>مكان الميلاد</Label>
                    <Input
                      value={editingStudent.birthPlace || ""}
                      onChange={(e) => handleEditChange("birthPlace", e.target.value)}
                      className="mt-1"
                      placeholder="لم يحدد"
                    />
                  </div>

                  <div>
                    <Label>رقم الهاتف</Label>
                    <Input
                      value={editingStudent.phone}
                      onChange={(e) => handleEditChange("phone", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>البريد الإلكتروني</Label>
                    <Input
                      type="email"
                      value={editingStudent.email}
                      onChange={(e) => handleEditChange("email", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>الدورة المختارة</Label>
                    <Input
                      value={editingStudent.course}
                      onChange={(e) => handleEditChange("course", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>المؤهل الدراسي</Label>
                    <Input
                      value={editingStudent.previousEducation}
                      onChange={(e) => handleEditChange("previousEducation", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>تاريخ التسجيل</Label>
                    <div className="bg-muted p-3 rounded-lg text-sm mt-1">
                      {formatDate(selectedStudent.registrationDate)}
                    </div>
                  </div>

                  <div>
                    <Label>تاريخ القبول</Label>
                    <div className="bg-muted p-3 rounded-lg text-sm mt-1">
                      {selectedStudent.reviewDate ? formatDate(selectedStudent.reviewDate) : 'لم يحدد'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>العنوان</Label>
                  <Textarea
                    value={editingStudent.address}
                    onChange={(e) => handleEditChange("address", e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                {editingStudent.notes && (
                  <div>
                    <Label>ملاحظات</Label>
                    <Textarea
                      value={editingStudent.notes}
                      onChange={(e) => handleEditChange("notes", e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      حذف الطالب
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent dir="rtl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                      <AlertDialogDescription>
                        هل أنت متأكد من حذف الطالب "{selectedStudent?.firstName} {selectedStudent?.lastName}"؟ 
                        هذا الإجراء لا يمكن التراجع عنه.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteStudent} className="bg-destructive hover:bg-destructive/90">
                        تأكيد الحذف
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleSaveChanges}>
                    <Edit className="w-4 h-4 mr-2" />
                    حفظ التغييرات
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminStudents;