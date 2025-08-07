import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="bg-card shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/a726782c-7292-4f1a-b1e9-b11ef63f5896.png" 
              alt="شعار أكاديمية الإتقان"
              className="w-10 h-10"
            />
            <div>
              <h1 className="text-lg font-bold text-foreground">أكاديميّة الإتقان التّعليميّة</h1>
              <p className="text-xs text-muted-foreground">بدار الشيّوخ - الجلفة</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                الرئيسية
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;