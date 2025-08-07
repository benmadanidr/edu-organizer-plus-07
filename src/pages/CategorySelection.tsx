import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, Languages, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

const CategorySelection = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: "quran",
      title: "تعليم القرآن الكريم",
      description: "تحفيظ وتجويد القرآن الكريم مع علوم التفسير",
      icon: BookOpen,
      color: "from-emerald-500 to-emerald-600",
      route: "/register/quran"
    },
    {
      id: "academic",
      title: "التعليم الأكاديمي",
      description: "مناهج تعليمية شاملة في جميع المراحل الدراسية",
      icon: GraduationCap,
      color: "from-blue-500 to-blue-600",
      route: "/register/academic"
    },
    {
      id: "languages",
      title: "دورات تعليم اللغات",
      description: "تعلم اللغات المختلفة مع مدربين متخصصين",
      icon: Languages,
      color: "from-purple-500 to-purple-600",
      route: "/register/languages"
    }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-4">اختر صنف التسجيل</h1>
              <p className="text-muted-foreground text-lg">
                يرجى اختيار الصنف المناسب لبدء عملية التسجيل
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Card
                    key={category.id}
                    className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 hover:border-primary/50"
                    onClick={() => navigate(category.route)}
                  >
                    <CardHeader className="text-center">
                      <div className={`mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl text-foreground">
                        {category.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-center text-sm leading-relaxed">
                        {category.description}
                      </p>
                      <Button 
                        className="w-full mt-4 group-hover:bg-primary/90 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(category.route);
                        }}
                      >
                        تسجيل جديد
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => navigate("/")}
                className="flex items-center gap-2 mx-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                العودة للرئيسية
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategorySelection;