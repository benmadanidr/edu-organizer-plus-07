import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, CheckCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

interface LanguageStudentData {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  phone: string;
  address: string;
  selectedLanguage: string;
  currentLevel: string;
  previousExperience: string;
  learningGoal: string;
  preferredMethod: string;
  availableDays: string[];
  preferredTime: string;
  hasLanguageCertificate: boolean;
  certificateDetails: string;
  notes: string;
}

const LanguageRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LanguageStudentData>({
    firstName: "",
    lastName: "",
    birthDate: "",
    email: "",
    phone: "",
    address: "",
    selectedLanguage: "",
    currentLevel: "",
    previousExperience: "",
    learningGoal: "",
    preferredMethod: "",
    availableDays: [],
    preferredTime: "",
    hasLanguageCertificate: false,
    certificateDetails: "",
    notes: ""
  });
  
  const [registrationNumber, setRegistrationNumber] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof LanguageStudentData, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDayChange = (day: string, checked: boolean) => {
    const updatedDays = checked 
      ? [...formData.availableDays, day]
      : formData.availableDays.filter(d => d !== day);
    handleInputChange("availableDays", updatedDays);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const regNumber = `LNG${Date.now().toString().slice(-6)}`;
    setRegistrationNumber(regNumber);
    
    const studentRecord = {
      ...formData,
      category: "languages",
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
            <CardHeader className="text-center bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16" />
              </div>
              <CardTitle className="text-2xl">تم تسجيلك في دورة اللغات بنجاح!</CardTitle>
            </CardHeader>
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">رقم التسجيل الخاص بك:</h3>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <span className="text-2xl font-bold text-purple-600">{registrationNumber}</span>
                </div>
              </div>
              
              <div className="space-y-3 text-sm text-muted-foreground mb-6">
                <p>احتفظ برقم التسجيل وتاريخ الميلاد للمراجعة أو التعديل على البيانات لاحقاً</p>
                <p>سيتم التواصل معك قريباً لتحديد مواعيد الدروس وبداية الدورة</p>
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

  const weekDays = [
    "السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"
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
              <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardTitle className="text-2xl text-center">تسجيل في دورات تعليم اللغات</CardTitle>
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

                  {/* بيانات اللغة */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2">بيانات الدورة اللغوية</h3>
                    
                    <div>
                      <Label htmlFor="selectedLanguage">اللغة المراد تعلمها *</Label>
                      <Select value={formData.selectedLanguage} onValueChange={(value) => handleInputChange("selectedLanguage", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="اختر اللغة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">الإنجليزية</SelectItem>
                          <SelectItem value="french">الفرنسية</SelectItem>
                          <SelectItem value="arabic">العربية (للناطقين بغيرها)</SelectItem>
                          <SelectItem value="spanish">الإسبانية</SelectItem>
                          <SelectItem value="german">الألمانية</SelectItem>
                          <SelectItem value="turkish">التركية</SelectItem>
                          <SelectItem value="chinese">الصينية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="currentLevel">مستواك الحالي في اللغة *</Label>
                      <Select value={formData.currentLevel} onValueChange={(value) => handleInputChange("currentLevel", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="اختر مستواك" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">مبتدئ (A1)</SelectItem>
                          <SelectItem value="elementary">أساسي (A2)</SelectItem>
                          <SelectItem value="intermediate">متوسط (B1)</SelectItem>
                          <SelectItem value="upper-intermediate">متوسط متقدم (B2)</SelectItem>
                          <SelectItem value="advanced">متقدم (C1)</SelectItem>
                          <SelectItem value="proficient">متمكن (C2)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>خبرتك السابقة في اللغة *</Label>
                      <RadioGroup 
                        value={formData.previousExperience} 
                        onValueChange={(value) => handleInputChange("previousExperience", value)}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="none" id="exp-none" />
                          <Label htmlFor="exp-none">لا توجد خبرة سابقة</Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="self-study" id="exp-self" />
                          <Label htmlFor="exp-self">دراسة ذاتية</Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="school" id="exp-school" />
                          <Label htmlFor="exp-school">دراسة في المدرسة</Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="institute" id="exp-institute" />
                          <Label htmlFor="exp-institute">دراسة في معهد</Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="native" id="exp-native" />
                          <Label htmlFor="exp-native">متحدث أصلي أو يعيش في البلد</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div>
                      <Label>هدفك من تعلم اللغة *</Label>
                      <RadioGroup 
                        value={formData.learningGoal} 
                        onValueChange={(value) => handleInputChange("learningGoal", value)}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="travel" id="goal-travel" />
                          <Label htmlFor="goal-travel">السفر والسياحة</Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="work" id="goal-work" />
                          <Label htmlFor="goal-work">العمل والمهنة</Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="study" id="goal-study" />
                          <Label htmlFor="goal-study">الدراسة الأكاديمية</Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="communication" id="goal-comm" />
                          <Label htmlFor="goal-comm">التواصل اليومي</Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="exam" id="goal-exam" />
                          <Label htmlFor="goal-exam">اجتياز امتحان دولي</Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="personal" id="goal-personal" />
                          <Label htmlFor="goal-personal">تطوير شخصي</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div>
                      <Label>طريقة التعلم المفضلة *</Label>
                      <RadioGroup 
                        value={formData.preferredMethod} 
                        onValueChange={(value) => handleInputChange("preferredMethod", value)}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="individual" id="method-individual" />
                          <Label htmlFor="method-individual">دروس فردية</Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="group" id="method-group" />
                          <Label htmlFor="method-group">مجموعات صغيرة (2-4 أشخاص)</Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="class" id="method-class" />
                          <Label htmlFor="method-class">فصول دراسية (5-15 شخص)</Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="online" id="method-online" />
                          <Label htmlFor="method-online">دروس أونلاين</Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="hybrid" id="method-hybrid" />
                          <Label htmlFor="method-hybrid">مختلط (حضوري وأونلاين)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  {/* جدولة الدروس */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2">جدولة الدروس</h3>
                    
                    <div>
                      <Label>الأيام المتاحة للدروس *</Label>
                      <div className="grid grid-cols-3 gap-3 mt-2">
                        {weekDays.map((day) => (
                          <div key={day} className="flex items-center space-x-2 space-x-reverse">
                            <Checkbox
                              id={day}
                              checked={formData.availableDays.includes(day)}
                              onCheckedChange={(checked) => handleDayChange(day, checked as boolean)}
                            />
                            <Label htmlFor={day} className="text-sm">{day}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="preferredTime">الوقت المفضل *</Label>
                      <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange("preferredTime", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="اختر الوقت المناسب" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="early-morning">صباحاً مبكراً (6-9)</SelectItem>
                          <SelectItem value="morning">صباحاً (9-12)</SelectItem>
                          <SelectItem value="afternoon">بعد الظهر (12-3)</SelectItem>
                          <SelectItem value="late-afternoon">عصراً (3-6)</SelectItem>
                          <SelectItem value="evening">مساءً (6-9)</SelectItem>
                          <SelectItem value="night">ليلاً (9-12)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* الشهادات */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2">الشهادات والمؤهلات</h3>
                    
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id="hasLanguageCertificate"
                        checked={formData.hasLanguageCertificate}
                        onCheckedChange={(checked) => handleInputChange("hasLanguageCertificate", checked as boolean)}
                      />
                      <Label htmlFor="hasLanguageCertificate">
                        لدي شهادة في هذه اللغة
                      </Label>
                    </div>
                    
                    {formData.hasLanguageCertificate && (
                      <div>
                        <Label htmlFor="certificateDetails">تفاصيل الشهادة</Label>
                        <Textarea
                          id="certificateDetails"
                          value={formData.certificateDetails}
                          onChange={(e) => handleInputChange("certificateDetails", e.target.value)}
                          className="mt-1"
                          rows={2}
                          placeholder="نوع الشهادة، الدرجة، تاريخ الحصول عليها..."
                        />
                      </div>
                    )}
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
                  
                  <Button type="submit" className="w-full text-lg py-6 bg-purple-600 hover:bg-purple-700">
                    تأكيد التسجيل في دورة اللغات
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

export default LanguageRegistration;