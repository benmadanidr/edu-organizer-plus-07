import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "اسم المعلم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().min(10, "رقم الهاتف مطلوب"),
  specialization: z.string().min(1, "التخصص مطلوب"),
  experience: z.string().min(1, "سنوات الخبرة مطلوبة"),
  education: z.string().min(1, "المؤهل العلمي مطلوب"),
  address: z.string().min(5, "العنوان مطلوب"),
  salary: z.string().min(1, "الراتب مطلوب"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AddTeacherDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      specialization: "",
      experience: "",
      education: "",
      address: "",
      salary: "",
      notes: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    // Generate registration number
    const regNumber = `TCH${Date.now().toString().slice(-6)}`;
    
    // Create teacher record
    const teacherRecord = {
      registrationNumber: regNumber,
      ...values,
      registrationDate: new Date().toISOString(),
      status: "active",
    };

    // Save to localStorage (in real app, this would be saved to database)
    localStorage.setItem(`teacher_${regNumber}`, JSON.stringify(teacherRecord));

    toast({
      title: "تم إضافة المعلم بنجاح",
      description: `رقم التسجيل: ${regNumber}`,
    });

    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          إضافة معلم جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle>إضافة معلم جديد</DialogTitle>
          <DialogDescription>
            أدخل بيانات المعلم الجديد لإضافته إلى النظام
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم الكامل</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل الاسم الكامل" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input placeholder="teacher@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الهاتف</FormLabel>
                    <FormControl>
                      <Input placeholder="0551234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>التخصص</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر التخصص" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="quran">القرآن الكريم والتجويد</SelectItem>
                        <SelectItem value="arabic">اللغة العربية</SelectItem>
                        <SelectItem value="english">اللغة الإنجليزية</SelectItem>
                        <SelectItem value="math">الرياضيات</SelectItem>
                        <SelectItem value="science">العلوم</SelectItem>
                        <SelectItem value="art">الفنون والإبداع</SelectItem>
                        <SelectItem value="islamic">التربية الإسلامية</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>سنوات الخبرة</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر سنوات الخبرة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">سنة واحدة</SelectItem>
                        <SelectItem value="2-3">2-3 سنوات</SelectItem>
                        <SelectItem value="4-5">4-5 سنوات</SelectItem>
                        <SelectItem value="6-10">6-10 سنوات</SelectItem>
                        <SelectItem value="10+">أكثر من 10 سنوات</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المؤهل العلمي</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المؤهل العلمي" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="high-school">ثانوية عامة</SelectItem>
                        <SelectItem value="diploma">دبلوم</SelectItem>
                        <SelectItem value="bachelor">بكالوريوس</SelectItem>
                        <SelectItem value="master">ماجستير</SelectItem>
                        <SelectItem value="phd">دكتوراه</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العنوان</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل العنوان الكامل" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الراتب (د.ج)</FormLabel>
                    <FormControl>
                      <Input placeholder="مثال: 50000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ملاحظات (اختياري)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="أي ملاحظات إضافية..."
                      className="min-h-20"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit">
                إضافة المعلم
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}