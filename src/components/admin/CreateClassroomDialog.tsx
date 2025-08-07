import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface CreateClassroomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DAYS = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];
const COURSES = ["القرآن الكريم", "اللغة العربية", "اللغة الإنجليزية", "الرياضيات", "العلوم", "الحاسوب"];
const LOCATIONS = ["القاعة الأولى", "القاعة الثانية", "القاعة الثالثة", "مختبر الحاسوب", "قاعة المحاضرات"];

export const CreateClassroomDialog = ({ open, onOpenChange }: CreateClassroomDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    course: "",
    teacher: "",
    capacity: "",
    location: "",
    time: "",
    duration: "",
    startDate: "",
    endDate: "",
    selectedDays: [] as string[]
  });

  const handleDayToggle = (day: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedDays: checked 
        ? [...prev.selectedDays, day]
        : prev.selectedDays.filter(d => d !== day)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.course || !formData.teacher || !formData.capacity || 
        !formData.location || !formData.time || !formData.selectedDays.length) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically save to a database
    toast({
      title: "تم إنشاء الفصل بنجاح",
      description: `تم إنشاء فصل "${formData.name}" بنجاح`,
    });

    // Reset form
    setFormData({
      name: "",
      course: "",
      teacher: "",
      capacity: "",
      location: "",
      time: "",
      duration: "",
      startDate: "",
      endDate: "",
      selectedDays: []
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">إنشاء فصل دراسي جديد</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">اسم الفصل *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="مثال: فصل القرآن الكريم - المستوى الأول"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">المادة *</Label>
              <Select value={formData.course} onValueChange={(value) => setFormData(prev => ({ ...prev, course: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المادة" />
                </SelectTrigger>
                <SelectContent>
                  {COURSES.map(course => (
                    <SelectItem key={course} value={course}>{course}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teacher">اسم المعلم *</Label>
              <Input
                id="teacher"
                value={formData.teacher}
                onChange={(e) => setFormData(prev => ({ ...prev, teacher: e.target.value }))}
                placeholder="مثال: الشيخ أحمد محمد"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">السعة القصوى *</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                placeholder="مثال: 20"
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">المكان *</Label>
              <Select value={formData.location} onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المكان" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">وقت البداية *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">مدة الحصة</Label>
              <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المدة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ساعة واحدة">ساعة واحدة</SelectItem>
                  <SelectItem value="ساعة ونصف">ساعة ونصف</SelectItem>
                  <SelectItem value="ساعتان">ساعتان</SelectItem>
                  <SelectItem value="ساعتان ونصف">ساعتان ونصف</SelectItem>
                  <SelectItem value="ثلاث ساعات">ثلاث ساعات</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">تاريخ البداية</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">تاريخ النهاية</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>أيام الأسبوع *</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {DAYS.map(day => (
                <div key={day} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id={day}
                    checked={formData.selectedDays.includes(day)}
                    onCheckedChange={(checked) => handleDayToggle(day, checked as boolean)}
                  />
                  <Label htmlFor={day} className="text-sm">{day}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              إنشاء الفصل
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};