import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { GraduationCap, Users, BookOpen, Phone, Mail, MapPin } from "lucide-react";
import Navigation from "@/components/Navigation";
import CourseCard from "@/components/CourseCard";
import courseArt from "@/assets/course-art.jpg";
import courseLanguage from "@/assets/course-language.jpg";
import courseScience from "@/assets/course-science.jpg";
import heroEducation from "@/assets/hero-education.jpg";

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
}

const Index = () => {
  const [courses, setCourses] = useState<Course[]>([]);
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
    address2: "ولاية الجلفة، الجزائر"
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
          image: courseArt,
          duration: "12 أسبوع",
          level: "مبتدئ",
          price: "15.000"
        },
        {
          id: '2',
          title: "دورة اللغات الأجنبية",
          description: "احترف اللغات الأجنبية مع برامج تعليمية تفاعلية ومدربين معتمدين دولياً",
          image: courseLanguage,
          duration: "16 أسبوع",
          level: "متوسط",
          price: "18.000"
        },
        {
          id: '3',
          title: "دورة العلوم والتكنولوجيا",
          description: "استكشف عالم العلوم الحديثة والتكنولوجيا مع تطبيقات عملية مبتكرة ومشاريع متقدمة",
          image: courseScience,
          duration: "20 أسبوع",
          level: "متقدم",
          price: "22.000"
        }
      ];
      setCourses(defaultCourses);
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 hover:scale-105"
          style={{ backgroundImage: `url(${homeContent.heroImage})` }}
        >
          <div className="absolute inset-0 bg-animated-gradient opacity-70"></div>
        </div>
        <div className="container mx-auto text-center relative z-10">
          <div className="flex justify-center mb-8">
            <img 
              src={homeContent.logoImage} 
              alt="شعار أكاديمية الإتقان التعليمية"
              className="w-32 h-32 animate-float hover-glow rounded-full shadow-lg"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white animate-slide-in-left">
            {homeContent.instituteName}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-4 animate-slide-in-right">
            {homeContent.location}
          </p>
          <p className="text-lg md:text-xl text-white/80 mb-12 animate-fade-in animate-pulse-gentle">
            {homeContent.instituteDescription}
          </p>
        </div>
      </section>

      {/* Registration Options */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Student Registration Card */}
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <GraduationCap className="w-16 h-16 text-primary" />
                </div>
                <CardTitle className="text-2xl mb-4">تسجيل الطلاب</CardTitle>
                <CardDescription className="text-lg">
                  قم بتسجيل الطلاب الجدد في النظام وإدارة بياناتهم الأكاديمية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Link to="/register">
                    <Button size="lg" className="w-full">
                      تسجيل طالب جديد
                    </Button>
                  </Link>
                  <Link to="/verify">
                    <Button size="lg" variant="outline" className="w-full">
                      التحقق من تسجيل طالب
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Teacher Registration Card */}
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Users className="w-16 h-16 text-primary" />
                </div>
                <CardTitle className="text-2xl mb-4">تسجيل المعلمين</CardTitle>
                <CardDescription className="text-lg">
                  قم بتسجيل المعلمين الجدد وإدارة ملفاتهم الشخصية والأكاديمية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Link to="/teacher-register">
                    <Button size="lg" className="w-full">
                      تسجيل معلم جديد
                    </Button>
                  </Link>
                  <Link to="/verify-teacher">
                    <Button size="lg" variant="outline" className="w-full">
                      التحقق من تسجيل معلم
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">الدورات المقدمة</h2>
            <p className="text-lg text-muted-foreground">اكتشف مجموعتنا المتنوعة من الدورات التعليمية</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                title={course.title}
                description={course.description}
                image={course.image}
                duration={course.duration}
                level={course.level}
                price={course.price}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">مميزات النظام</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>إدارة سهلة</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  واجهة بسيطة وسهلة الاستخدام لإدارة جميع العمليات الأكاديمية
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>متابعة شاملة</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  متابعة دقيقة لجميع الطلاب والمعلمين وبياناتهم الأكاديمية
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <GraduationCap className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>تقارير مفصلة</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  إنشاء تقارير مفصلة وإحصائيات دقيقة لجميع العمليات
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">تواصل معنا</h2>
            <p className="text-lg text-muted-foreground">نحن هنا لمساعدتك والإجابة على جميع استفساراتك</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <Phone className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">الهاتف</h3>
                <p className="text-muted-foreground">{homeContent.phone1}</p>
                <p className="text-muted-foreground">{homeContent.phone2}</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <Mail className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">البريد الإلكتروني</h3>
                <p className="text-muted-foreground">{homeContent.email1}</p>
                <p className="text-muted-foreground">{homeContent.email2}</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <MapPin className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">العنوان</h3>
                <p className="text-muted-foreground">{homeContent.address1}</p>
                <p className="text-muted-foreground">{homeContent.address2}</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="hover-scale">
              تواصل معنا الآن
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
