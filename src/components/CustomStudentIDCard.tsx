import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCode from "qrcode";
import html2canvas from "html2canvas";

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

interface CardField {
  id: string;
  name: string;
  type: 'text' | 'image' | 'qr' | 'date' | 'number';
  label: string;
  x: number; // بالملي متر
  y: number; // بالملي متر
  width: number; // بالملي متر
  height: number; // بالملي متر
  fontSize: number; // بالنقطة
  fontWeight: 'normal' | 'bold';
  fontFamily: string;
  color: string;
  alignment: 'right' | 'left' | 'center';
  imageScale?: number;
}

interface CardDesign {
  id: string;
  name: string;
  type?: 'male_student' | 'female_student' | 'male_teacher' | 'female_teacher' | 'male_employee' | 'female_employee';
  backgroundImage: string;
  backgroundImageScale?: number;
  backgroundImageX?: number;
  backgroundImageY?: number;
  width: number; // بالملي متر
  height: number; // بالملي متر
  fields: CardField[];
}

interface CustomStudentIDCardProps {
  studentData: StudentData;
  design?: CardDesign;
  scale?: number; // مقياس العرض
  hideDownloadButton?: boolean; // إخفاء زر التحميل
}

const CustomStudentIDCard = ({ studentData, design, scale = 0.75, hideDownloadButton = false }: CustomStudentIDCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const { toast } = useToast();

  // Load design from localStorage if not provided
  const [cardDesign, setCardDesign] = useState<CardDesign | null>(null);

  // تحويل الملي متر إلى بكسل للعرض (1mm = 3.78px على شاشة 96 DPI)
  const mmToPx = (mm: number) => mm * 3.78;

  useEffect(() => {
    if (design) {
      setCardDesign(design);
    } else {
      // Load from localStorage
      const savedDesign = localStorage.getItem('cardDesign');
      console.log('Saved design from localStorage:', savedDesign);
      if (savedDesign) {
        try {
          const parsedDesign = JSON.parse(savedDesign);
          console.log('Parsed design:', parsedDesign);
          setCardDesign(parsedDesign);
        } catch (error) {
          console.error('Error loading card design:', error);
        }
      } else {
        console.log('No card design found in localStorage');
      }
    }
  }, [design]);

  // Generate QR code
  useEffect(() => {
    const generateQR = async () => {
      const qrData = JSON.stringify({
        name: `${studentData.firstName} ${studentData.lastName}`,
        registrationNumber: studentData.registrationNumber,
        course: studentData.course,
        registrationDate: studentData.registrationDate
      });

      try {
        const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
          width: 120,
          color: {
            dark: '#1f2937',
            light: '#ffffff'
          }
        });
        setQrCodeUrl(qrCodeDataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQR();
  }, [studentData]);

  const downloadCard = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true
      });

      const link = document.createElement('a');
      link.download = `student-card-${studentData.registrationNumber}.png`;
      link.href = canvas.toDataURL();
      link.click();

      toast({
        title: "تم التحميل بنجاح",
        description: "تم تحميل بطاقة الطالب بنجاح"
      });
    } catch (error) {
      console.error('Error downloading card:', error);
      toast({
        title: "خطأ في التحميل",
        description: "حدث خطأ أثناء تحميل البطاقة",
        variant: "destructive"
      });
    }
  };

  const getFieldValue = (field: CardField) => {
    switch (field.name) {
      case 'fullName':
        return `${studentData.firstName} ${studentData.lastName}`;
      case 'firstName':
        return studentData.firstName;
      case 'lastName':
        return studentData.lastName;
      case 'registrationNumber':
        return studentData.registrationNumber;
      case 'birthDate':
        return new Date(studentData.birthDate).toLocaleDateString('ar-EG');
      case 'course':
        return studentData.course;
      case 'email':
        return studentData.email;
      case 'phone':
        return studentData.phone;
      case 'previousEducation':
        return studentData.previousEducation || '';
      case 'subject':
        return studentData.course; // استخدام الكورس كتخصص للأستاذ
      case 'department':
        return 'قسم التدريس';
      case 'qualification':
        return studentData.previousEducation || '';
      case 'experience':
        return '5 سنوات'; // قيمة افتراضية
      case 'jobTitle':
        return studentData.course; // استخدام الكورس كمسمى وظيفي
      case 'employeeId':
        return studentData.registrationNumber;
      case 'hireDate':
        return new Date(studentData.registrationDate).toLocaleDateString('ar-EG');
      default:
        return field.label;
    }
  };

  const renderField = (field: CardField) => {
    const style = {
      position: 'absolute' as const,
      left: `${mmToPx(field.x)}px`,
      top: `${mmToPx(field.y)}px`,
      width: `${mmToPx(field.width)}px`,
      height: `${mmToPx(field.height)}px`,
      fontSize: `${field.fontSize}px`,
      fontWeight: field.fontWeight,
      fontFamily: field.fontFamily,
      color: field.color,
      textAlign: field.alignment as any,
      display: 'flex',
      alignItems: 'center',
      justifyContent: field.alignment === 'center' ? 'center' : 
                     field.alignment === 'right' ? 'flex-end' : 'flex-start',
      zIndex: 10
    };

    switch (field.type) {
      case 'image':
        if (field.name === 'studentPhoto' || field.name === 'teacherPhoto' || field.name === 'employeePhoto') {
          return (
            <div key={field.id} style={style}>
              <div 
                className="w-full h-full border-2 border-gray-300 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-500"
                style={{
                  transform: `scale(${field.imageScale || 1})`,
                  transformOrigin: 'center center'
                }}
              >
                {field.name === 'studentPhoto' ? 'صورة الطالب' : 
                 field.name === 'teacherPhoto' ? 'صورة الأستاذ' : 'صورة الموظف'}
              </div>
            </div>
          );
        }
        break;
      case 'qr':
        return (
          <div key={field.id} style={style}>
            {qrCodeUrl && (
              <img 
                src={qrCodeUrl} 
                alt="QR Code" 
                style={{ width: field.width, height: field.height }}
              />
            )}
          </div>
        );
      default:
        return (
          <div key={field.id} style={style}>
            {getFieldValue(field)}
          </div>
        );
    }
  };

  if (!cardDesign) {
    return (
      <div className="flex flex-col items-center gap-6">
        <Card className="p-6">
          <p className="text-center text-muted-foreground mb-4">
            لم يتم العثور على تصميم بطاقة محفوظ.
          </p>
          <p className="text-center text-sm text-muted-foreground">
            يرجى الذهاب إلى قسم الإدارة &gt; تصميم بطاقات الطلاب لإنشاء وحفظ تصميم البطاقة.
          </p>
          <div className="mt-4 text-center">
            <Button 
              onClick={() => window.location.href = '/admin/card-design'}
              variant="outline"
            >
              إنشاء تصميم البطاقة
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        ref={cardRef}
        className="relative shadow-2xl overflow-hidden bg-white"
        style={{ 
          width: `${mmToPx(cardDesign.width) * scale}px`,
          height: `${mmToPx(cardDesign.height) * scale}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          fontFamily: 'Arial, sans-serif',
          backgroundImage: cardDesign.backgroundImage ? `url(${cardDesign.backgroundImage})` : 'none',
          backgroundSize: cardDesign.backgroundImageScale ? `${cardDesign.backgroundImageScale * 100}%` : 'cover',
          backgroundPosition: `${mmToPx(cardDesign.backgroundImageX || 0)}px ${mmToPx(cardDesign.backgroundImageY || 0)}px`,
          backgroundRepeat: 'no-repeat',
          position: 'relative'
        }}
      >
        {cardDesign.fields.map(renderField)}
      </div>

      {!hideDownloadButton && (
        <Button 
          onClick={downloadCard}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90"
        >
          <Download className="w-4 h-4" />
          تحميل البطاقة
        </Button>
      )}
    </div>
  );
};

export default CustomStudentIDCard;