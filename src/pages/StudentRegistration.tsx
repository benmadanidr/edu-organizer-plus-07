import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, CheckCircle, Camera, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

interface StudentData {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  phones: string[];
  address: string;
  course: string;
  educationLevel: string;
  educationGrade: string;
  educationBranch?: string;
  educationSpecialty?: string;
  notes: string;
  profileImage?: string;
}

const StudentRegistration = () => {
  const [formData, setFormData] = useState<StudentData>({
    firstName: "",
    lastName: "",
    birthDate: "",
    email: "",
    phones: [""],
    address: "",
    course: "",
    educationLevel: "",
    educationGrade: "",
    educationBranch: "",
    educationSpecialty: "",
    notes: "",
    profileImage: ""
  });
  
  const [registrationNumber, setRegistrationNumber] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  // Education level options
  const educationLevels = {
    primary: {
      label: "ابتدائي",
      grades: ["أولى ابتدائي", "ثانية ابتدائي", "ثالثة ابتدائي", "رابعة ابتدائي", "خامسة ابتدائي"]
    },
    middle: {
      label: "متوسط", 
      grades: ["أولى متوسط", "ثانية متوسط", "ثالثة متوسط", "رابعة متوسط"]
    },
    secondary: {
      label: "ثانوي",
      grades: {
        "أولى ثانوي": ["علوم وتكنولوجيا", "آداب وفلسفة"],
        "ثانية ثانوي": [
          "رياضيات",
          "علوم تجريبية", 
          "تقني رياضي",
          "آداب وفلسفة",
          "لغات",
          "تسيير واقتصاد"
        ],
        "ثالثة ثانوي": [
          "رياضيات",
          "علوم تجريبية",
          "تقني رياضي", 
          "آداب وفلسفة",
          "لغات",
          "تسيير واقتصاد"
        ]
      }
    }
  };

  const techSpecialties = ["هندسة مدنية", "هندسة كهربائية", "هندسة الطرائق", "هندسة ميكانيكية"];

  const handleInputChange = (field: keyof StudentData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhoneChange = (index: number, value: string) => {
    // Limit to 10 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 10);
    const newPhones = [...formData.phones];
    newPhones[index] = numericValue;
    setFormData(prev => ({ ...prev, phones: newPhones }));
  };

  const addPhone = () => {
    setFormData(prev => ({ ...prev, phones: [...prev.phones, ""] }));
  };

  const removePhone = (index: number) => {
    if (formData.phones.length > 1) {
      const newPhones = formData.phones.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, phones: newPhones }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getAvailableGrades = () => {
    if (!formData.educationLevel) return [];
    if (formData.educationLevel === "primary") return educationLevels.primary.grades;
    if (formData.educationLevel === "middle") return educationLevels.middle.grades;
    if (formData.educationLevel === "secondary") return Object.keys(educationLevels.secondary.grades);
    return [];
  };

  const getAvailableBranches = () => {
    if (formData.educationLevel !== "secondary" || !formData.educationGrade) return [];
    return educationLevels.secondary.grades[formData.educationGrade as keyof typeof educationLevels.secondary.grades] || [];
  };

  const showSpecialtyOptions = () => {
    return formData.educationLevel === "secondary" && formData.educationBranch === "تقني رياضي";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form submission started");
    console.log("Form data:", formData);
    
    // Generate registration number
    const regNumber = `STU${Date.now().toString().slice(-6)}`;
    setRegistrationNumber(regNumber);
    
    console.log("Generated registration number:", regNumber);
    
    // Store in localStorage (in real app, would send to Google Sheets)
    const studentRecord = {
      ...formData,
      phone: formData.phones[0] || "", // استخدام أول رقم هاتف كرقم رئيسي
      registrationNumber: regNumber,
      registrationDate: new Date().toISOString(),
      status: "pending", // قيد المراجعة
      reviewedBy: null,
      reviewDate: null,
      reviewNotes: "",
      previousEducation: `${formData.educationLevel} ${formData.educationGrade} ${formData.educationBranch || ''} ${formData.educationSpecialty || ''}`.trim()
    };
    
    console.log("Student record to save:", studentRecord);
    
    try {
      localStorage.setItem(`student_${regNumber}`, JSON.stringify(studentRecord));
      console.log("Data saved to localStorage successfully");
      
      // Verify data was saved
      const savedData = localStorage.getItem(`student_${regNumber}`);
      console.log("Verified saved data:", savedData);
      
      setIsSubmitted(true);
      toast({
        title: "تم التسجيل بنجاح",
        description: `رقم التسجيل الخاص بك: ${regNumber}`,
      });
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ البيانات",
        variant: "destructive"
      });
    }
  };

  if (isSubmitted) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl shadow-xl">
            <CardHeader className="text-center bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-t-lg">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16" />
              </div>
              <CardTitle className="text-2xl">تم التسجيل بنجاح!</CardTitle>
            </CardHeader>
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">رقم التسجيل الخاص بك:</h3>
                <div className="bg-primary/10 p-4 rounded-lg">
                  <span className="text-2xl font-bold text-primary">{registrationNumber}</span>
                </div>
              </div>
              
              <div className="space-y-3 text-sm text-muted-foreground mb-6">
                <p>احتفظ برقم التسجيل وتاريخ الميلاد للمراجعة أو التعديل على البيانات لاحقاً</p>
                <p className="text-orange-600 font-semibold">⏳ تسجيلك قيد المراجعة من إدارة الأكاديمية</p>
                <p>سيتم التواصل معك خلال 24-48 ساعة لتأكيد قبولك في الدورة</p>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button onClick={() => window.location.href = "/"} className="flex items-center gap-2">
                  العودة للرئيسية
                  <ArrowRight className="w-4 h-4" />
                </Button>
                
                <Button variant="outline" onClick={() => window.location.href = "/verify"}>
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
              <CardHeader className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                <CardTitle className="text-2xl text-center">تسجيل طالب جديد</CardTitle>
              </CardHeader>
              
              <CardContent className="p-6" dir="rtl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Profile Image Upload */}
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full border-4 border-dashed border-primary/30 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group overflow-hidden">
                        {formData.profileImage ? (
                          <img 
                            src={formData.profileImage} 
                            alt="Profile" 
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <>
                            <Camera className="w-8 h-8 text-primary/60 mb-2" />
                            <span className="text-xs text-center text-primary/60 px-2">أدرج صورتك</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

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

                  {/* Multiple Phone Numbers */}
                  <div>
                    <Label>أرقام الهاتف *</Label>
                    <div className="space-y-2 mt-1">
                      {formData.phones.map((phone, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            type="tel"
                            value={phone}
                            onChange={(e) => handlePhoneChange(index, e.target.value)}
                            placeholder="رقم الهاتف (10 أرقام)"
                            required={index === 0}
                            className="flex-1"
                            maxLength={10}
                          />
                          {formData.phones.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removePhone(index)}
                              className="px-3"
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
                        onClick={addPhone}
                        className="flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        إضافة رقم آخر
                      </Button>
                    </div>
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

                  {/* Education Level Selection */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="educationLevel">المستوى الدراسي *</Label>
                      <Select 
                        value={formData.educationLevel} 
                        onValueChange={(value) => {
                          handleInputChange("educationLevel", value);
                          setFormData(prev => ({ 
                            ...prev, 
                            educationGrade: "", 
                            educationBranch: "", 
                            educationSpecialty: "" 
                          }));
                        }}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="اختر المستوى الدراسي" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="primary">ابتدائي</SelectItem>
                          <SelectItem value="middle">متوسط</SelectItem>
                          <SelectItem value="secondary">ثانوي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Grade Selection */}
                    {formData.educationLevel && (
                      <div>
                        <Label htmlFor="educationGrade">الصف *</Label>
                        <Select 
                          value={formData.educationGrade} 
                          onValueChange={(value) => {
                            handleInputChange("educationGrade", value);
                            setFormData(prev => ({ 
                              ...prev, 
                              educationBranch: "", 
                              educationSpecialty: "" 
                            }));
                          }}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="اختر الصف" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableGrades().map((grade) => (
                              <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Branch Selection for Secondary */}
                    {formData.educationLevel === "secondary" && formData.educationGrade && (
                      <div>
                        <Label htmlFor="educationBranch">الشعبة *</Label>
                        <Select 
                          value={formData.educationBranch} 
                          onValueChange={(value) => {
                            handleInputChange("educationBranch", value);
                            setFormData(prev => ({ ...prev, educationSpecialty: "" }));
                          }}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="اختر الشعبة" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableBranches().map((branch) => (
                              <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Specialty Selection for Technical Math */}
                    {showSpecialtyOptions() && (
                      <div>
                        <Label htmlFor="educationSpecialty">التخصص *</Label>
                        <Select 
                          value={formData.educationSpecialty} 
                          onValueChange={(value) => handleInputChange("educationSpecialty", value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="اختر التخصص" />
                          </SelectTrigger>
                          <SelectContent>
                            {techSpecialties.map((specialty) => (
                              <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="course">الدورة المرغوبة *</Label>
                    <Select value={formData.course} onValueChange={(value) => handleInputChange("course", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="اختر الدورة" />
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
                    تأكيد التسجيل
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

export default StudentRegistration;