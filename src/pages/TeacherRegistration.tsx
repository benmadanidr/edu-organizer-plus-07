import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, CheckCircle, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

interface TeacherData {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  phone: string;
  address: string;
  qualification: string;
  experience: string;
  subjects: string[];
  previousWork: string;
  notes: string;
}

const TeacherRegistration = () => {
  const [formData, setFormData] = useState<TeacherData>({
    firstName: "",
    lastName: "",
    birthDate: "",
    email: "",
    phone: "",
    address: "",
    qualification: "",
    experience: "",
    subjects: [],
    previousWork: "",
    notes: ""
  });
  
  const [registrationNumber, setRegistrationNumber] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof TeacherData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate registration number
    const regNumber = `TCH${Date.now().toString().slice(-6)}`;
    setRegistrationNumber(regNumber);
    
    // Store in localStorage (in real app, would send to Google Sheets)
    const teacherRecord = {
      ...formData,
      registrationNumber: regNumber,
      registrationDate: new Date().toISOString()
    };
    
    localStorage.setItem(`teacher_${regNumber}`, JSON.stringify(teacherRecord));
    
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
            <CardHeader className="text-center bg-gradient-to-r from-education-green to-education-blue text-white rounded-t-lg">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16" />
              </div>
              <CardTitle className="text-2xl">تم تسجيل طلب التدريس بنجاح!</CardTitle>
            </CardHeader>
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">رقم التسجيل الخاص بك:</h3>
                <div className="bg-education-green/10 p-4 rounded-lg">
                  <span className="text-2xl font-bold text-education-green">{registrationNumber}</span>
                </div>
              </div>
              
              <div className="space-y-3 text-sm text-muted-foreground mb-6">
                <p>احتفظ برقم التسجيل وتاريخ الميلاد للمراجعة أو التعديل على البيانات لاحقاً</p>
                <p>سيتم مراجعة طلبك والتواصل معك خلال 3-5 أيام عمل</p>
                <p>شكراً لاهتمامك بالانضمام إلى فريق التدريس لدينا</p>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button onClick={() => window.location.href = "/teachers"} className="flex items-center gap-2">
                  العودة لصفحة المعلمين
                  <ArrowRight className="w-4 h-4" />
                </Button>
                
                <Button variant="outline" onClick={() => window.location.href = "/verify-teacher"}>
                  التحقق من التسجيل
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-education-green to-education-blue text-white">
                <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
                  <Users className="w-6 h-6" />
                  تسجيل معلم جديد
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6" dir="rtl">
                <form onSubmit={handleSubmit} className="space-y-6">
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    
                    <div>
                      <Label htmlFor="phone">رقم الهاتف *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="qualification">المؤهل العلمي *</Label>
                    <Select value={formData.qualification} onValueChange={(value) => handleInputChange("qualification", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="اختر المؤهل العلمي" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diploma">دبلوم</SelectItem>
                        <SelectItem value="bachelor">بكالوريوس</SelectItem>
                        <SelectItem value="master">ماجستير</SelectItem>
                        <SelectItem value="phd">دكتوراه</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="experience">سنوات الخبرة في التدريس</Label>
                    <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="اختر سنوات الخبرة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fresh">جديد (بدون خبرة)</SelectItem>
                        <SelectItem value="1-2">1-2 سنة</SelectItem>
                        <SelectItem value="3-5">3-5 سنوات</SelectItem>
                        <SelectItem value="6-10">6-10 سنوات</SelectItem>
                        <SelectItem value="10+">أكثر من 10 سنوات</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>المواد التي يمكنك تدريسها *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {[
                        "اللغة العربية",
                        "اللغة الإنجليزية",
                        "الرياضيات",
                        "العلوم",
                        "الفيزياء",
                        "الكيمياء",
                        "الأحياء",
                        "التاريخ",
                        "الجغرافيا",
                        "الحاسوب",
                        "الفنون",
                        "الموسيقى"
                      ].map((subject) => (
                        <label key={subject} className="flex items-center space-x-2 space-x-reverse">
                          <input
                            type="checkbox"
                            checked={formData.subjects.includes(subject)}
                            onChange={() => handleSubjectToggle(subject)}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{subject}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="previousWork">الخبرة العملية السابقة</Label>
                    <Textarea
                      id="previousWork"
                      value={formData.previousWork}
                      onChange={(e) => handleInputChange("previousWork", e.target.value)}
                      className="mt-1"
                      rows={4}
                      placeholder="اذكر أماكن العمل السابقة وطبيعة الوظيفة..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">العنوان</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">ملاحظات إضافية</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      className="mt-1"
                      rows={3}
                      placeholder="أي معلومات إضافية ترغب في ذكرها..."
                    />
                  </div>
                  
                  <Button type="submit" className="w-full text-lg py-6">
                    تقديم طلب التدريس
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

export default TeacherRegistration;