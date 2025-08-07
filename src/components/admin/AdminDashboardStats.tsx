import { Card, CardContent } from "@/components/ui/card";
import { Users, GraduationCap, UserCheck, DollarSign } from "lucide-react";
import { formatNumber } from "@/lib/localization";

interface AdminDashboardStatsProps {
  studentsCount: number;
  teachersCount: number;
}

export function AdminDashboardStats({ studentsCount, teachersCount }: AdminDashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
      <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground overflow-hidden">
        <CardContent className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <GraduationCap className="w-10 h-10 lg:w-12 lg:h-12 text-primary-foreground/70 shrink-0 ml-2" />
            <div className="min-w-0 flex-1 text-right">
              <p className="text-primary-foreground/90 text-sm lg:text-base truncate">إجمالي الطلاب</p>
              <h3 className="text-2xl lg:text-3xl font-bold mt-1">{formatNumber(studentsCount)}</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-education-green to-education-green/80 text-white overflow-hidden">
        <CardContent className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <Users className="w-10 h-10 lg:w-12 lg:h-12 text-white/70 shrink-0 ml-2" />
            <div className="min-w-0 flex-1 text-right">
              <p className="text-white/90 text-sm lg:text-base truncate">إجمالي المعلمين</p>
              <h3 className="text-2xl lg:text-3xl font-bold mt-1">{formatNumber(teachersCount)}</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-education-orange to-education-orange/80 text-white overflow-hidden">
        <CardContent className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <UserCheck className="w-10 h-10 lg:w-12 lg:h-12 text-white/70 shrink-0 ml-2" />
            <div className="min-w-0 flex-1 text-right">
              <p className="text-white/90 text-sm lg:text-base truncate">إجمالي التسجيلات</p>
              <h3 className="text-2xl lg:text-3xl font-bold mt-1">{formatNumber(studentsCount + teachersCount)}</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-education-blue to-education-blue/80 text-white overflow-hidden">
        <CardContent className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <DollarSign className="w-10 h-10 lg:w-12 lg:h-12 text-white/70 shrink-0 ml-2" />
            <div className="min-w-0 flex-1 text-right">
              <p className="text-white/90 text-sm lg:text-base truncate">المعاملات المالية</p>
              <h3 className="text-2xl lg:text-3xl font-bold mt-1">{formatNumber(48)}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}