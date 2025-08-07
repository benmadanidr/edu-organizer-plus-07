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
  type: z.enum(["income", "expense"], {
    required_error: "نوع المعاملة مطلوب",
  }),
  description: z.string().min(5, "وصف المعاملة مطلوب"),
  amount: z.string().min(1, "المبلغ مطلوب"),
  category: z.string().min(1, "الفئة مطلوبة"),
  studentName: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddTransactionDialogProps {
  trigger?: React.ReactNode;
}

export function AddTransactionDialog({ trigger }: AddTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: "",
      category: "",
      studentName: "",
      notes: "",
    },
  });

  const watchType = form.watch("type");

  const onSubmit = (values: FormValues) => {
    // Create transaction record
    const transactionRecord = {
      id: Date.now().toString(),
      ...values,
      amount: parseFloat(values.amount),
      date: new Date().toISOString(),
      status: "completed",
    };

    // In real app, this would be saved to database
    console.log("Transaction created:", transactionRecord);

    toast({
      title: "تم إضافة المعاملة بنجاح",
      description: `تم تسجيل ${values.type === 'income' ? 'الإيراد' : 'المصروف'} بمبلغ ${values.amount} د.ج`,
    });

    form.reset();
    setOpen(false);
  };

  const defaultTrigger = (
    <Button>
      <Plus className="w-4 h-4 mr-2" />
      إضافة معاملة جديدة
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle>إضافة معاملة مالية جديدة</DialogTitle>
          <DialogDescription>
            أدخل تفاصيل المعاملة المالية لإضافتها إلى النظام
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع المعاملة</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع المعاملة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="income">إيراد</SelectItem>
                        <SelectItem value="expense">مصروف</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المبلغ (د.ج)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="مثال: 15000" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>وصف المعاملة</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل وصف المعاملة" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الفئة</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الفئة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {watchType === "income" ? (
                          <>
                            <SelectItem value="رسوم دراسية">رسوم دراسية</SelectItem>
                            <SelectItem value="رسوم تسجيل">رسوم تسجيل</SelectItem>
                            <SelectItem value="رسوم إضافية">رسوم إضافية</SelectItem>
                            <SelectItem value="منح وتبرعات">منح وتبرعات</SelectItem>
                            <SelectItem value="أخرى">أخرى</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="رواتب">رواتب</SelectItem>
                            <SelectItem value="مصاريف تشغيلية">مصاريف تشغيلية</SelectItem>
                            <SelectItem value="إيجار">إيجار</SelectItem>
                            <SelectItem value="مواد تعليمية">مواد تعليمية</SelectItem>
                            <SelectItem value="صيانة">صيانة</SelectItem>
                            <SelectItem value="أخرى">أخرى</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchType === "income" && (
                <FormField
                  control={form.control}
                  name="studentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم الطالب (اختياري)</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل اسم الطالب" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
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
                إضافة المعاملة
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}