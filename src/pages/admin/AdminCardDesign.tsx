import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Upload, Plus, Trash2, Move, Settings, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CardPreviewDialog from "@/components/CardPreviewDialog";

interface CardField {
  id: string;
  name: string;
  type: 'text' | 'image' | 'qr' | 'date' | 'number';
  label: string;
  x: number; // في ملي متر
  y: number; // في ملي متر
  width: number; // في ملي متر
  height: number; // في ملي متر
  fontSize: number; // في نقطة
  fontWeight: 'normal' | 'bold';
  fontFamily: string;
  color: string;
  alignment: 'right' | 'left' | 'center';
  imageScale?: number;
}

interface CardDesign {
  id: string;
  name: string;
  type: 'male_student' | 'female_student' | 'male_teacher' | 'female_teacher' | 'male_employee' | 'female_employee';
  backgroundImage: string;
  backgroundImageScale?: number;
  backgroundImageX?: number;
  backgroundImageY?: number;
  width: number; // في ملي متر
  height: number; // في ملي متر
  fields: CardField[];
}

const AdminCardDesign = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentDesign, setCurrentDesign] = useState<CardDesign>({
    id: '1',
    name: 'تصميم بطاقة طالب',
    type: 'male_student',
    backgroundImage: '',
    backgroundImageScale: 1,
    backgroundImageX: 0,
    backgroundImageY: 0,
    width: 85.6, // حجم بطاقة ID قياسي بالملي متر
    height: 53.98,
    fields: []
  });
  
  const [savedDesigns, setSavedDesigns] = useState<CardDesign[]>([]);
  
  const [selectedField, setSelectedField] = useState<CardField | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showPreview, setShowPreview] = useState(false);

  const cardTypes = [
    { value: 'male_student', label: 'بطاقة طالب' },
    { value: 'female_student', label: 'بطاقة طالبة' },
    { value: 'male_teacher', label: 'بطاقة أستاذ' },
    { value: 'female_teacher', label: 'بطاقة أستاذة' },
    { value: 'male_employee', label: 'بطاقة موظف' },
    { value: 'female_employee', label: 'بطاقة موظفة' }
  ];

  // تحويل الملي متر إلى بكسل للعرض (1mm = 3.78px على شاشة 96 DPI)
  const mmToPx = (mm: number) => mm * 3.78;
  const pxToMm = (px: number) => px / 3.78;

  useEffect(() => {
    loadSavedDesigns();
  }, []);

  // الحقول المتاحة حسب نوع البطاقة
  const getFieldsForType = (type: string) => {
    const commonFields = [
      { name: 'fullName', label: 'الاسم الكامل', type: 'text' as const },
      { name: 'registrationNumber', label: 'رقم التسجيل', type: 'text' as const },
      { name: 'birthDate', label: 'تاريخ الميلاد', type: 'date' as const },
      { name: 'qrCode', label: 'رمز QR', type: 'qr' as const },
    ];

    if (type.includes('student')) {
      return [
        ...commonFields,
        { name: 'course', label: 'المستوى الدراسي', type: 'text' as const },
        { name: 'previousEducation', label: 'التعليم السابق', type: 'text' as const },
        { name: 'studentPhoto', label: 'صورة الطالب', type: 'image' as const },
      ];
    } else if (type.includes('teacher')) {
      return [
        ...commonFields,
        { name: 'subject', label: 'التخصص', type: 'text' as const },
        { name: 'department', label: 'القسم', type: 'text' as const },
        { name: 'qualification', label: 'المؤهل العلمي', type: 'text' as const },
        { name: 'teacherPhoto', label: 'صورة الأستاذ', type: 'image' as const },
        { name: 'experience', label: 'سنوات الخبرة', type: 'number' as const },
      ];
    } else if (type.includes('employee')) {
      return [
        ...commonFields,
        { name: 'jobTitle', label: 'المسمى الوظيفي', type: 'text' as const },
        { name: 'department', label: 'القسم', type: 'text' as const },
        { name: 'employeeId', label: 'رقم الموظف', type: 'text' as const },
        { name: 'employeePhoto', label: 'صورة الموظف', type: 'image' as const },
        { name: 'hireDate', label: 'تاريخ التوظيف', type: 'date' as const },
      ];
    }
    
    return commonFields;
  };

  const predefinedFields = getFieldsForType(currentDesign.type);

  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCurrentDesign(prev => ({
          ...prev,
          backgroundImage: e.target?.result as string
        }));
        toast({
          title: "تم رفع الصورة بنجاح",
          description: "تم تحديث خلفية البطاقة"
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const addField = (fieldName: string) => {
    const predefinedField = predefinedFields.find(f => f.name === fieldName);
    if (!predefinedField) return;

    const newField: CardField = {
      id: `field-${Date.now()}`,
      name: fieldName,
      type: predefinedField.type,
      label: predefinedField.label,
      x: 5, // 5mm من اليسار
      y: 5, // 5mm من الأعلى
      width: predefinedField.type === 'image' ? 20 : 30, // بالملي متر
      height: predefinedField.type === 'image' ? 25 : 8, // بالملي متر
      fontSize: 12, // نقطة
      fontWeight: 'normal',
      fontFamily: 'cairo',
      color: '#000000',
      alignment: 'right',
      imageScale: predefinedField.type === 'image' ? 1 : undefined
    };

    setCurrentDesign(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const removeField = (fieldId: string) => {
    setCurrentDesign(prev => ({
      ...prev,
      fields: prev.fields.filter(f => f.id !== fieldId)
    }));
    setSelectedField(null);
  };

  const updateField = (fieldId: string, updates: Partial<CardField>) => {
    setCurrentDesign(prev => ({
      ...prev,
      fields: prev.fields.map(f => 
        f.id === fieldId ? { ...f, ...updates } : f
      )
    }));
    
    if (selectedField?.id === fieldId) {
      setSelectedField(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const handleMouseDown = (field: CardField, event: React.MouseEvent) => {
    setSelectedField(field);
    setIsDragging(true);
    const rect = event.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDragging && selectedField) {
      const containerRect = event.currentTarget.getBoundingClientRect();
      const newXPx = event.clientX - containerRect.left - dragOffset.x;
      const newYPx = event.clientY - containerRect.top - dragOffset.y;
      
      // تحويل من بكسل إلى ملي متر
      const newX = pxToMm(newXPx);
      const newY = pxToMm(newYPx);
      
      updateField(selectedField.id, {
        x: Math.max(0, Math.min(newX, currentDesign.width - selectedField.width)),
        y: Math.max(0, Math.min(newY, currentDesign.height - selectedField.height))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // تحميل التصاميم المحفوظة
  const loadSavedDesigns = () => {
    const saved = localStorage.getItem('savedCardDesigns');
    if (saved) {
      try {
        setSavedDesigns(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved designs:', error);
      }
    }
  };

  // حفظ التصميم
  const saveDesign = () => {
    const designToSave = {
      ...currentDesign,
      id: currentDesign.id || `design-${Date.now()}`
    };
    
    const existingDesigns = savedDesigns.filter(d => d.id !== designToSave.id);
    const updatedDesigns = [...existingDesigns, designToSave];
    
    setSavedDesigns(updatedDesigns);
    localStorage.setItem('savedCardDesigns', JSON.stringify(updatedDesigns));
    
    // حفظ التصميم الحالي أيضاً للمعاينة
    localStorage.setItem('cardDesign', JSON.stringify(designToSave));
    
    toast({
      title: "تم حفظ التصميم",
      description: `تم حفظ ${designToSave.name} بنجاح`
    });
  };

  // تحميل تصميم محفوظ
  const loadDesign = (design: CardDesign) => {
    setCurrentDesign(design);
    toast({
      title: "تم تحميل التصميم",
      description: `تم تحميل ${design.name} بنجاح`
    });
  };

  // إنشاء تصميم جديد
  const createNewDesign = (type: string) => {
    const newDesign: CardDesign = {
      id: `design-${Date.now()}`,
      name: cardTypes.find(t => t.value === type)?.label || 'تصميم جديد',
      type: type as any,
      backgroundImage: '',
      backgroundImageScale: 1,
      backgroundImageX: 0,
      backgroundImageY: 0,
      width: 85.6,
      height: 53.98,
      fields: []
    };
    setCurrentDesign(newDesign);
  };

  const renderField = (field: CardField) => {
    const isSelected = selectedField?.id === field.id;
    const baseClasses = `absolute border-2 cursor-move ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300 border-dashed'} p-1`;
    
    const style = {
      left: mmToPx(field.x),
      top: mmToPx(field.y),
      width: mmToPx(field.width),
      height: mmToPx(field.height),
      fontSize: field.fontSize,
      fontWeight: field.fontWeight,
      fontFamily: field.fontFamily,
      color: field.color,
      textAlign: field.alignment as any,
    };

    const content = () => {
      switch (field.type) {
        case 'image':
          return <div className="bg-gray-200 w-full h-full flex items-center justify-center text-xs">صورة</div>;
        case 'qr':
          return <div className="bg-gray-200 w-full h-full flex items-center justify-center text-xs">QR</div>;
        default:
          return <div className="truncate">{field.label}</div>;
      }
    };

    return (
      <div
        key={field.id}
        className={baseClasses}
        style={style}
        onMouseDown={(e) => handleMouseDown(field, e)}
      >
        {content()}
        {isSelected && (
          <Button
            size="sm"
            variant="destructive"
            className="absolute -top-2 -right-2 w-6 h-6 p-0"
            onClick={() => removeField(field.id)}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">تصميم بطاقات الطلاب</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowPreview(true)} variant="outline" className="gap-2">
            <Eye className="w-4 h-4" />
            معاينة
          </Button>
          <Button onClick={saveDesign} className="gap-2">
            <Settings className="w-4 h-4" />
            حفظ التصميم
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Tools */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات البطاقة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>اسم التصميم</Label>
                <Input
                  value={currentDesign.name}
                  onChange={(e) => setCurrentDesign(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <Label>نوع البطاقة</Label>
                <Select 
                  value={currentDesign.type} 
                  onValueChange={(value) => setCurrentDesign(prev => ({ ...prev, type: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
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

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>العرض (mm)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={currentDesign.width}
                    onChange={(e) => setCurrentDesign(prev => ({ ...prev, width: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label>الارتفاع (mm)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={currentDesign.height}
                    onChange={(e) => setCurrentDesign(prev => ({ ...prev, height: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div>
                <Label>صورة الخلفية</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full gap-2"
                >
                  <Upload className="w-4 h-4" />
                  رفع صورة خلفية
                </Button>
              </div>

              {currentDesign.backgroundImage && (
                <>
                  <div>
                    <Label>حجم الصورة</Label>
                    <Input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={currentDesign.backgroundImageScale || 1}
                      onChange={(e) => setCurrentDesign(prev => ({ ...prev, backgroundImageScale: Number(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="text-sm text-muted-foreground mt-1">
                      {((currentDesign.backgroundImageScale || 1) * 100).toFixed(0)}%
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>موضع X (mm)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={pxToMm(currentDesign.backgroundImageX || 0).toFixed(1)}
                        onChange={(e) => setCurrentDesign(prev => ({ ...prev, backgroundImageX: mmToPx(Number(e.target.value)) }))}
                      />
                    </div>
                    <div>
                      <Label>موضع Y (mm)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={pxToMm(currentDesign.backgroundImageY || 0).toFixed(1)}
                        onChange={(e) => setCurrentDesign(prev => ({ ...prev, backgroundImageY: mmToPx(Number(e.target.value)) }))}
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>التصاميم المحفوظة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>إنشاء تصميم جديد</Label>
                <Select onValueChange={createNewDesign}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع البطاقة" />
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

              {savedDesigns.length > 0 && (
                <div className="space-y-2">
                  <Label>التصاميم المحفوظة</Label>
                  {savedDesigns.map(design => (
                    <Button
                      key={design.id}
                      variant="outline"
                      size="sm"
                      onClick={() => loadDesign(design)}
                      className="w-full justify-start"
                    >
                      {design.name}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>الحقول المتاحة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {predefinedFields.map((field) => (
                  <Button
                    key={field.name}
                    variant="outline"
                    size="sm"
                    onClick={() => addField(field.name)}
                    className="w-full justify-start gap-2"
                    disabled={currentDesign.fields.some(f => f.name === field.name)}
                  >
                    <Plus className="w-3 h-3" />
                    {field.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedField && (
            <Card>
              <CardHeader>
                <CardTitle>تخصيص الحقل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>المكان X (mm)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={selectedField.x}
                      onChange={(e) => updateField(selectedField.id, { x: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>المكان Y (mm)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={selectedField.y}
                      onChange={(e) => updateField(selectedField.id, { y: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>العرض (mm)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={selectedField.width}
                      onChange={(e) => updateField(selectedField.id, { width: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>الارتفاع (mm)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={selectedField.height}
                      onChange={(e) => updateField(selectedField.id, { height: Number(e.target.value) })}
                    />
                  </div>
                </div>

                {selectedField.type === 'text' && (
                  <>
                    <div>
                      <Label>حجم الخط</Label>
                      <Input
                        type="number"
                        value={selectedField.fontSize}
                        onChange={(e) => updateField(selectedField.id, { fontSize: Number(e.target.value) })}
                      />
                    </div>

                    <div>
                      <Label>نوع الخط</Label>
                      <Select 
                        value={selectedField.fontFamily} 
                        onValueChange={(value) => updateField(selectedField.id, { fontFamily: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cairo">Cairo</SelectItem>
                          <SelectItem value="amiri">Amiri</SelectItem>
                          <SelectItem value="tajawal">Tajawal</SelectItem>
                          <SelectItem value="ibm-arabic">IBM Plex Sans Arabic</SelectItem>
                          <SelectItem value="lato">Lato</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>وزن الخط</Label>
                      <Select 
                        value={selectedField.fontWeight} 
                        onValueChange={(value) => updateField(selectedField.id, { fontWeight: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">عادي</SelectItem>
                          <SelectItem value="bold">عريض</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>محاذاة النص</Label>
                      <Select 
                        value={selectedField.alignment} 
                        onValueChange={(value) => updateField(selectedField.id, { alignment: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="right">يمين</SelectItem>
                          <SelectItem value="center">وسط</SelectItem>
                          <SelectItem value="left">يسار</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>لون النص</Label>
                      <Input
                        type="color"
                        value={selectedField.color}
                        onChange={(e) => updateField(selectedField.id, { color: e.target.value })}
                      />
                    </div>
                  </>
                )}

                {selectedField.type === 'image' && (
                  <div>
                    <Label>حجم الصورة</Label>
                    <Input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={selectedField.imageScale || 1}
                      onChange={(e) => updateField(selectedField.id, { imageScale: Number(e.target.value) })}
                      className="w-full"
                    />
                    <div className="text-sm text-muted-foreground mt-1">
                      {((selectedField.imageScale || 1) * 100).toFixed(0)}%
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Canvas */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Move className="w-5 h-5" />
                منطقة التصميم
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div
                  className="relative border-2 border-gray-300 bg-white shadow-lg"
                  style={{
                    width: mmToPx(currentDesign.width),
                    height: mmToPx(currentDesign.height),
                    backgroundImage: currentDesign.backgroundImage ? `url(${currentDesign.backgroundImage})` : 'none',
                    backgroundSize: currentDesign.backgroundImageScale ? `${currentDesign.backgroundImageScale * 100}%` : 'cover',
                    backgroundPosition: `${currentDesign.backgroundImageX || 0}px ${currentDesign.backgroundImageY || 0}px`,
                    backgroundRepeat: 'no-repeat'
                  }}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  {!currentDesign.backgroundImage && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-lg">
                      اختر صورة خلفية للبطاقة
                    </div>
                  )}
                  
                  {currentDesign.fields.map(renderField)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fields List */}
      <Card>
        <CardHeader>
          <CardTitle>الحقول المضافة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {currentDesign.fields.map((field) => (
              <Badge
                key={field.id}
                variant={selectedField?.id === field.id ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setSelectedField(field)}
              >
                {field.label}
              </Badge>
            ))}
            {currentDesign.fields.length === 0 && (
              <p className="text-gray-500">لم يتم إضافة أي حقول بعد</p>
            )}
          </div>
        </CardContent>
      </Card>

      <CardPreviewDialog 
        open={showPreview}
        onOpenChange={setShowPreview}
        design={currentDesign}
      />
    </div>
  );
};

export default AdminCardDesign;