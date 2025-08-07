import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Trash2, FileText } from "lucide-react";
import CustomStudentIDCard from "@/components/CustomStudentIDCard";

interface StudentData {
  id: string;
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
  type: 'male_student' | 'female_student' | 'male_teacher' | 'female_teacher' | 'male_employee' | 'female_employee';
}

interface CardDesign {
  id: string;
  name: string;
  type: 'male_student' | 'female_student' | 'male_teacher' | 'female_teacher' | 'male_employee' | 'female_employee';
  backgroundImage: string;
  backgroundImageScale?: number;
  backgroundImageX?: number;
  backgroundImageY?: number;
  width: number;
  height: number;
  fields: any[];
}

const AdminCards = () => {
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCards, setSelectedCards] = useState<StudentData[]>([]);
  const [savedDesigns, setSavedDesigns] = useState<CardDesign[]>([]);
  const marginControl = 5; // هوامش مخفضة للطباعة بالملي متر (0.5 سم)

  // تحميل البيانات المحفوظة
  useEffect(() => {
    const designs = localStorage.getItem('savedCardDesigns');
    if (designs) {
      try {
        setSavedDesigns(JSON.parse(designs));
      } catch (error) {
        console.error('Error loading designs:', error);
      }
    }
  }, []);

  // بيانات تجريبية للطلاب والمعلمين والموظفين
  const sampleData: StudentData[] = [
    {
      id: '1',
      firstName: 'أحمد',
      lastName: 'محمد',
      birthDate: '1995-01-15',
      email: 'ahmed@example.com',
      phone: '123456789',
      address: 'الرياض',
      course: 'الصف الثالث',
      previousEducation: 'ثانوية عامة',
      notes: '',
      registrationNumber: 'STD001',
      registrationDate: '2024-01-01',
      type: 'male_student'
    },
    {
      id: '2',
      firstName: 'فاطمة',
      lastName: 'علي',
      birthDate: '1997-03-20',
      email: 'fatima@example.com',
      phone: '987654321',
      address: 'جدة',
      course: 'الصف الثاني',
      previousEducation: 'ثانوية عامة',
      notes: '',
      registrationNumber: 'STD002',
      registrationDate: '2024-01-02',
      type: 'female_student'
    },
    {
      id: '3',
      firstName: 'محمد',
      lastName: 'أحمد',
      birthDate: '1985-07-10',
      email: 'mohamed@example.com',
      phone: '555666777',
      address: 'الدمام',
      course: 'معلم رياضيات',
      previousEducation: 'بكالوريوس رياضيات',
      notes: '',
      registrationNumber: 'TCH001',
      registrationDate: '2024-01-01',
      type: 'male_teacher'
    },
    {
      id: '4',
      firstName: 'عائشة',
      lastName: 'سالم',
      birthDate: '1990-05-15',
      email: 'aisha@example.com',
      phone: '444555666',
      address: 'مكة',
      course: 'معلمة لغة عربية',
      previousEducation: 'ماجستير لغة عربية',
      notes: '',
      registrationNumber: 'TCH002',
      registrationDate: '2024-01-03',
      type: 'female_teacher'
    },
    {
      id: '5',
      firstName: 'خالد',
      lastName: 'العتيبي',
      birthDate: '1988-12-10',
      email: 'khalid@example.com',
      phone: '333444555',
      address: 'الطائف',
      course: 'موظف إداري',
      previousEducation: 'دبلوم إدارة',
      notes: '',
      registrationNumber: 'EMP001',
      registrationDate: '2024-01-04',
      type: 'male_employee'
    },
    {
      id: '6',
      firstName: 'نورا',
      lastName: 'الزهراني',
      birthDate: '1992-08-22',
      email: 'nora@example.com',
      phone: '222333444',
      address: 'أبها',
      course: 'موظفة مالية',
      previousEducation: 'بكالوريوس محاسبة',
      notes: '',
      registrationNumber: 'EMP002',
      registrationDate: '2024-01-05',
      type: 'female_employee'
    }
  ];

  const cardTypes = [
    { value: 'all', label: 'جميع الأنواع' },
    { value: 'male_student', label: 'طلاب' },
    { value: 'female_student', label: 'طالبات' },
    { value: 'male_teacher', label: 'معلمين' },
    { value: 'female_teacher', label: 'معلمات' },
    { value: 'male_employee', label: 'موظفين' },
    { value: 'female_employee', label: 'موظفات' }
  ];

  // تصفية البيانات
  const filteredData = sampleData.filter(person => {
    const matchesSearch = person.firstName.includes(searchTerm) || 
                         person.lastName.includes(searchTerm) ||
                         person.registrationNumber.includes(searchTerm);
    const matchesType = selectedType === 'all' || person.type === selectedType;
    return matchesSearch && matchesType;
  });

  // حساب عدد البطاقات في الصف الواحد وعدد الصفوف
  const calculateCardsPerPage = () => {
    const pageWidth = 210; // عرض ورقة A4 بالملي متر
    const pageHeight = 297; // ارتفاع ورقة A4 بالملي متر
    const cardWidth = 85.6; // عرض البطاقة بالملي متر (الحجم الأصلي)
    const cardHeight = 53.98; // ارتفاع البطاقة بالملي متر (الحجم الأصلي)
    const cardSpacing = 2; // المسافة بين البطاقات بالملي متر
    
    // حساب عدد البطاقات في الصف الواحد
    const availableWidth = pageWidth - (2 * marginControl);
    const cardsPerRow = Math.floor((availableWidth + cardSpacing) / (cardWidth + cardSpacing));
    
    // حساب عدد الصفوف
    const availableHeight = pageHeight - (2 * marginControl);
    const rowsPerPage = Math.floor((availableHeight + cardSpacing) / (cardHeight + cardSpacing));
    
    return {
      cardsPerRow: Math.max(1, cardsPerRow),
      rowsPerPage: Math.max(1, rowsPerPage),
      totalCardsPerPage: Math.max(1, cardsPerRow * rowsPerPage)
    };
  };

  const { cardsPerRow, rowsPerPage, totalCardsPerPage } = calculateCardsPerPage();

  // إضافة إلى البطاقات المحددة
  const addToSelectedCards = (person: StudentData) => {
    if (selectedCards.length >= totalCardsPerPage) {
      toast({
        title: "لا يمكن الإضافة",
        description: `لا يمكن إضافة أكثر من ${totalCardsPerPage} بطاقة في الورقة الواحدة`,
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedCards.find(p => p.id === person.id)) {
      setSelectedCards([...selectedCards, person]);
      toast({
        title: "تمت الإضافة",
        description: `تمت إضافة ${person.firstName} ${person.lastName} للورقة`
      });
    }
  };

  // إزالة من البطاقات المحددة
  const removeFromSelectedCards = (personId: string) => {
    setSelectedCards(selectedCards.filter(p => p.id !== personId));
  };

  // طباعة البطاقات
  const printCards = () => {
    if (selectedCards.length === 0) {
      toast({
        title: "لا توجد بطاقات",
        description: "لا توجد بطاقات للطباعة",
        variant: "destructive"
      });
      return;
    }

    if (!printRef.current) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // إنشاء محتوى طباعة يحتوي فقط على البطاقات المحددة
    const cardsHtml = selectedCards.map((card, index) => {
      return `
        <div class="card-slot" style="width: 85.6mm; height: 53.98mm; margin: 0; position: relative;">
          ${printRef.current?.children[index]?.querySelector('.card')?.outerHTML || ''}
        </div>
      `;
    }).join('');
    
    const fullPrintContent = `
      <!DOCTYPE html>
      <html dir="rtl">
        <head>
          <title>طباعة البطاقات</title>
          <meta charset="utf-8">
          <style>
            @page {
              size: A4;
              margin: ${marginControl}mm;
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              direction: rtl;
              background: white;
            }
            .print-container {
              width: 100%;
              display: grid;
              grid-template-columns: repeat(${cardsPerRow}, 85.6mm);
              grid-template-rows: repeat(${Math.ceil(selectedCards.length / cardsPerRow)}, 53.98mm);
              gap: 2mm;
              padding: 0;
              margin: 0;
              justify-content: center;
            }
            .card-slot {
              width: 85.6mm;
              height: 53.98mm;
              margin: 0;
              page-break-inside: avoid;
              position: relative;
              overflow: visible;
            }
            .card {
              width: 100% !important;
              height: 100% !important;
              transform: none !important;
              border: none !important;
              box-shadow: none !important;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .remove-button, .print\\:hidden, 
            button[title*="تحميل"], 
            button:contains("تحميل"),
            [class*="download"],
            [id*="download"] {
              display: none !important;
              visibility: hidden !important;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${cardsHtml}
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(fullPrintContent);
    printWindow.document.close();
    
    // انتظار تحميل المحتوى قبل الطباعة
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };

    toast({
      title: "تم إرسال للطباعة",
      description: `تم إرسال ${selectedCards.length} بطاقة للطباعة`
    });
  };

  // الحصول على التصميم المناسب لنوع البطاقة
  const getDesignForType = (type: string): CardDesign | undefined => {
    return savedDesigns.find(design => design.type === type);
  };

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-primary">إدارة البطاقات</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {cardsPerRow} × {rowsPerPage} = {totalCardsPerPage} بطاقة في الورقة
          </div>
          <Button 
            onClick={printCards} 
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
            disabled={selectedCards.length === 0}
          >
            <FileText className="w-4 h-4" />
            طباعة البطاقات ({selectedCards.length}/{totalCardsPerPage})
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* البحث والتصفية وقائمة الأشخاص */}
        <div className="lg:col-span-1 space-y-6">
          {/* البحث والتصفية */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Search className="w-5 h-5" />
                البحث والتصفية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">البحث</Label>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="اسم أو رقم التسجيل..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">نوع البطاقة</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    {cardTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  النتائج: {filteredData.length} من {sampleData.length}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* قائمة الأشخاص */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">قائمة الأشخاص</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {filteredData.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    لا توجد نتائج
                  </div>
                ) : (
                  filteredData.map(person => (
                    <div
                      key={person.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{person.firstName} {person.lastName}</p>
                        <p className="text-xs text-muted-foreground">{person.registrationNumber}</p>
                        <p className="text-xs text-muted-foreground">{cardTypes.find(t => t.value === person.type)?.label}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addToSelectedCards(person)}
                        disabled={selectedCards.some(p => p.id === person.id) || selectedCards.length >= totalCardsPerPage}
                        className="flex-shrink-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ورقة A4 للطباعة */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <CardTitle className="text-xl">ورقة A4 - معاينة الطباعة</CardTitle>
                <div className="text-sm text-muted-foreground">
                  حجم البطاقة: 85.60 × 53.98 مم | هوامش: {marginControl} مم
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div 
                  className="bg-white border-2 shadow-lg overflow-hidden relative"
                  style={{
                    width: '210mm',
                    height: '297mm',
                    transform: 'scale(0.6)',
                    transformOrigin: 'top center'
                  }}
                >
                  {/* Grid للبطاقات مع المسافات المطلوبة */}
                  <div 
                    ref={printRef}
                    className="print-container"
                    style={{
                      margin: `${marginControl}mm`,
                      display: 'grid',
                      gridTemplateColumns: `repeat(${cardsPerRow}, 85.6mm)`,
                      gap: '2mm',
                      padding: '0',
                      justifyContent: 'center',
                      alignContent: 'start'
                    }}
                  >
                    {/* إنشاء الشبكة للبطاقات المحددة فقط */}
                    {selectedCards.map((card, index) => (
                      <div 
                        key={card.id}
                        className="card-slot relative"
                        style={{
                          width: '85.6mm',
                          height: '53.98mm',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0',
                          border: 'none',
                          overflow: 'visible'
                        }}
                      >
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromSelectedCards(card.id)}
                          className="remove-button absolute top-1 left-1 bg-red-500 hover:bg-red-600 text-white z-20 w-6 h-6 p-0 print:hidden"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                        <div className="card w-full h-full">
                          <CustomStudentIDCard
                            studentData={card}
                            design={getDesignForType(card.type)}
                            scale={1}
                            hideDownloadButton={true}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  ترتيب البطاقات: الأولى أعلى اليمين، الثانية أعلى اليسار، الثالثة أسفل اليمين، الرابعة أسفل اليسار
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  يمكنك إضافة حتى {totalCardsPerPage} بطاقة في الورقة الواحدة
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* صفحة الطباعة المخفية */}
      <div className="hidden print:block">
        <style>{`
          @media print {
            @page {
              size: A4;
              margin: ${marginControl}mm;
            }
            body * {
              visibility: hidden;
            }
            .print-container, .print-container * {
              visibility: visible;
            }
            .print-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              display: grid;
              grid-template-columns: repeat(${cardsPerRow}, 1fr);
              grid-template-rows: repeat(${rowsPerPage}, 1fr);
              gap: 2mm;
              padding: ${marginControl}mm;
              box-sizing: border-box;
            }
            .print-card {
              width: 85.6mm;
              height: 53.98mm;
              page-break-inside: avoid;
            }
            .print-card:nth-child(1) { grid-column: 2; grid-row: 1; }
            .print-card:nth-child(2) { grid-column: 1; grid-row: 1; }
            .print-card:nth-child(3) { grid-column: 2; grid-row: 2; }
            .print-card:nth-child(4) { grid-column: 1; grid-row: 2; }
          }
        `}</style>
        <div className="print-container">
          {selectedCards.map((person, index) => (
            <div key={person.id} className="print-card">
              <CustomStudentIDCard
                studentData={person}
                design={getDesignForType(person.type)}
                scale={1}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCards;