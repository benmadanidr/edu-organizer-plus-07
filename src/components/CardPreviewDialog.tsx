import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CustomStudentIDCard from "./CustomStudentIDCard";

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

interface CardPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  design: CardDesign;
}

const CardPreviewDialog = ({ open, onOpenChange, design }: CardPreviewDialogProps) => {
  // Sample student data for preview
  const sampleStudentData = {
    firstName: "أحمد",
    lastName: "محمد",
    birthDate: "2000-01-01",
    email: "ahmed@example.com",
    phone: "0123456789",
    address: "الجلفة، الجزائر",
    course: "السنة الثالثة",
    previousEducation: "الثانوية العامة",
    notes: "",
    registrationNumber: "2024001",
    registrationDate: "2024-01-01"
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle>معاينة تصميم البطاقة</DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-center py-4">
          <CustomStudentIDCard 
            studentData={sampleStudentData}
            design={design}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CardPreviewDialog;