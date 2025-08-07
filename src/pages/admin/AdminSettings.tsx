import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Save, Upload, Mail, Bell, Shield, Database } from "lucide-react";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    instituteName: "مؤسسة التعليم المتميز",
    instituteDescription: "مؤسسة تعليمية متخصصة في تقديم دورات القرآن الكريم واللغات والعلوم",
    contactEmail: "info@institute.com",
    contactPhone: "+213 555 123 456",
    address: "الجزائر العاصمة، الجمهورية الجزائرية الديمقراطية الشعبية",
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    registrationNotifications: true,
    paymentNotifications: true,
    
    // Security
    requireEmailVerification: true,
    enableTwoFactor: false,
    sessionTimeout: "30",
    passwordMinLength: "8",
    
    // System
    defaultLanguage: "ar",
    timezone: "Africa/Algiers",
    dateFormat: "dd/mm/yyyy",
    currency: "DZD",
    
    // Courses
    maxStudentsPerClass: "25",
    allowWaitingList: true,
    autoApproveRegistrations: false,
    registrationDeadlineDays: "7",
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    // Save settings logic here
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    alert("تم حفظ الإعدادات بنجاح");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Settings className="w-8 h-8 text-primary" />
            إعدادات النظام
          </h1>
          <p className="text-muted-foreground">إدارة إعدادات المؤسسة والنظام</p>
        </div>
        <Button onClick={saveSettings}>
          <Save className="w-4 h-4 mr-2" />
          حفظ الإعدادات
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">عام</TabsTrigger>
          <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
          <TabsTrigger value="security">الأمان</TabsTrigger>
          <TabsTrigger value="system">النظام</TabsTrigger>
          <TabsTrigger value="courses">الدورات</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                الإعدادات العامة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">اسم المؤسسة</label>
                  <Input
                    value={settings.instituteName}
                    onChange={(e) => handleSettingChange("instituteName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">البريد الإلكتروني</label>
                  <Input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleSettingChange("contactEmail", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">رقم الهاتف</label>
                  <Input
                    value={settings.contactPhone}
                    onChange={(e) => handleSettingChange("contactPhone", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">العنوان</label>
                  <Input
                    value={settings.address}
                    onChange={(e) => handleSettingChange("address", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">وصف المؤسسة</label>
                <Textarea
                  value={settings.instituteDescription}
                  onChange={(e) => handleSettingChange("instituteDescription", e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">شعار المؤسسة</h3>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      رفع الشعار
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      الحد الأقصى: 2MB، الأنواع المدعومة: JPG, PNG
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                إعدادات الإشعارات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">إشعارات البريد الإلكتروني</h3>
                    <p className="text-sm text-muted-foreground">إرسال الإشعارات عبر البريد الإلكتروني</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">إشعارات الرسائل النصية</h3>
                    <p className="text-sm text-muted-foreground">إرسال الإشعارات عبر الرسائل النصية</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleSettingChange("smsNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">الإشعارات الفورية</h3>
                    <p className="text-sm text-muted-foreground">إظهار الإشعارات في المتصفح</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">إشعارات التسجيل</h3>
                    <p className="text-sm text-muted-foreground">تنبيهات عند تسجيل طلاب أو معلمين جدد</p>
                  </div>
                  <Switch
                    checked={settings.registrationNotifications}
                    onCheckedChange={(checked) => handleSettingChange("registrationNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">إشعارات الدفع</h3>
                    <p className="text-sm text-muted-foreground">تنبيهات عند المعاملات المالية</p>
                  </div>
                  <Switch
                    checked={settings.paymentNotifications}
                    onCheckedChange={(checked) => handleSettingChange("paymentNotifications", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                إعدادات الأمان
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">التحقق من البريد الإلكتروني</h3>
                    <p className="text-sm text-muted-foreground">يتطلب التحقق من البريد عند التسجيل</p>
                  </div>
                  <Switch
                    checked={settings.requireEmailVerification}
                    onCheckedChange={(checked) => handleSettingChange("requireEmailVerification", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">المصادقة الثنائية</h3>
                    <p className="text-sm text-muted-foreground">تمكين المصادقة الثنائية للمديرين</p>
                  </div>
                  <Switch
                    checked={settings.enableTwoFactor}
                    onCheckedChange={(checked) => handleSettingChange("enableTwoFactor", checked)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">مهلة انتهاء الجلسة (دقيقة)</label>
                    <Select 
                      value={settings.sessionTimeout} 
                      onValueChange={(value) => handleSettingChange("sessionTimeout", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 دقيقة</SelectItem>
                        <SelectItem value="30">30 دقيقة</SelectItem>
                        <SelectItem value="60">60 دقيقة</SelectItem>
                        <SelectItem value="120">120 دقيقة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">الحد الأدنى لطول كلمة المرور</label>
                    <Select 
                      value={settings.passwordMinLength} 
                      onValueChange={(value) => handleSettingChange("passwordMinLength", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 أحرف</SelectItem>
                        <SelectItem value="8">8 أحرف</SelectItem>
                        <SelectItem value="10">10 أحرف</SelectItem>
                        <SelectItem value="12">12 حرف</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                إعدادات النظام
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">اللغة الافتراضية</label>
                  <Select 
                    value={settings.defaultLanguage} 
                    onValueChange={(value) => handleSettingChange("defaultLanguage", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">المنطقة الزمنية</label>
                  <Select 
                    value={settings.timezone} 
                    onValueChange={(value) => handleSettingChange("timezone", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Algiers">الجزائر (GMT+1)</SelectItem>
                      <SelectItem value="Asia/Riyadh">الرياض (GMT+3)</SelectItem>
                      <SelectItem value="Asia/Dubai">دبي (GMT+4)</SelectItem>
                      <SelectItem value="UTC">توقيت غرينتش (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">تنسيق التاريخ</label>
                  <Select 
                    value={settings.dateFormat} 
                    onValueChange={(value) => handleSettingChange("dateFormat", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/mm/yyyy">يوم/شهر/سنة</SelectItem>
                      <SelectItem value="mm/dd/yyyy">شهر/يوم/سنة</SelectItem>
                      <SelectItem value="yyyy-mm-dd">سنة-شهر-يوم</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">العملة</label>
                  <Select 
                    value={settings.currency} 
                    onValueChange={(value) => handleSettingChange("currency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DZD">دينار جزائري (DZD)</SelectItem>
                      <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                      <SelectItem value="AED">درهم إماراتي (AED)</SelectItem>
                      <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">صيانة النظام</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start">
                    <Database className="w-4 h-4 mr-2" />
                    نسخ احتياطي للبيانات
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Upload className="w-4 h-4 mr-2" />
                    استيراد البيانات
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                إعدادات الدورات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">الحد الأقصى للطلاب في الفصل</label>
                  <Input
                    type="number"
                    value={settings.maxStudentsPerClass}
                    onChange={(e) => handleSettingChange("maxStudentsPerClass", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">مهلة إغلاق التسجيل (أيام)</label>
                  <Input
                    type="number"
                    value={settings.registrationDeadlineDays}
                    onChange={(e) => handleSettingChange("registrationDeadlineDays", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">السماح بقائمة الانتظار</h3>
                    <p className="text-sm text-muted-foreground">السماح للطلاب بالانضمام لقائمة الانتظار عند امتلاء الفصل</p>
                  </div>
                  <Switch
                    checked={settings.allowWaitingList}
                    onCheckedChange={(checked) => handleSettingChange("allowWaitingList", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">الموافقة التلقائية على التسجيلات</h3>
                    <p className="text-sm text-muted-foreground">قبول التسجيلات تلقائياً دون مراجعة يدوية</p>
                  </div>
                  <Switch
                    checked={settings.autoApproveRegistrations}
                    onCheckedChange={(checked) => handleSettingChange("autoApproveRegistrations", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;