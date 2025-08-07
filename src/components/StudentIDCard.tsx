import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCode from "qrcode";
import html2canvas from "html2canvas";
import academyLogo from "@/assets/academy-logo.png";
import { formatDate } from "@/lib/localization";

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
  avatar?: string;
}

interface StudentIDCardProps {
  studentData: StudentData;
}

const StudentIDCard = ({ studentData }: StudentIDCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const { toast } = useToast();

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

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        ref={cardRef}
        className="relative shadow-2xl overflow-hidden bg-white"
        style={{ 
          width: '600px',
          height: '400px',
          fontFamily: 'Arial, sans-serif'
        }}
      >
        {/* Blue curved background - top right corner */}
        <div className="absolute top-0 right-0 w-48 h-48">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path 
              d="M200,0 L200,120 Q120,200 0,120 L0,0 Z" 
              fill="#3b82f6"
            />
          </svg>
        </div>

        {/* Blue curved background - left side */}
        <div className="absolute top-0 left-0 h-full w-44">
          <svg viewBox="0 0 180 400" className="w-full h-full">
            <path 
              d="M0,0 L140,0 Q180,200 140,400 L0,400 Z" 
              fill="#3b82f6"
            />
          </svg>
        </div>

        {/* Dark navy accent curve */}
        <div className="absolute top-32 left-0 w-44 h-32">
          <svg viewBox="0 0 180 130" className="w-full h-full">
            <path 
              d="M0,50 Q90,0 180,50 L180,130 L0,130 Z" 
              fill="#1e293b"
            />
          </svg>
        </div>

        {/* Academy Logo - Top Left with golden border */}
        <div className="absolute top-6 left-6 z-20">
          <div className="w-24 h-24 rounded-full border-4 border-yellow-500 overflow-hidden bg-white p-1">
            <img 
              src={academyLogo} 
              alt="Academy Logo" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        {/* Card Title */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
          <h1 className="text-black text-3xl font-bold">بطاقة الطالب</h1>
        </div>

        {/* Academy Name and Location */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center z-10">
          <h2 className="text-black text-xl font-bold mb-1">أكاديميّة الإتقان التّعليميّة</h2>
          <p className="text-black text-lg">بدار الشيّوخ -الجلفة-</p>
        </div>

        {/* Registration Number - Center */}
        <div className="absolute top-36 left-1/2 transform -translate-x-1/2 z-10">
          <div className="text-black text-4xl font-bold tracking-wider">
            {studentData.registrationNumber}
          </div>
        </div>

        {/* Student Photo with golden border */}
        <div className="absolute bottom-16 left-8 z-10">
          <div className="w-28 h-32 border-4 border-yellow-500 rounded-lg bg-white overflow-hidden">
            <img 
              src={studentData.avatar || '/placeholder.svg'} 
              alt="صورة الطالب" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>
        </div>

        {/* Student Information - Right Side */}
        <div className="absolute top-52 right-8 z-10 text-right space-y-6">
          <div className="text-black text-xl">
            <span className="font-bold">: الاسـم واللقب</span>
            <div className="mt-1 text-lg">{studentData.firstName} {studentData.lastName}</div>
          </div>
          
          <div className="text-black text-xl">
            <span className="font-bold">: تاريخ الميــلاد</span>
            <div className="mt-1 text-lg">{formatDate(studentData.birthDate)}</div>
          </div>
          
          <div className="text-black text-xl">
            <span className="font-bold">: المستوى الدراسي</span>
            <div className="mt-1 text-lg">{studentData.course}</div>
          </div>
        </div>

        {/* QR Code - Bottom Right */}
        <div className="absolute bottom-4 right-4 z-10">
          <div className="bg-white p-1 rounded shadow-md">
            {qrCodeUrl && (
              <img 
                src={qrCodeUrl} 
                alt="QR Code" 
                className="w-12 h-12"
              />
            )}
          </div>
        </div>

        {/* Bottom Slogan */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-slate-800 flex items-center justify-center z-10">
          <div className="text-white text-2xl font-bold">
            نجاحكم غايتنا وهدفنا
          </div>
        </div>

        {/* Hidden Student Info for QR */}
        <div className="hidden">
          <div>{studentData.firstName} {studentData.lastName}</div>
          <div>{formatDate(studentData.birthDate)}</div>
          <div>{studentData.course}</div>
        </div>
      </div>

      <Button 
        onClick={downloadCard}
        className="flex items-center gap-2 bg-primary hover:bg-primary/90"
      >
        <Download className="w-4 h-4" />
        تحميل البطاقة
      </Button>
    </div>
  );
};

export default StudentIDCard;