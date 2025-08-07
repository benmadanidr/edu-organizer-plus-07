import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Shield, Search, Plus, Users, Edit, Trash2, Eye, Lock, Key, Save, X, UserPlus, Settings, FileText, CreditCard, BookOpen, Calendar, Database, UserCheck } from "lucide-react";
import { AddUserDialog } from "@/components/admin/AddUserDialog";
import { useToast } from "@/hooks/use-toast";

interface UserPermission {
  id: string;
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  role: string;
  department: string;
  permissions: {
    // إدارة المستخدمين
    students: boolean;
    teachers: boolean;
    employees: boolean;
    admins: boolean;
    
    // العمليات المالية
    financial: boolean;
    transactions: boolean;
    reports: boolean;
    budgets: boolean;
    
    // الإعدادات والنظام
    settings: boolean;
    systemConfig: boolean;
    backups: boolean;
    logs: boolean;
    
    // إدارة الفصول والأكاديمية
    classrooms: boolean;
    attendance: boolean;
    schedules: boolean;
    exams: boolean;
    grades: boolean;
    
    // إدارة المحتوى
    content: boolean;
    announcements: boolean;
    events: boolean;
    documents: boolean;
    
    // البطاقات والهوية
    cards: boolean;
    cardDesign: boolean;
    cardPrint: boolean;
    
    // التقارير والإحصائيات
    analytics: boolean;
    dashboard: boolean;
    customReports: boolean;
  };
  restrictions: {
    maxUsers: number;
    departments: string[];
    timeAccess: {
      startTime: string;
      endTime: string;
      days: string[];
    };
    ipWhitelist: string[];
  };
  active: boolean;
  lastLogin: string;
  createdAt: string;
}

