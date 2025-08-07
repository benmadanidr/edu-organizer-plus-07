import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: {
    students: boolean;
    teachers: boolean;
    financial: boolean;
    settings: boolean;
    classrooms: boolean;
    attendance: boolean;
  };
}

// Mock admin users data
const adminUsers: Record<string, { password: string; user: AdminUser }> = {
  "admin@example.com": {
    password: "admin123",
    user: {
      id: "1",
      name: "أحمد محمد",
      email: "admin@example.com",
      role: "مدير عام",
      permissions: {
        students: true,
        teachers: true,
        financial: true,
        settings: true,
        classrooms: true,
        attendance: true,
      },
    },
  },
  "manager@example.com": {
    password: "manager123",
    user: {
      id: "2",
      name: "فاطمة علي",
      email: "manager@example.com",
      role: "مدير أكاديمي",
      permissions: {
        students: true,
        teachers: true,
        financial: false,
        settings: false,
        classrooms: true,
        attendance: true,
      },
    },
  },
};

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAdminAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const adminData = adminUsers[email];
      
      if (adminData && adminData.password === password) {
        // Use the login function from AdminAuthProvider
        login(adminData.user);
        
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: `مرحباً ${adminData.user.name}`,
        });
        
        // Navigate immediately since state is updated synchronously
        navigate("/admin/", { replace: true });
        
      } else {
        toast({
          variant: "destructive",
          title: "خطأ في تسجيل الدخول",
          description: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ في النظام",
        description: "حدث خطأ أثناء تسجيل الدخول، حاول مرة أخرى",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">تسجيل دخول الإدارة</CardTitle>
          <p className="text-muted-foreground">
            أدخل بياناتك للوصول إلى لوحة التحكم
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                dir="ltr"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  dir="ltr"
                  className="pl-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute left-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium mb-2">بيانات تجريبية:</p>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p><strong>مدير عام:</strong> admin@example.com / admin123</p>
              <p><strong>مدير أكاديمي:</strong> manager@example.com / manager123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;