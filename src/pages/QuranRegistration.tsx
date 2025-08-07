import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight, CheckCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

interface QuranStudentData {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  phone: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  currentLevel: string;
  memorizedParts: string;
  studyGoal: string;
  preferredSchedule: string;
  hasQuranExperience: string;
  notes: string;
}

const QuranRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<QuranStudentData>({
    firstName: "",
    lastName: "",
    birthDate: "",
    email: "",
    phone: "",
    address: "",
    guardianName: "",
    guardianPhone: "",
    currentLevel: "",
    memorizedParts: "",
    studyGoal: "",
    preferredSchedule: "",
    hasQuranExperience: "",
    notes: ""
  });
  
  const [registrationNumber, setRegistrationNumber] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof QuranStudentData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const regNumber = `QUR${Date.now().toString().slice(-6)}`;
    setRegistrationNumber(regNumber);
    
    const studentRecord = {
      ...formData,
      category: "quran",
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
            <CardHeader className="text-center bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-t-lg">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16" />
              </div>
              <CardTitle className="text-2xl">تم تسجيلك في برنامج تعليم القرآن الكريم بنجاح!</CardTitle>
            </CardHeader>
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">رقم التسجيل الخاص بك:</h3>
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <span className="text-2xl font-bold text-emerald-600">{registrationNumber}</span>
                </div>
              </div>
              
              <div className="space-y-3 text-sm text-muted-foreground mb-6">
                <p>احتفظ برقم التسجيل وتاريخ الميلاد للمراجعة أو التعديل على البيانات لاحقاً</p>
                <p>سيتم التواصل معك قريباً لتحديد مواعيد الدروس وبداية البرنامج</p>
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
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                <CardTitle className="text-2xl text-center">تسجيل في برنامج تعليم القرآن الكريم</CardTitle>
              </CardHeader>
              
              <CardContent className="p-6" dir="rtl">
                <form onSubmit={handleSubmit} className="space-y-6">
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
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2">بيانات ولي الأمر (للطلاب تحت 18 سنة)</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="guardianName">اسم ولي الأمر</Label>
                        <Input
                          id="guardianName"
                          value={formData.guardianName}
                          onChange={(e) => handleInputChange("guardianName", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="guardianPhone">هاتف ولي الأمر</Label>
                        <Input
                          id="guardianPhone"
                          type="tel"
                          value={formData.guardianPhone}
                          onChange={(e) => handleInputChange("guardianPhone", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* بيانات تعليم القرآن */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2">بيانات تعليم القرآن الكريم</h3>
                    
                    <div>
                      <Label htmlFor="currentLevel">المستوى الحالي في تلاوة القرآن *</Label>
                      <Select value={formData.currentLevel} onValueChange={(value) => handleInputChange("currentLevel", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="اختر مستواك الحالي" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">مبتدئ (لا أجيد القراءة)</SelectItem>
                          <SelectItem value="basic">أساسي (أقرأ بصعوبة)</SelectItem>
                          <SelectItem value="intermediate">متوسط (أقرأ بطلاقة)</SelectItem>
                          <SelectItem value="advanced">متقدم (أجيد التجويد)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="memorizedParts">الأجزاء المحفوظة حالياً</Label>
                      <Input
                        id="memorizedParts"
                        value={formData.memorizedParts}
                        onChange={(e) => handleInputChange("memorizedParts", e.target.value)}
                        className="mt-1"
                        placeholder="مثال: جزء عم، جزء تبارك..."
                      />
                    </div>
                    
                    <div>
                      <Label>هدفك من دراسة القرآن الكريم *</Label>
                      <RadioGroup 
                        value={formData.studyGoal} 
                        onValueChange={(value) => handleInputChange("studyGoal", value)}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="memorization" id="memorization" />
                          <Label htmlFor="memorization">حفظ القرآن الكريم</Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="tajweed" id="tajweed" />
                          <Label htmlFor="tajweed">تعلم التجويد وتحسين التلاوة</Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="both" id="both" />
                          <Label htmlFor="both">الحفظ والتجويد معاً</Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="reading" id="reading" />
                          <Label htmlFor="reading">تعلم القراءة الصحيحة</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div>
                      <Label htmlFor="preferredSchedule">الوقت المفضل للدروس *</Label>
                      <Select value={formData.preferredSchedule} onValueChange={(value) => handleInputChange("preferredSchedule", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="اختر الوقت المناسب" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">الفترة الصباحية (8-12)</SelectItem>
                          <SelectItem value="afternoon">فترة بعد الظهر (2-6)</SelectItem>
                          <SelectItem value="evening">الفترة المسائية (6-9)</SelectItem>
                          <SelectItem value="weekend">عطلة نهاية الأسبوع</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>هل لديك خبرة سابقة في دراسة القرآن؟ *</Label>
                      <RadioGroup 
                        value={formData.hasQuranExperience} 
                        onValueChange={(value) => handleInputChange("hasQuranExperience", value)}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="yes" id="exp-yes" />
                          <Label htmlFor="exp-yes">نعم، درست في مدرسة قرآنية</Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="some" id="exp-some" />
                          <Label htmlFor="exp-some">قليلاً، دراسة ذاتية</Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="no" id="exp-no" />
                          <Label htmlFor="exp-no">لا، لم أدرس من قبل</Label>
                        </div>
                      </RadioGroup>
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
                  
                  <Button type="submit" className="w-full text-lg py-6 bg-emerald-600 hover:bg-emerald-700">
                    تأكيد التسجيل في برنامج القرآن الكريم
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

export default QuranRegistration;