import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";

interface WeeklyScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classrooms: Array<{
    id: string;
    name: string;
    course: string;
    teacher: string;
    schedule: {
      days: string[];
      time: string;
      duration: string;
    };
    location: string;
    status: string;
  }>;
}

const DAYS_ORDER = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];

export const WeeklyScheduleDialog = ({ open, onOpenChange, classrooms }: WeeklyScheduleDialogProps) => {
  const getScheduleByDay = () => {
    const scheduleByDay: Record<string, any[]> = {};
    
    DAYS_ORDER.forEach(day => {
      scheduleByDay[day] = [];
    });

    classrooms.forEach(classroom => {
      if (classroom.status === "active") {
        classroom.schedule.days.forEach(day => {
          if (scheduleByDay[day]) {
            scheduleByDay[day].push({
              ...classroom,
              timeSlot: classroom.schedule.time
            });
          }
        });
      }
    });

    // Sort each day's classes by time
    Object.keys(scheduleByDay).forEach(day => {
      scheduleByDay[day].sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));
    });

    return scheduleByDay;
  };

  const scheduleByDay = getScheduleByDay();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">الجدول الأسبوعي للفصول</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {DAYS_ORDER.map(day => (
            <Card key={day} className="h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-center">{day}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {scheduleByDay[day].length > 0 ? (
                  scheduleByDay[day].map((classItem, index) => (
                    <div key={`${classItem.id}-${index}`} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-sm">{classItem.timeSlot}</span>
                      </div>
                      
                      <h4 className="font-medium text-sm leading-tight">{classItem.name}</h4>
                      
                      <Badge variant="secondary" className="text-xs">
                        {classItem.course}
                      </Badge>
                      
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>المعلم: {classItem.teacher}</div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{classItem.location}</span>
                        </div>
                        <div>المدة: {classItem.schedule.duration}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    لا توجد فصول في هذا اليوم
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};