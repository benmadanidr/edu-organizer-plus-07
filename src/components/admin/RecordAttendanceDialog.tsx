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
  studentName: z.string().min(2, "اسم الطالب مطلوب"),
  course: z.string().min(1, "الدورة مطلوبة"),
  date: z.string().min(1, "التاريخ مطلوب"),
  status: z.enum(["present", "absent", "late", "excused"], {
    required_error: "حالة الحضور مطلوبة",
  }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface RecordAttendanceDialogProps {
  trigger?: React.ReactNode;
}

export function RecordAttendanceDialog({ trigger }: RecordAttendanceDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: "",
      course: "",
      date: new Date().toISOString().split('T')[0],
      notes: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    // Create attendance record
    const attendanceRecord = {
      id: Date.now().toString(),
      ...values,
      timestamp: new Date().toISOString(),
    };

    // In real app, this would be saved to database
    console.log("Attendance recorded:", attendanceRecord);

    const statusText = {
      present: "حاضر",
      absent: "غائب",
      late: "متأخر",
      excused: "غياب بعذر"
    }[values.status];

    toast({
      title: "تم تسجيل الحضور بنجاح",
      description: `تم تسجيل ${statusText} للطالب ${values.studentName}`,
    });

    form.reset();
    setOpen(false);
  };

  const defaultTrigger = (
    <Button>
      <Plus className="w-4 h-4 mr-2" />
      تسجيل حضور جديد
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-xl" dir="rtl">
        <DialogHeader>
          <DialogTitle>تسجيل حضور وغياب</DialogTitle>
          <DialogDescription>
            سجل حضور أو غياب الطالب في الدورة المحددة
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="studentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم الطالب</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل اسم الطالب" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الدورة</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الدورة" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="quran">دورة القرآن الكريم</SelectItem>
                      <SelectItem value="arabic">دورة اللغة العربية</SelectItem>
                      <SelectItem value="english">دورة اللغة الإنجليزية</SelectItem>
                      <SelectItem value="math">دورة الرياضيات</SelectItem>
                      <SelectItem value="science">دورة العلوم</SelectItem>
                      <SelectItem value="art">دورة الفنون والإبداع</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>التاريخ</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>حالة الحضور</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر حالة الحضور" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="present">حاضر</SelectItem>
                        <SelectItem value="absent">غائب</SelectItem>
                        <SelectItem value="late">متأخر</SelectItem>
                        <SelectItem value="excused">غياب بعذر</SelectItem>
                      </SelectContent>
                    </Select>
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
                تسجيل الحضور
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}