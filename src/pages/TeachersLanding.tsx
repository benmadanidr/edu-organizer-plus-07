import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Star, BookOpen, Award, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";

const TeachersLanding = () => {
  const benefits = [
    {
      icon: <Award className="w-8 h-8 text-education-orange" />,
      title: "رواتب تنافسية",
      description: "نقدم رواتب مجزية تتناسب مع خبرتك ومؤهلاتك العلمية"
    },
    {
      icon: <BookOpen className="w-8 h-8 text-education-blue" />,
      title: "تطوير مهني",
      description: "فرص مستمرة للتطوير المهني والتدريب على أحدث المناهج"
    },
    {
      icon: <Users className="w-8 h-8 text-education-green" />,
      title: "بيئة عمل مميزة",
      description: "فريق عمل متعاون وبيئة تعليمية محفزة للإبداع والتميز"
    },
    {
      icon: <Star className="w-8 h-8 text-education-purple" />,
      title: "مرونة في العمل",
      description: "جداول مرنة تتيح لك تحقيق التوازن بين العمل والحياة الشخصية"
    }
  ];

  const requirements = [
    "مؤهل علمي مناسب (بكالوريوس كحد أدنى)",
    "خبرة في التدريس (مفضلة وليست شرطاً)",
    "شغف بالتعليم وتطوير الطلاب",
    "مهارات تواصل ممتازة",
    "القدرة على استخدام التكنولوجيا في التعليم"
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-education-green to-education-blue text-white py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Users className="w-20 h-20 mx-auto mb-6 opacity-90" />
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                انضم إلى فريق التدريس
              </h1>
              <p className="text-xl md:text-2xl mb-8 leading-relaxed opacity-90">
                كن جزءاً من رحلة تعليمية مميزة وساهم في بناء مستقبل أجيال واعدة
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/teacher-register">
                  <Button size="lg" className="bg-white text-education-green hover:bg-white/90 px-8 py-4 text-lg font-semibold shadow-xl">
                    <Users className="w-5 h-5 mr-2" />
                    تقديم طلب التدريس
                  </Button>
                </Link>
                
                <Link to="/verify-teacher">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    التحقق من الطلب
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                لماذا تختار التدريس معنا؟
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                نوفر لك بيئة عمل مثالية تساعدك على تحقيق أهدافك المهنية والشخصية
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      {benefit.icon}
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-foreground mb-4">
                  متطلبات التقديم
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  نحن نبحث عن معلمين متميزين يشاركوننا الشغف بالتعليم
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-2xl text-center">المتطلبات الأساسية</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {requirements.map((requirement, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-education-green mt-0.5 flex-shrink-0" />
                          <span className="text-foreground">{requirement}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-foreground">
                    المواد المطلوبة للتدريس
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "اللغة العربية",
                      "اللغة الإنجليزية", 
                      "الرياضيات",
                      "العلوم",
                      "الفيزياء",
                      "الكيمياء",
                      "الأحياء",
                      "التاريخ",
                      "الجغرافيا",
                      "الحاسوب",
                      "الفنون",
                      "الموسيقى"
                    ].map((subject, index) => (
                      <div key={index} className="bg-primary/10 text-primary px-3 py-2 rounded-lg text-sm font-medium text-center">
                        {subject}
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center pt-6">
                    <Link to="/teacher-register">
                      <Button size="lg" className="px-8 py-4 text-lg font-semibold">
                        ابدأ التقديم الآن
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                خطوات التقديم
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                عملية بسيطة ومباشرة للانضمام إلى فريقنا التعليمي المميز
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center shadow-lg">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground text-2xl font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-semibold mb-3">املأ الطلب</h3>
                  <p className="text-muted-foreground">
                    أكمل نموذج التقديم بمعلوماتك الشخصية والمهنية
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center shadow-lg">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-education-orange rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-semibold mb-3">المراجعة</h3>
                  <p className="text-muted-foreground">
                    سيقوم فريقنا بمراجعة طلبك خلال 3-5 أيام عمل
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center shadow-lg">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-education-green rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                    3
                  </div>
                  <h3 className="text-xl font-semibold mb-3">المقابلة</h3>
                  <p className="text-muted-foreground">
                    مقابلة شخصية للتعرف عليك أكثر ومناقشة الفرص المتاحة
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default TeachersLanding;