const AdminPermissions = () => {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [showPermissions, setShowPermissions] = useState(false);
  const [editingUser, setEditingUser] = useState<UserPermission | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [users, setUsers] = useState<UserPermission[]>([
    {
      id: "1",
      name: "أحمد محمد",
      email: "ahmed@example.com",
      phone: "0123456789",
      username: "ahmed.admin",
      password: "Admin@123",
      role: "مدير عام",
      department: "الإدارة العليا",
      permissions: {
        students: true,
        teachers: true,
        employees: true,
        admins: true,
        financial: true,
        transactions: true,
        reports: true,
        budgets: true,
        settings: true,
        systemConfig: true,
        backups: true,
        logs: true,
        classrooms: true,
        attendance: true,
        schedules: true,
        exams: true,
        grades: true,
        content: true,
        announcements: true,
        events: true,
        documents: true,
        cards: true,
        cardDesign: true,
        cardPrint: true,
        analytics: true,
        dashboard: true,
        customReports: true,
      },
      restrictions: {
        maxUsers: 1000,
        departments: ["جميع الأقسام"],
        timeAccess: {
          startTime: "00:00",
          endTime: "23:59",
          days: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]
        },
        ipWhitelist: []
      },
      active: true,
      lastLogin: "2024-01-15 09:30",
      createdAt: "2024-01-01"
    },
    {
      id: "2",
      name: "فاطمة علي",
      email: "fatima@example.com",
      phone: "0987654321",
      username: "fatima.academic",
      password: "Academic@456",
      role: "مدير أكاديمي",
      department: "الشؤون الأكاديمية",
      permissions: {
        students: true,
        teachers: true,
        employees: false,
        admins: false,
        financial: false,
        transactions: false,
        reports: true,
        budgets: false,
        settings: false,
        systemConfig: false,
        backups: false,
        logs: false,
        classrooms: true,
        attendance: true,
        schedules: true,
        exams: true,
        grades: true,
        content: true,
        announcements: true,
        events: true,
        documents: true,
        cards: true,
        cardDesign: false,
        cardPrint: true,
        analytics: true,
        dashboard: true,
        customReports: false,
      },
      restrictions: {
        maxUsers: 500,
        departments: ["الشؤون الأكاديمية", "التعليم"],
        timeAccess: {
          startTime: "07:00",
          endTime: "17:00",
          days: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"]
        },
        ipWhitelist: []
      },
      active: true,
      lastLogin: "2024-01-14 14:20",
      createdAt: "2024-01-02"
    },
    {
      id: "3",
      name: "محمد حسن",
      email: "mohamed@example.com",
      phone: "0555666777",
      username: "mohamed.finance",
      password: "Finance@789",
      role: "مسؤول مالي",
      department: "الشؤون المالية",
      permissions: {
        students: false,
        teachers: false,
        employees: false,
        admins: false,
        financial: true,
        transactions: true,
        reports: true,
        budgets: true,
        settings: false,
        systemConfig: false,
        backups: false,
        logs: false,
        classrooms: false,
        attendance: false,
        schedules: false,
        exams: false,
        grades: false,
        content: false,
        announcements: false,
        events: false,
        documents: true,
        cards: false,
        cardDesign: false,
        cardPrint: false,
        analytics: true,
        dashboard: true,
        customReports: true,
      },
      restrictions: {
        maxUsers: 100,
        departments: ["الشؤون المالية"],
        timeAccess: {
          startTime: "08:00",
          endTime: "16:00",
          days: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"]
        },
        ipWhitelist: ["192.168.1.100", "192.168.1.101"]
      },
      active: true,
      lastLogin: "2024-01-13 11:45",
      createdAt: "2024-01-03"
    }
  ]);

  const roles = [
    "مدير عام",
    "مدير أكاديمي", 
    "مسؤول مالي",
    "مسؤول فني",
    "سكرتير",
    "محاسب",
    "مراقب جودة",
    "مشرف"
  ];

  const departments = [
    "الإدارة العليا",
    "الشؤون الأكاديمية",
    "الشؤون المالية",
    "تقنية المعلومات",
    "الموارد البشرية",
    "خدمة العملاء",
    "الجودة والتطوير"
  ];

  const permissionCategories = {
    "إدارة المستخدمين": {
      icon: <Users className="w-4 h-4" />,
      permissions: {
        students: "إدارة الطلاب",
        teachers: "إدارة المعلمين", 
        employees: "إدارة الموظفين",
        admins: "إدارة المشرفين"
      }
    },
    "العمليات المالية": {
      icon: <CreditCard className="w-4 h-4" />,
      permissions: {
        financial: "المعاملات المالية",
        transactions: "إدارة المدفوعات",
        reports: "التقارير المالية",
        budgets: "إدارة الميزانيات"
      }
    },
    "إعدادات النظام": {
      icon: <Settings className="w-4 h-4" />,
      permissions: {
        settings: "الإعدادات العامة",
        systemConfig: "تكوين النظام",
        backups: "النسخ الاحتياطية",
        logs: "سجلات النظام"
      }
    },
    "الإدارة الأكاديمية": {
      icon: <BookOpen className="w-4 h-4" />,
      permissions: {
        classrooms: "إدارة الفصول",
        attendance: "إدارة الحضور",
        schedules: "الجدولة",
        exams: "إدارة الامتحانات",
        grades: "إدارة الدرجات"
      }
    },
    "إدارة المحتوى": {
      icon: <FileText className="w-4 h-4" />,
      permissions: {
        content: "إدارة المحتوى",
        announcements: "الإعلانات",
        events: "الأحداث",
        documents: "إدارة الوثائق"
      }
    },
    "البطاقات والهوية": {
      icon: <Key className="w-4 h-4" />,
      permissions: {
        cards: "إدارة البطاقات",
        cardDesign: "تصميم البطاقات",
        cardPrint: "طباعة البطاقات"
      }
    },
    "التقارير والإحصائيات": {
      icon: <Database className="w-4 h-4" />,
      permissions: {
        analytics: "التحليلات",
        dashboard: "لوحة التحكم",
        customReports: "التقارير المخصصة"
      }
    }
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUser(userId);
    setShowPermissions(true);
  };

  const getCurrentUser = () => {
    return users.find(user => user.id === selectedUser);
  };

  const updatePermission = (userId: string, permission: keyof UserPermission['permissions'], value: boolean) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, permissions: { ...user.permissions, [permission]: value } }
        : user
    ));
    
    toast({
      title: "تم تحديث الصلاحية",
      description: `تم ${value ? 'منح' : 'إلغاء'} الصلاحية بنجاح`
    });
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, active: !user.active } : user
    ));
    
    const user = users.find(u => u.id === userId);
    toast({
      title: user?.active ? "تم تعطيل المستخدم" : "تم تفعيل المستخدم",
      description: `تم ${user?.active ? 'تعطيل' : 'تفعيل'} ${user?.name} بنجاح`
    });
  };

  const handleEditUser = (user: UserPermission) => {
    setEditingUser({ ...user });
    setIsEditDialogOpen(true);
  };

  const handleSaveUserEdits = () => {
    if (!editingUser) return;
    
    setUsers(users.map(user => 
      user.id === editingUser.id ? editingUser : user
    ));
    
    setIsEditDialogOpen(false);
    setEditingUser(null);
    
    toast({
      title: "تم حفظ التغييرات",
      description: "تم تحديث بيانات المستخدم بنجاح"
    });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "تم حذف المستخدم",
      description: "تم حذف المستخدم بنجاح"
    });
  };

  const toggleAllPermissions = (userId: string, categoryPermissions: Record<string, string>, value: boolean) => {
    const permissionKeys = Object.keys(categoryPermissions) as (keyof UserPermission['permissions'])[];
    
    setUsers(users.map(user => {
      if (user.id === userId) {
        const updatedPermissions = { ...user.permissions };
        permissionKeys.forEach(key => {
          updatedPermissions[key] = value;
        });
        return { ...user, permissions: updatedPermissions };
      }
      return user;
    }));

    toast({
      title: value ? "تم تفعيل جميع الصلاحيات" : "تم إلغاء جميع الصلاحيات",
      description: `تم ${value ? 'تفعيل' : 'إلغاء'} جميع صلاحيات الفئة`
    });
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            إدارة الصلاحيات
          </h1>
          <p className="text-muted-foreground">تحديد صلاحيات المستخدمين وإدارة الوصول</p>
        </div>
        <AddUserDialog />
      </div>

      {/* User Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            اختيار الموظف
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={selectedUser} onValueChange={handleUserSelect}>
              <SelectTrigger>
                <SelectValue placeholder="اختر موظف لإدارة صلاحياته" />
              </SelectTrigger>
              <SelectContent>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center gap-2 text-right">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.role} - {user.department}</div>
                        <div className="text-xs text-muted-foreground">
                          المستخدم: {user.username} | كلمة المرور: {user.password}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <AddUserDialog />
          </div>
        </CardContent>
      </Card>

      {/* User Permissions */}
      {showPermissions && getCurrentUser() && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  صلاحيات الموظف: {getCurrentUser()?.name}
                </CardTitle>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="outline">{getCurrentUser()?.role}</Badge>
                  <Badge variant="outline">{getCurrentUser()?.department}</Badge>
                  <Badge variant={getCurrentUser()?.active ? "default" : "destructive"}>
                    {getCurrentUser()?.active ? "نشط" : "معطل"}
                  </Badge>
                </div>
                <div className="flex items-center gap-6 mt-3 p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">اسم المستخدم:</span>
                    <code className="px-2 py-1 bg-background rounded text-sm font-mono">
                      {getCurrentUser()?.username}
                    </code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">كلمة المرور:</span>
                    <code className="px-2 py-1 bg-background rounded text-sm font-mono">
                      {getCurrentUser()?.password}
                    </code>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPermissions(false)}
                >
                  <X className="w-4 h-4 ml-1" />
                  إغلاق
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleUserStatus(selectedUser)}
                >
                  {getCurrentUser()?.active ? "تعطيل" : "تفعيل"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(permissionCategories).map(([categoryName, category]) => {
                const categoryPermissions = category.permissions;
                const currentUser = getCurrentUser();
                const hasAllPermissions = currentUser && Object.keys(categoryPermissions).every(
                  key => currentUser.permissions[key as keyof UserPermission['permissions']]
                );
                const hasAnyPermission = currentUser && Object.keys(categoryPermissions).some(
                  key => currentUser.permissions[key as keyof UserPermission['permissions']]
                );

                return (
                  <div key={categoryName} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {category.icon}
                        <h3 className="font-semibold text-lg">{categoryName}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleAllPermissions(selectedUser, categoryPermissions, true)}
                          disabled={hasAllPermissions}
                        >
                          تفعيل الكل
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleAllPermissions(selectedUser, categoryPermissions, false)}
                          disabled={!hasAnyPermission}
                        >
                          إلغاء الكل
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(categoryPermissions).map(([permissionKey, permissionName]) => {
                        const isEnabled = currentUser?.permissions[permissionKey as keyof UserPermission['permissions']] || false;
                        
                        return (
                          <div 
                            key={permissionKey} 
                            className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all hover:bg-muted/50 ${
                              isEnabled ? 'bg-primary/5 border-primary/20' : 'bg-background'
                            }`}
                            onClick={() => updatePermission(selectedUser, permissionKey as keyof UserPermission['permissions'], !isEnabled)}
                          >
                            <span className="font-medium">{permissionName}</span>
                            <div className={`w-12 h-6 rounded-full flex items-center transition-all ${
                              isEnabled ? 'bg-primary justify-end' : 'bg-muted justify-start'
                            }`}>
                              <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-all ${
                                isEnabled ? 'mr-1' : 'ml-1'
                              }`} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {!showPermissions && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">اختر موظف لإدارة صلاحياته</h3>
            <p className="text-muted-foreground">
              استخدم القائمة المنسدلة أعلاه لاختيار الموظف الذي تريد إدارة صلاحياته
            </p>
          </CardContent>
        </Card>
      )}


      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              تعديل بيانات المستخدم
            </DialogTitle>
          </DialogHeader>
          
          {editingUser && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الاسم</Label>
                  <Input
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>البريد الإلكتروني</Label>
                  <Input
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>رقم الهاتف</Label>
                  <Input
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>الدور</Label>
                  <Select value={editingUser.role} onValueChange={(value) => setEditingUser({...editingUser, role: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>القسم</Label>
                  <Select value={editingUser.department} onValueChange={(value) => setEditingUser({...editingUser, department: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Restrictions */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">قيود الوصول</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>الحد الأقصى للمستخدمين</Label>
                    <Input
                      type="number"
                      value={editingUser.restrictions.maxUsers}
                      onChange={(e) => setEditingUser({
                        ...editingUser,
                        restrictions: {
                          ...editingUser.restrictions,
                          maxUsers: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>الأقسام المصرح بها</Label>
                    <div className="space-y-2 max-h-24 overflow-y-auto border rounded p-2">
                      {departments.map(dept => (
                        <div key={dept} className="flex items-center space-x-2">
                          <Checkbox
                            id={`dept-${dept}`}
                            checked={editingUser.restrictions.departments.includes(dept)}
                            onCheckedChange={(checked) => {
                              const updatedDepts = checked
                                ? [...editingUser.restrictions.departments, dept]
                                : editingUser.restrictions.departments.filter(d => d !== dept);
                              setEditingUser({
                                ...editingUser,
                                restrictions: {
                                  ...editingUser.restrictions,
                                  departments: updatedDepts
                                }
                              });
                            }}
                          />
                          <Label htmlFor={`dept-${dept}`} className="text-sm">
                            {dept}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>وقت البداية</Label>
                    <Input
                      type="time"
                      value={editingUser.restrictions.timeAccess.startTime}
                      onChange={(e) => setEditingUser({
                        ...editingUser,
                        restrictions: {
                          ...editingUser.restrictions,
                          timeAccess: {
                            ...editingUser.restrictions.timeAccess,
                            startTime: e.target.value
                          }
                        }
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>وقت النهاية</Label>
                    <Input
                      type="time"
                      value={editingUser.restrictions.timeAccess.endTime}
                      onChange={(e) => setEditingUser({
                        ...editingUser,
                        restrictions: {
                          ...editingUser.restrictions,
                          timeAccess: {
                            ...editingUser.restrictions.timeAccess,
                            endTime: e.target.value
                          }
                        }
                      })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>أيام العمل</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"].map(day => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={`day-${day}`}
                          checked={editingUser.restrictions.timeAccess.days.includes(day)}
                          onCheckedChange={(checked) => {
                            const updatedDays = checked
                              ? [...editingUser.restrictions.timeAccess.days, day]
                              : editingUser.restrictions.timeAccess.days.filter(d => d !== day);
                            setEditingUser({
                              ...editingUser,
                              restrictions: {
                                ...editingUser.restrictions,
                                timeAccess: {
                                  ...editingUser.restrictions.timeAccess,
                                  days: updatedDays
                                }
                              }
                            });
                          }}
                        />
                        <Label htmlFor={`day-${day}`} className="text-sm">
                          {day}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  <X className="w-4 h-4 ml-2" />
                  إلغاء
                </Button>
                <Button onClick={handleSaveUserEdits}>
                  <Save className="w-4 h-4 ml-2" />
                  حفظ التغييرات
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default AdminPermissions;