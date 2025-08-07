import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Palette, Home, BookOpen, Users, Plus, Edit, Trash2, Save, Upload, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  level: string;
  price: string;
}

interface HomePageContent {
  instituteName: string;
  instituteDescription: string;
  heroImage: string;
  logoImage: string;
  location: string;
  phone1: string;
  phone2: string;
  email1: string;
  email2: string;
  address1: string;
  address2: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

const AdminContentManagement = () => {
  const [activeTab, setActiveTab] = useState("homepage");
  const [courses, setCourses] = useState<Course[]>([]);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [homeContent, setHomeContent] = useState<HomePageContent>({
    instituteName: "أكاديميّة الإتقان التّعليميّة",
    instituteDescription: "منصة متكاملة لإدارة التسجيل والمتابعة الأكاديمية",
    heroImage: "/assets/hero-education.jpg",
    logoImage: "/lovable-uploads/a726782c-7292-4f1a-b1e9-b11ef63f5896.png",
    location: "بدار الشيّوخ - الجلفة",
    phone1: "+213 27 123 456",
    phone2: "+213 555 987 654",
    email1: "info@itqan-edu.dz",
    email2: "support@itqan-edu.dz",
    address1: "دار الشيوخ",
    address2: "ولاية الجلفة، الجزائر",
    primaryColor: "#2563eb",
    secondaryColor: "#10b981",
    accentColor: "#f59e0b"
  });

  const [newCourse, setNewCourse] = useState<Omit<Course, 'id'>>({
    title: "",
    description: "",
    image: "",
    duration: "",
    level: "",
    price: ""
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = () => {
    // تحميل محتوى الصفحة الرئيسية
    const savedHomeContent = localStorage.getItem('homePageContent');
    if (savedHomeContent) {
      setHomeContent(JSON.parse(savedHomeContent));
    }

    // تحميل الدورات
    const savedCourses = localStorage.getItem('courses');
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    } else {
      // الدورات الافتراضية
      const defaultCourses: Course[] = [
        {
          id: '1',
          title: "دورة الفنون والإبداع",
          description: "تعلم أساسيات الفن والرسم والتصميم الإبداعي مع نخبة من المدربين المتخصصين في الأكاديمية",
          image: "/assets/course-art.jpg",
          duration: "12 أسبوع",
          level: "مبتدئ",
          price: "15.000"
        },
        {
          id: '2',
          title: "دورة اللغات الأجنبية",
          description: "احترف اللغات الأجنبية مع برامج تعليمية تفاعلية ومدربين معتمدين دولياً",
          image: "/assets/course-language.jpg",
          duration: "16 أسبوع",
          level: "متوسط",
          price: "18.000"
        },
        {
          id: '3',
          title: "دورة العلوم والتكنولوجيا",
          description: "استكشف عالم العلوم الحديثة والتكنولوجيا مع تطبيقات عملية مبتكرة ومشاريع متقدمة",
          image: "/assets/course-science.jpg",
          duration: "20 أسبوع",
          level: "متقدم",
          price: "22.000"
        }
      ];
      setCourses(defaultCourses);
    }
  };

  const saveHomeContent = () => {
    localStorage.setItem('homePageContent', JSON.stringify(homeContent));
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ محتوى الصفحة الرئيسية"
    });
  };

