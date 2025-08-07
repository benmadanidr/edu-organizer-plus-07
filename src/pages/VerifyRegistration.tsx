import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Edit, Save, X, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomStudentIDCard from "@/components/CustomStudentIDCard";

interface StudentData {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  phone: string;
  address: string;
  course: string;
  previousEducation: string;
  notes: string;
  registrationNumber: string;
  registrationDate: string;
}

const VerifyRegistration = () => {
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<StudentData | null>(null);
  const { toast } = useToast();

  const handleSearch = () => {
    if (!registrationNumber || !birthDate) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال رقم التسجيل وتاريخ الميلاد",
        variant: "destructive"
      });
      return;
    }

    const stored = localStorage.getItem(`student_${registrationNumber}`);
    if (stored) {
      const data = JSON.parse(stored);
      if (data.birthDate === birthDate) {
        setStudentData(data);
        setEditData({ ...data });
      } else {
        toast({
          title: "خطأ في البيانات",
          description: "تاريخ الميلاد غير صحيح",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "لم يتم العثور على التسجيل",
        description: "رقم التسجيل غير موجود",
        variant: "destructive"
      });
    }
  };

  const handleSave = () => {
    if (editData) {
      localStorage.setItem(`student_${editData.registrationNumber}`, JSON.stringify(editData));
      setStudentData(editData);
      setIsEditing(false);
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم تحديث البيانات بنجاح"
      });
    }
  };

  const handleEditChange = (field: keyof StudentData, value: string) => {
    if (editData) {
      setEditData(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-xl mb-6">
              <CardHeader className="bg-gradient-to-r from-accent to-primary text-accent-foreground">
                <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
                  <Search className="w-6 h-6" />
                  التحقق من التسجيل
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6" dir="rtl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <Label htmlFor="regNumber">رقم التسجيل</Label>
                    <Input
                      id="regNumber"
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      placeholder="STU123456"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="birthDate">تاريخ الميلاد</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <Button onClick={handleSearch} className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    البحث
                  </Button>
                </div>
              </CardContent>
            </Card>

            {studentData && (
              <Card className="shadow-xl">
                <CardHeader className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                  <CardTitle className="text-xl text-center">
                    بيانات الطالب: {studentData.firstName} {studentData.lastName}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-6">
                  <Tabs defaultValue="card" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6" dir="rtl">
                      <TabsTrigger value="card" className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        بطاقة الطالب
                      </TabsTrigger>
                      <TabsTrigger value="details" className="flex items-center gap-2">
                        <Edit className="w-4 h-4" />
                        تفاصيل البيانات
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="card" className="space-y-6">
                      <CustomStudentIDCard studentData={studentData} />
                    </TabsContent>
                    
                    <TabsContent value="details" className="space-y-6">
                      <div className="flex justify-end mb-4">
                        <div className="flex gap-2">
                          {isEditing ? (
                            <>
                              <Button variant="default" size="sm" onClick={handleSave}>
                                <Save className="w-4 h-4 mr-2" />
                                حفظ
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                                <X className="w-4 h-4 mr-2" />
                                إلغاء
                              </Button>
                            </>
                          ) : (
                            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                              <Edit className="w-4 h-4 mr-2" />
                              تعديل
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" dir="rtl">
                        <div className="space-y-4">
                          <div>
                            <Label>رقم التسجيل</Label>
                            <div className="bg-muted p-3 rounded-lg font-mono text-sm mt-1">
                              {studentData.registrationNumber}
                            </div>
                          </div>
                          
                          <div>
                            <Label>تاريخ التسجيل</Label>
                            <div className="bg-muted p-3 rounded-lg text-sm mt-1">
                              {new Date(studentData.registrationDate).toLocaleDateString('ar-SA')}
                            </div>
                          </div>
                          
                          <div>
                            <Label>الاسم الأول</Label>
                            {isEditing ? (
                              <Input
                                value={editData?.firstName || ""}
                                onChange={(e) => handleEditChange("firstName", e.target.value)}
                                className="mt-1"
                              />
                            ) : (
                              <div className="bg-muted p-3 rounded-lg text-sm mt-1">
                                {studentData.firstName}
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <Label>اسم العائلة</Label>
                            {isEditing ? (
                              <Input
                                value={editData?.lastName || ""}
                                onChange={(e) => handleEditChange("lastName", e.target.value)}
                                className="mt-1"
                              />
                            ) : (
                              <div className="bg-muted p-3 rounded-lg text-sm mt-1">
                                {studentData.lastName}
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <Label>تاريخ الميلاد</Label>
                            {isEditing ? (
                              <Input
                                type="date"
                                value={editData?.birthDate || ""}
                                onChange={(e) => handleEditChange("birthDate", e.target.value)}
                                className="mt-1"
                              />
                            ) : (
                              <div className="bg-muted p-3 rounded-lg text-sm mt-1">
                                {new Date(studentData.birthDate).toLocaleDateString('ar-SA')}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <Label>البريد الإلكتروني</Label>
                            {isEditing ? (
                              <Input
                                type="email"
                                value={editData?.email || ""}
                                onChange={(e) => handleEditChange("email", e.target.value)}
                                className="mt-1"
                              />
                            ) : (
                              <div className="bg-muted p-3 rounded-lg text-sm mt-1">
                                {studentData.email}
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <Label>رقم الهاتف</Label>
                            {isEditing ? (
                              <Input
                                value={editData?.phone || ""}
                                onChange={(e) => handleEditChange("phone", e.target.value)}
                                className="mt-1"
                              />
                            ) : (
                              <div className="bg-muted p-3 rounded-lg text-sm mt-1">
                                {studentData.phone}
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <Label>الدورة المختارة</Label>
                            {isEditing ? (
                              <Select 
                                value={editData?.course || ""} 
                                onValueChange={(value) => handleEditChange("course", value)}
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="arabic">دورة اللغة العربية</SelectItem>
                                  <SelectItem value="english">دورة اللغة الإنجليزية</SelectItem>
                                  <SelectItem value="math">دورة الرياضيات</SelectItem>
                                  <SelectItem value="science">دورة العلوم والتكنولوجيا</SelectItem>
                                  <SelectItem value="art">دورة الفنون والإبداع</SelectItem>
                                  <SelectItem value="computer">دورة الحاسوب</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <div className="bg-muted p-3 rounded-lg text-sm mt-1">
                                {studentData.course}
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <Label>المؤهل الدراسي</Label>
                            {isEditing ? (
                              <Input
                                value={editData?.previousEducation || ""}
                                onChange={(e) => handleEditChange("previousEducation", e.target.value)}
                                className="mt-1"
                              />
                            ) : (
                              <div className="bg-muted p-3 rounded-lg text-sm mt-1">
                                {studentData.previousEducation || "لم يحدد"}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6" dir="rtl">
                        <Label>العنوان</Label>
                        {isEditing ? (
                          <Textarea
                            value={editData?.address || ""}
                            onChange={(e) => handleEditChange("address", e.target.value)}
                            className="mt-1"
                            rows={3}
                          />
                        ) : (
                          <div className="bg-muted p-3 rounded-lg text-sm mt-1">
                            {studentData.address || "لم يحدد"}
                          </div>
                        )}
                      </div>
                      
                      {studentData.notes && (
                        <div className="mt-4" dir="rtl">
                          <Label>ملاحظات</Label>
                          {isEditing ? (
                            <Textarea
                              value={editData?.notes || ""}
                              onChange={(e) => handleEditChange("notes", e.target.value)}
                              className="mt-1"
                              rows={3}
                            />
                          ) : (
                            <div className="bg-muted p-3 rounded-lg text-sm mt-1">
                              {studentData.notes}
                            </div>
                          )}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyRegistration;