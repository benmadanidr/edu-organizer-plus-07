import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, CheckCircle, ArrowLeft, Image, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

interface AcademicStudentData {
  firstName: string;
  lastName: string;
  profileImage: string;
  birthDate: string;
  email: string;
  phones: string[];
  address: string;
  guardianName: string;
  guardianPhone: string;
  educationStage: string;
  educationLevel: string;
  previousSchool: string;
  subjects: string[];
  notes: string;
}

const AcademicRegistration = () => {
  const navigate = useNavigate();
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<AcademicStudentData>({
    firstName: "",
    lastName: "",
    profileImage: "",
    birthDate: "",
    email: "",
    phones: [""],
    address: "",
    guardianName: "",
    guardianPhone: "",
    educationStage: "",
    educationLevel: "",
    previousSchool: "",
    subjects: [],
    notes: ""
  });
  
  const [registrationNumber, setRegistrationNumber] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof AcademicStudentData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhoneChange = (index: number, value: string) => {
    const newPhones = [...formData.phones];
    newPhones[index] = value.slice(0, 10); // Limit to 10 digits
    handleInputChange("phones", newPhones);
  };

  const addPhoneField = () => {
    handleInputChange("phones", [...formData.phones, ""]);
  };

  const removePhoneField = (index: number) => {
    if (formData.phones.length > 1) {
      const newPhones = formData.phones.filter((_, i) => i !== index);
      handleInputChange("phones", newPhones);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfileImagePreview(result);
        handleInputChange("profileImage", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubjectChange = (subject: string, checked: boolean) => {
    const updatedSubjects = checked 
      ? [...formData.subjects, subject]
      : formData.subjects.filter(s => s !== subject);
    handleInputChange("subjects", updatedSubjects);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = {
      firstName: "الاسم الأول",
      lastName: "اسم العائلة", 
      birthDate: "تاريخ الميلاد",
      email: "البريد الإلكتروني",
      guardianName: "اسم ولي الأمر",
      guardianPhone: "هاتف ولي الأمر",
      educationStage: "المرحلة التعليمية",
      educationLevel: "المستوى الدراسي"
    };

    // Check if any required field is empty
    for (const [field, fieldName] of Object.entries(requiredFields)) {
      if (!formData[field as keyof AcademicStudentData] || formData[field as keyof AcademicStudentData] === "") {
        toast({
          title: "خطأ في البيانات",
          description: `يرجى تعبئة حقل ${fieldName}`,
          variant: "destructive"
        });
        return;
      }
    }

    // Check if at least one phone number is provided
    if (!formData.phones[0] || formData.phones[0].trim() === "") {
      toast({
        title: "خطأ في البيانات", 
        description: "يرجى إدخال رقم هاتف واحد على الأقل",
        variant: "destructive"
      });
      return;
    }

    // Check if at least one subject is selected
    if (formData.subjects.length === 0) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى اختيار مادة واحدة على الأقل للدراسة",
        variant: "destructive"
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال بريد إلكتروني صالح",
        variant: "destructive"
      });
      return;
    }

    // Validate phone numbers (must be 10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    for (const phone of formData.phones) {
      if (phone && !phoneRegex.test(phone)) {
        toast({
          title: "خطأ في البيانات",
          description: "يرجى إدخال أرقام هواتف صحيحة (10 أرقام)",
          variant: "destructive"
        });
        return;
      }
    }

    if (!phoneRegex.test(formData.guardianPhone)) {
      toast({
        title: "خطأ في البيانات", 
        description: "يرجى إدخال رقم هاتف ولي الأمر صحيح (10 أرقام)",
        variant: "destructive"
      });
      return;
    }
    
    const regNumber = `ACD${Date.now().toString().slice(-6)}`;
    setRegistrationNumber(regNumber);
    
    const studentRecord = {
      ...formData,
      category: "academic",
      registrationNumber: regNumber,
      registrationDate: new Date().toISOString()
    };
    
    localStorage.setItem(`student_${regNumber}`, JSON.stringify(studentRecord));
    
    setIsSubmitted(true);
    toast({
      title: "تم التسجيل بنجاح",
      description: `رقم التسجيل الخاص بك: ${regNumber}`,
    });
  };

  if (isSubmitted) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl shadow-xl">
            <CardHeader className="text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16" />
              </div>
              <CardTitle className="text-2xl">تم تسجيلك في البرنامج الأكاديمي بنجاح!</CardTitle>
            </CardHeader>
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">رقم التسجيل الخاص بك:</h3>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <span className="text-2xl font-bold text-blue-600">{registrationNumber}</span>
                </div>
              </div>
              
              <div className="space-y-3 text-sm text-muted-foreground mb-6">
                <p>احتفظ برقم التسجيل وتاريخ الميلاد للمراجعة أو التعديل على البيانات لاحقاً</p>
                <p>سيتم التواصل معك قريباً لتحديد الجدول الدراسي وبداية الفصل الدراسي</p>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate("/")} className="flex items-center gap-2">
                  العودة للرئيسية
                  <ArrowRight className="w-4 h-4" />
                </Button>
                
                <Button variant="outline" onClick={() => navigate("/verify")}>
                  التحقق من التسجيل
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const subjects = [
    "الرياضيات",
    "اللغة العربية", 
    "اللغة الإنجليزية",
    "العلوم الطبيعية",
    "الفيزياء",
    "الكيمياء",
    "التاريخ",
    "الجغرافيا",
    "التربية الإسلامية",
    "الفلسفة"
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="mb-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/register")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                العودة لاختيار الصنف
              </Button>
            </div>

            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardTitle className="text-2xl text-center">تسجيل في البرنامج الأكاديمي</CardTitle>
              </CardHeader>
              
              <CardContent className="p-6" dir="rtl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* صورة الطالب */}
                  <div className="flex flex-col items-center space-y-2">
                    <Label>صورة الطالب</Label>
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer">
                        {profileImagePreview ? (
                          <img
                            src={profileImagePreview}
                            alt="صورة الطالب"
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="text-center">
                            <Image className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                            <p className="text-xs text-gray-600">أدرج صورتك</p>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* البيانات الشخصية */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2">البيانات الشخصية</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">الاسم الأول *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="lastName">اسم العائلة *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="birthDate">تاريخ الميلاد *</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => handleInputChange("birthDate", e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">البريد الإلكتروني *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>

                    {/* أرقام الهواتف */}
                    <div className="space-y-2">
                      <Label>أرقام الهواتف *</Label>
                      {formData.phones.map((phone, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            type="tel"
                            value={phone}
                            onChange={(e) => handlePhoneChange(index, e.target.value)}
                            placeholder="0551234567"
                            maxLength={10}
                            className="flex-1"
                          />
                          {formData.phones.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removePhoneField(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addPhoneField}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        إضافة رقم هاتف آخر
                      </Button>
                    </div>
                    
                    <div>
                      <Label htmlFor="address">العنوان</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* بيانات ولي الأمر */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2">بيانات ولي الأمر</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="guardianName">اسم ولي الأمر *</Label>
                        <Input
                          id="guardianName"
                          value={formData.guardianName}
                          onChange={(e) => handleInputChange("guardianName", e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="guardianPhone">هاتف ولي الأمر *</Label>
                        <Input
                          id="guardianPhone"
                          type="tel"
                          value={formData.guardianPhone}
                          onChange={(e) => handleInputChange("guardianPhone", e.target.value.slice(0, 10))}
                          required
                          maxLength={10}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* البيانات الأكاديمية */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2">البيانات الأكاديمية</h3>
                    
                    {/* المرحلة التعليمية */}
                    <div>
                      <Label htmlFor="educationStage">المرحلة التعليمية *</Label>
                      <Select 
                        value={formData.educationStage || ""} 
                        onValueChange={(value) => {
                          handleInputChange("educationStage", value);
                          handleInputChange("educationLevel", ""); // إعادة تعيين المستوى عند تغيير المرحلة
                        }}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="اختر المرحلة التعليمية" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="primary">الابتدائي</SelectItem>
                          <SelectItem value="middle">المتوسط</SelectItem>
                          <SelectItem value="secondary-1">أولى ثانوي</SelectItem>
                          <SelectItem value="secondary-2">ثانية ثانوي</SelectItem>
                          <SelectItem value="secondary-3">ثالثة ثانوي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* المستوى الدراسي */}
                    {formData.educationStage && (
                      <div>
                        <Label htmlFor="educationLevel">المستوى الدراسي *</Label>
                        <Select value={formData.educationLevel} onValueChange={(value) => handleInputChange("educationLevel", value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="اختر المستوى الدراسي" />
                          </SelectTrigger>
                          <SelectContent>
                            {formData.educationStage === "primary" && (
                              <>
                                <SelectItem value="primary-1">أولى ابتدائي</SelectItem>
                                <SelectItem value="primary-2">ثانية ابتدائي</SelectItem>
                                <SelectItem value="primary-3">ثالثة ابتدائي</SelectItem>
                                <SelectItem value="primary-4">رابعة ابتدائي</SelectItem>
                                <SelectItem value="primary-5">خامسة ابتدائي</SelectItem>
                              </>
                            )}
                            
                            {formData.educationStage === "middle" && (
                              <>
                                <SelectItem value="middle-1">أولى متوسط</SelectItem>
                                <SelectItem value="middle-2">ثانية متوسط</SelectItem>
                                <SelectItem value="middle-3">ثالثة متوسط</SelectItem>
                                <SelectItem value="middle-4">رابعة متوسط</SelectItem>
                              </>
                            )}
                            
                            {formData.educationStage === "secondary-1" && (
                              <>
                                <SelectItem value="secondary-1-science">علوم وتكنولوجيا</SelectItem>
                                <SelectItem value="secondary-1-literature">آداب وفلسفة</SelectItem>
                              </>
                            )}
                            
                            {formData.educationStage === "secondary-2" && (
                              <>
                                <SelectItem value="secondary-2-math">رياضيات</SelectItem>
                                <SelectItem value="secondary-2-experimental">علوم تجريبية</SelectItem>
                                <SelectItem value="secondary-2-tech-civil">تقني رياضي هندسة مدنية</SelectItem>
                                <SelectItem value="secondary-2-tech-electrical">تقني رياضي هندسة كهربائية</SelectItem>
                                <SelectItem value="secondary-2-tech-process">تقني رياضي هندسة الطرائق</SelectItem>
                                <SelectItem value="secondary-2-tech-mechanical">تقني رياضي هندسة ميكانيكية</SelectItem>
                                <SelectItem value="secondary-2-literature">آداب وفلسفة</SelectItem>
                                <SelectItem value="secondary-2-languages">لغات</SelectItem>
                                <SelectItem value="secondary-2-economics">تسيير واقتصاد</SelectItem>
                              </>
                            )}
                            
                            {formData.educationStage === "secondary-3" && (
                              <>
                                <SelectItem value="secondary-3-math">رياضيات</SelectItem>
                                <SelectItem value="secondary-3-experimental">علوم تجريبية</SelectItem>
                                <SelectItem value="secondary-3-tech-civil">تقني رياضي هندسة مدنية</SelectItem>
                                <SelectItem value="secondary-3-tech-electrical">تقني رياضي هندسة كهربائية</SelectItem>
                                <SelectItem value="secondary-3-tech-process">تقني رياضي هندسة الطرائق</SelectItem>
                                <SelectItem value="secondary-3-tech-mechanical">تقني رياضي هندسة ميكانيكية</SelectItem>
                                <SelectItem value="secondary-3-literature">آداب وفلسفة</SelectItem>
                                <SelectItem value="secondary-3-languages">لغات</SelectItem>
                                <SelectItem value="secondary-3-economics">تسيير واقتصاد</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    <div>
                      <Label htmlFor="previousSchool">المدرسة السابقة</Label>
                      <Input
                        id="previousSchool"
                        value={formData.previousSchool}
                        onChange={(e) => handleInputChange("previousSchool", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label>المواد المطلوب دراستها *</Label>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {subjects.map((subject) => (
                          <div key={subject} className="flex items-center space-x-2 space-x-reverse">
                            <Checkbox
                              id={subject}
                              checked={formData.subjects.includes(subject)}
                              onCheckedChange={(checked) => handleSubjectChange(subject, checked as boolean)}
                            />
                            <Label htmlFor={subject} className="text-sm">{subject}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">ملاحظات إضافية</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      className="mt-1"
                      rows={3}
                      placeholder="أي معلومات إضافية أو طلبات خاصة..."
                    />
                  </div>
                  
                  <Button type="submit" className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700">
                    تأكيد التسجيل في البرنامج الأكاديمي
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default AcademicRegistration;