  const saveCourses = () => {
    localStorage.setItem('courses', JSON.stringify(courses));
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ الدورات. سيتم تحديث الصفحة الرئيسية تلقائياً."
    });
  };

  const addCourse = () => {
    if (!newCourse.title || !newCourse.description) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const course: Course = {
      ...newCourse,
      id: Date.now().toString()
    };

    const updatedCourses = [...courses, course];
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    setNewCourse({
      title: "",
      description: "",
      image: "",
      duration: "",
      level: "",
      price: ""
    });
    setIsDialogOpen(false);
    toast({
      title: "تمت الإضافة بنجاح",
      description: "تم إضافة الدورة الجديدة وتحديث الصفحة الرئيسية"
    });
  };

  const editCourse = (course: Course) => {
    setEditingCourse(course);
    setNewCourse(course);
    setIsDialogOpen(true);
  };

  const updateCourse = () => {
    if (!editingCourse) return;

    const updatedCourses = courses.map(course =>
      course.id === editingCourse.id ? { ...newCourse, id: editingCourse.id } : course
    );

    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    setEditingCourse(null);
    setNewCourse({
      title: "",
      description: "",
      image: "",
      duration: "",
      level: "",
      price: ""
    });
    setIsDialogOpen(false);
    toast({
      title: "تم التحديث بنجاح",
      description: "تم تحديث الدورة وتحديث الصفحة الرئيسية"
    });
  };

  const deleteCourse = (courseId: string) => {
    const updatedCourses = courses.filter(course => course.id !== courseId);
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    toast({
      title: "تم الحذف بنجاح",
      description: "تم حذف الدورة وتحديث الصفحة الرئيسية"
    });
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingCourse(null);
    setNewCourse({
      title: "",
      description: "",
      image: "",
      duration: "",
      level: "",
      price: ""
    });
  };

  const previewColors = () => {
    // تطبيق الألوان مؤقتاً لمعاينة التأثير
    const root = document.documentElement;
    root.style.setProperty('--primary', homeContent.primaryColor);
    root.style.setProperty('--secondary', homeContent.secondaryColor);
    root.style.setProperty('--accent', homeContent.accentColor);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Palette className="w-8 h-8 text-primary" />
            إدارة المحتوى
          </h1>
          <p className="text-muted-foreground">إدارة محتوى الصفحة الرئيسية والدورات والألوان</p>
        </div>
        <Button onClick={() => window.open('/', '_blank')} variant="outline">
          <Eye className="w-4 h-4 ml-2" />
          معاينة الموقع
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="homepage">الصفحة الرئيسية</TabsTrigger>
          <TabsTrigger value="courses">الدورات</TabsTrigger>
          <TabsTrigger value="colors">الألوان والتصميم</TabsTrigger>
          <TabsTrigger value="contact">معلومات التواصل</TabsTrigger>
        </TabsList>

        <TabsContent value="homepage">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                محتوى الصفحة الرئيسية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="instituteName">اسم المؤسسة</Label>
                  <Input
                    id="instituteName"
                    value={homeContent.instituteName}
                    onChange={(e) => setHomeContent({...homeContent, instituteName: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">الموقع</Label>
                  <Input
                    id="location"
                    value={homeContent.location}
                    onChange={(e) => setHomeContent({...homeContent, location: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instituteDescription">وصف المؤسسة</Label>
                <Textarea
                  id="instituteDescription"
                  value={homeContent.instituteDescription}
                  onChange={(e) => setHomeContent({...homeContent, instituteDescription: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="logoImage">رابط الشعار</Label>
                  <Input
                    id="logoImage"
                    value={homeContent.logoImage}
                    onChange={(e) => setHomeContent({...homeContent, logoImage: e.target.value})}
                    placeholder="رابط صورة الشعار"
                  />
                  {homeContent.logoImage && (
                    <div className="mt-2">
                      <img 
                        src={homeContent.logoImage} 
                        alt="معاينة الشعار"
                        className="w-16 h-16 object-cover rounded border animate-float"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heroImage">رابط صورة الخلفية</Label>
                  <Input
                    id="heroImage"
                    value={homeContent.heroImage}
                    onChange={(e) => setHomeContent({...homeContent, heroImage: e.target.value})}
                    placeholder="رابط صورة الخلفية الرئيسية"
                  />
                  {homeContent.heroImage && (
                    <div className="mt-2">
                      <img 
                        src={homeContent.heroImage} 
                        alt="معاينة صورة الخلفية"
                        className="w-32 h-20 object-cover rounded border hover-scale"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-start">
                <Button onClick={saveHomeContent}>
                  <Save className="w-4 h-4 ml-2" />
                  حفظ التغييرات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    إدارة الدورات
                  </CardTitle>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingCourse(null)}>
                        <Plus className="w-4 h-4 ml-2" />
                        إضافة دورة جديدة
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingCourse ? "تعديل الدورة" : "إضافة دورة جديدة"}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="courseTitle">عنوان الدورة</Label>
                            <Input
                              id="courseTitle"
                              value={newCourse.title}
                              onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                              placeholder="عنوان الدورة"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="courseDuration">مدة الدورة</Label>
                            <Input
                              id="courseDuration"
                              value={newCourse.duration}
                              onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                              placeholder="مثال: 12 أسبوع"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="courseLevel">مستوى الدورة</Label>
                            <Input
                              id="courseLevel"
                              value={newCourse.level}
                              onChange={(e) => setNewCourse({...newCourse, level: e.target.value})}
                              placeholder="مثال: مبتدئ، متوسط، متقدم"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="coursePrice">سعر الدورة</Label>
                            <Input
                              id="coursePrice"
                              value={newCourse.price}
                              onChange={(e) => setNewCourse({...newCourse, price: e.target.value})}
                              placeholder="مثال: 15.000"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="courseDescription">وصف الدورة</Label>
                          <Textarea
                            id="courseDescription"
                            value={newCourse.description}
                            onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                            placeholder="وصف مفصل للدورة"
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="courseImage">رابط صورة الدورة</Label>
                          <Input
                            id="courseImage"
                            value={newCourse.image}
                            onChange={(e) => setNewCourse({...newCourse, image: e.target.value})}
                            placeholder="رابط صورة الدورة"
                          />
                        </div>

                          <div className="flex justify-start gap-2">
                            <Button onClick={editingCourse ? updateCourse : addCourse}>
                              {editingCourse ? "تحديث" : "إضافة"}
                            </Button>
                            <Button variant="outline" onClick={handleDialogClose}>
                              إلغاء
                            </Button>
                          </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <Card key={course.id} className="overflow-hidden">
                      <div className="aspect-video bg-muted relative">
                        {course.image ? (
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Upload className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{course.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {course.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          <Badge variant="secondary" className="text-xs">
                            {course.duration}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {course.level}
                          </Badge>
                          {course.price && (
                            <Badge className="text-xs">
                              {course.price} دج
                            </Badge>
                          )}
                        </div>
                        <div className="flex justify-start gap-2 flex-row-reverse">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteCourse(course.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => editCourse(course)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-start mt-6">
                  <Button onClick={saveCourses}>
                    <Save className="w-4 h-4 ml-2" />
                    حفظ الدورات
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="colors">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                إعدادات الألوان والتصميم
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">اللون الأساسي</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={homeContent.primaryColor}
                      onChange={(e) => setHomeContent({...homeContent, primaryColor: e.target.value})}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={homeContent.primaryColor}
                      onChange={(e) => setHomeContent({...homeContent, primaryColor: e.target.value})}
                      placeholder="#2563eb"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">اللون الثانوي</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={homeContent.secondaryColor}
                      onChange={(e) => setHomeContent({...homeContent, secondaryColor: e.target.value})}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={homeContent.secondaryColor}
                      onChange={(e) => setHomeContent({...homeContent, secondaryColor: e.target.value})}
                      placeholder="#10b981"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor">لون التمييز</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={homeContent.accentColor}
                      onChange={(e) => setHomeContent({...homeContent, accentColor: e.target.value})}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={homeContent.accentColor}
                      onChange={(e) => setHomeContent({...homeContent, accentColor: e.target.value})}
                      placeholder="#f59e0b"
                    />
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-muted/20">
                <h3 className="font-semibold mb-4">معاينة الألوان</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div 
                    className="h-16 rounded-lg flex items-center justify-center text-white font-medium"
                    style={{ backgroundColor: homeContent.primaryColor }}
                  >
                    اللون الأساسي
                  </div>
                  <div 
                    className="h-16 rounded-lg flex items-center justify-center text-white font-medium"
                    style={{ backgroundColor: homeContent.secondaryColor }}
                  >
                    اللون الثانوي
                  </div>
                  <div 
                    className="h-16 rounded-lg flex items-center justify-center text-white font-medium"
                    style={{ backgroundColor: homeContent.accentColor }}
                  >
                    لون التمييز
                  </div>
                </div>
              </div>

              <div className="flex justify-between flex-row-reverse">
                <Button variant="outline" onClick={previewColors}>
                  <Eye className="w-4 h-4 ml-2" />
                  معاينة الألوان
                </Button>
                <Button onClick={saveHomeContent}>
                  <Save className="w-4 h-4 ml-2" />
                  حفظ الألوان
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                معلومات التواصل
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone1">رقم الهاتف الأول</Label>
                  <Input
                    id="phone1"
                    value={homeContent.phone1}
                    onChange={(e) => setHomeContent({...homeContent, phone1: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone2">رقم الهاتف الثاني</Label>
                  <Input
                    id="phone2"
                    value={homeContent.phone2}
                    onChange={(e) => setHomeContent({...homeContent, phone2: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email1">البريد الإلكتروني الأول</Label>
                  <Input
                    id="email1"
                    type="email"
                    value={homeContent.email1}
                    onChange={(e) => setHomeContent({...homeContent, email1: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email2">البريد الإلكتروني الثاني</Label>
                  <Input
                    id="email2"
                    type="email"
                    value={homeContent.email2}
                    onChange={(e) => setHomeContent({...homeContent, email2: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address1">العنوان الأول</Label>
                  <Input
                    id="address1"
                    value={homeContent.address1}
                    onChange={(e) => setHomeContent({...homeContent, address1: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address2">العنوان الثاني</Label>
                  <Input
                    id="address2"
                    value={homeContent.address2}
                    onChange={(e) => setHomeContent({...homeContent, address2: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-start">
                <Button onClick={saveHomeContent}>
                  <Save className="w-4 h-4 ml-2" />
                  حفظ معلومات التواصل
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminContentManagement;