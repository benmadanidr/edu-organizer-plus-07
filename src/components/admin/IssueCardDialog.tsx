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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  studentName: z.string().min(2, "اسم الطالب مطلوب"),
  studentId: z.string().min(1, "رقم الطالب مطلوب"),
  course: z.string().min(1, "الدورة مطلوبة"),
  initialBalance: z.string().min(1, "الرصيد الأولي مطلوب"),
  cardType: z.enum(["basic", "premium"], {
    required_error: "نوع البطاقة مطلوب",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface IssueCardDialogProps {
  trigger?: React.ReactNode;
}

export function IssueCardDialog({ trigger }: IssueCardDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: "",
      studentId: "",
      course: "",
      initialBalance: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    // Generate card number
    const cardNumber = `CARD${Date.now().toString().slice(-8)}`;
    
    // Create card record
    const cardRecord = {
      cardNumber,
      ...values,
      balance: parseFloat(values.initialBalance),
      status: "active",
      issueDate: new Date().toISOString(),
    };

    // In real app, this would be saved to database
    console.log("Card issued:", cardRecord);

    toast({
      title: "تم إصدار البطاقة بنجاح",
      description: `رقم البطاقة: ${cardNumber}`,
    });

    form.reset();
    setOpen(false);
  };

  const defaultTrigger = (
    <Button>
      <Plus className="w-4 h-4 mr-2" />
      إصدار بطاقة جديدة
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-xl" dir="rtl">
        <DialogHeader>
          <DialogTitle>إصدار بطاقة جديدة</DialogTitle>
          <DialogDescription>
            أدخل بيانات الطالب لإصدار بطاقة جديدة
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الطالب</FormLabel>
                    <FormControl>
                      <Input placeholder="مثال: STU123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                name="initialBalance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الرصيد الأولي (د.ج)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="مثال: 5000" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cardType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع البطاقة</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع البطاقة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="basic">عادية</SelectItem>
                        <SelectItem value="premium">مميزة</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit">
                إصدار البطاقة
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}