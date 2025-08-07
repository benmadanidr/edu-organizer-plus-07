import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { School, Search, Plus, Users, Calendar, Clock, MapPin } from "lucide-react";
import { WeeklyScheduleDialog } from "@/components/admin/WeeklyScheduleDialog";
import { CreateClassroomDialog } from "@/components/admin/CreateClassroomDialog";
import { ClassroomDetailsDialog } from "@/components/admin/ClassroomDetailsDialog";
import { EditClassroomDialog } from "@/components/admin/EditClassroomDialog";

interface Classroom {
  id: string;
  name: string;
  course: string;
  teacher: string;
  capacity: number;
  enrolled: number;
  schedule: {
    days: string[];
    time: string;
    duration: string;
  };
  location: string;
  status: "active" | "inactive" | "full" | "upcoming";
  startDate: string;
  endDate: string;
}

const AdminClassrooms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [classrooms] = useState<Classroom[]>([
    {
      id: "1",
      name: "فصل القرآن الكريم - المستوى الأول",
      course: "القرآن الكريم",
      teacher: "الشيخ أحمد محمد",
      capacity: 20,
      enrolled: 18,
      schedule: {
        days: ["الأحد", "الثلاثاء", "الخميس"],
        time: "16:00",
        duration: "ساعتان",
      },
      location: "القاعة الأولى",
      status: "active",
      startDate: "2024-01-15",
      endDate: "2024-06-15",
    },
    {
      id: "2",
      name: "دورة اللغة الإنجليزية المتقدمة",
      course: "اللغة الإنجليزية",
      teacher: "الأستاذة فاطمة علي",
      capacity: 15,
      enrolled: 15,
      schedule: {
        days: ["السبت", "الاثنين", "الأربعاء"],
        time: "18:00",
        duration: "ساعة ونصف",
      },
      location: "القاعة الثانية",
      status: "full",
      startDate: "2024-01-10",
      endDate: "2024-05-10",
    },
    {
      id: "3",
      name: "فصل الرياضيات للمرحلة الثانوية",
      course: "الرياضيات",
      teacher: "الأستاذ خالد أحمد",
      capacity: 25,
      enrolled: 12,
      schedule: {
        days: ["الأحد", "الثلاثاء"],
        time: "17:00",
        duration: "ساعتان",
      },
      location: "القاعة الثالثة",
      status: "active",
      startDate: "2024-01-20",
      endDate: "2024-07-20",
    },
    {
      id: "4",
      name: "دورة الحاسوب للمبتدئين",
      course: "الحاسوب",
      teacher: "الأستاذ عبدالرحمن سالم",
      capacity: 12,
      enrolled: 0,
      schedule: {
        days: ["الخميس", "الجمعة"],
        time: "19:00",
        duration: "ساعتان",
      },
      location: "مختبر الحاسوب",
      status: "upcoming",
      startDate: "2024-02-01",
      endDate: "2024-04-01",
    },
  ]);

  const filteredClassrooms = classrooms.filter(classroom =>
    classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classroom.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classroom.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classroom.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">نشط</Badge>;
      case "inactive":
        return <Badge variant="secondary">غير نشط</Badge>;
      case "full":
        return <Badge variant="destructive">مكتمل</Badge>;
      case "upcoming":
        return <Badge variant="outline">قادم</Badge>;
      default:
        return <Badge variant="outline">غير محدد</Badge>;
    }
  };

  const activeClassrooms = classrooms.filter(c => c.status === "active").length;
  const totalStudents = classrooms.reduce((sum, c) => sum + c.enrolled, 0);
  const averageCapacity = classrooms.length > 0 ? 
    Math.round((classrooms.reduce((sum, c) => sum + c.enrolled, 0) / classrooms.reduce((sum, c) => sum + c.capacity, 0)) * 100) : 0;

  const handleShowSchedule = () => {
    setShowScheduleDialog(true);
  };

  const handleCreateClassroom = () => {
    setShowCreateDialog(true);
  };

  const handleViewDetails = (classroomId: string) => {
    const classroom = classrooms.find(c => c.id === classroomId);
    if (classroom) {
      setSelectedClassroom(classroom);
      setShowDetailsDialog(true);
    }
  };

  const handleEditClassroom = (classroomId: string) => {
    const classroom = classrooms.find(c => c.id === classroomId);
    if (classroom) {
      setSelectedClassroom(classroom);
      setShowEditDialog(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <School className="w-8 h-8 text-primary" />
            إدارة الفصول الدراسية
          </h1>
          <p className="text-muted-foreground">إدارة الفصول والجداول الدراسية</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleShowSchedule()}>
            <Calendar className="w-4 h-4 mr-2" />
            الجدول الأسبوعي
          </Button>
          <Button onClick={() => handleCreateClassroom()}>
            <Plus className="w-4 h-4 mr-2" />
            إنشاء فصل جديد
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/90">الفصول النشطة</p>
                <h3 className="text-3xl font-bold">{activeClassrooms}</h3>
              </div>
              <School className="w-12 h-12 text-primary-foreground/70" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-education-green to-education-green/80 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90">إجمالي الطلاب</p>
                <h3 className="text-3xl font-bold">{totalStudents}</h3>
              </div>
              <Users className="w-12 h-12 text-white/70" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-education-orange to-education-orange/80 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90">معدل الإشغال</p>
                <h3 className="text-3xl font-bold">{averageCapacity}%</h3>
              </div>
              <Badge className="bg-white/20 text-white">
                {classrooms.length} فصل
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="البحث في الفصول الدراسية..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Classrooms Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">جميع الفصول</TabsTrigger>
          <TabsTrigger value="active">النشطة</TabsTrigger>
          <TabsTrigger value="full">المكتملة</TabsTrigger>
          <TabsTrigger value="upcoming">القادمة</TabsTrigger>
          <TabsTrigger value="inactive">غير النشطة</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredClassrooms.map((classroom) => (
              <Card key={classroom.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg mb-2">{classroom.name}</CardTitle>
                      <Badge variant="secondary" className="mb-2">{classroom.course}</Badge>
                    </div>
                    {getStatusBadge(classroom.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>المعلم: {classroom.teacher}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>المكان: {classroom.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>الأيام: {classroom.schedule.days.join("، ")}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>الوقت: {classroom.schedule.time} ({classroom.schedule.duration})</span>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">عدد الطلاب</span>
                      <span className="font-semibold">{classroom.enrolled}/{classroom.capacity}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all" 
                        style={{ width: `${(classroom.enrolled / classroom.capacity) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-muted-foreground pt-2">
                    <span>البداية: {new Date(classroom.startDate).toLocaleDateString('ar-SA')}</span>
                    <span>النهاية: {new Date(classroom.endDate).toLocaleDateString('ar-SA')}</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => handleViewDetails(classroom.id)}>
                      عرض التفاصيل
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => handleEditClassroom(classroom.id)}>
                      تعديل
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {["active", "full", "upcoming", "inactive"].map((status) => (
          <TabsContent key={status} value={status}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredClassrooms.filter(classroom => classroom.status === status).map((classroom) => (
                <Card key={classroom.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg mb-2">{classroom.name}</CardTitle>
                        <Badge variant="secondary" className="mb-2">{classroom.course}</Badge>
                      </div>
                      {getStatusBadge(classroom.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>المعلم: {classroom.teacher}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>المكان: {classroom.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>الأيام: {classroom.schedule.days.join("، ")}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>الوقت: {classroom.schedule.time} ({classroom.schedule.duration})</span>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">عدد الطلاب</span>
                        <span className="font-semibold">{classroom.enrolled}/{classroom.capacity}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all" 
                          style={{ width: `${(classroom.enrolled / classroom.capacity) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground pt-2">
                      <span>البداية: {new Date(classroom.startDate).toLocaleDateString('ar-SA')}</span>
                      <span>النهاية: {new Date(classroom.endDate).toLocaleDateString('ar-SA')}</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => handleViewDetails(classroom.id)}>
                        عرض التفاصيل
                      </Button>
                      <Button size="sm" className="flex-1" onClick={() => handleEditClassroom(classroom.id)}>
                        تعديل
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Dialogs */}
      <WeeklyScheduleDialog 
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
        classrooms={classrooms}
      />
      
      <CreateClassroomDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
      
      <ClassroomDetailsDialog 
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        classroom={selectedClassroom}
      />
      
      <EditClassroomDialog 
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        classroom={selectedClassroom}
      />
    </div>
  );
};

export default AdminClassrooms;