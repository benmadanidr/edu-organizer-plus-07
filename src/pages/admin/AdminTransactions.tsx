import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Search, Download, TrendingUp, TrendingDown } from "lucide-react";
import { AddTransactionDialog } from "@/components/admin/AddTransactionDialog";

interface Transaction {
  id: string;
  type: "income" | "expense";
  description: string;
  amount: number;
  date: string;
  category: string;
  status: "completed" | "pending" | "cancelled";
  studentName?: string;
}

const AdminTransactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "income",
      description: "رسوم تسجيل دورة القرآن الكريم",
      amount: 12500,
      date: "2024-01-15",
      category: "رسوم دراسية",
      status: "completed",
      studentName: "أحمد محمد",
    },
    {
      id: "2",
      type: "income",
      description: "رسوم دورة اللغة الإنجليزية",
      amount: 18750,
      date: "2024-01-14",
      category: "رسوم دراسية",
      status: "completed",
      studentName: "فاطمة علي",
    },
    {
      id: "3",
      type: "expense",
      description: "راتب المعلم - يناير",
      amount: 75000,
      date: "2024-01-01",
      category: "رواتب",
      status: "completed",
    },
    {
      id: "4",
      type: "income",
      description: "رسوم دورة الرياضيات",
      amount: 15000,
      date: "2024-01-12",
      category: "رسوم دراسية",
      status: "pending",
      studentName: "خالد أحمد",
    },
  ]);

  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.studentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalIncome = transactions
    .filter(t => t.type === "income" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default">مكتملة</Badge>;
      case "pending":
        return <Badge variant="secondary">معلقة</Badge>;
      case "cancelled":
        return <Badge variant="destructive">ملغية</Badge>;
      default:
        return <Badge variant="outline">غير محدد</Badge>;
    }
  };

  const handleExportReport = () => {
    // Export report functionality would be implemented here
    console.log("Exporting financial report...");
  };

  const handleAddTransaction = () => {
    // Add transaction functionality would be implemented here
    console.log("Opening add transaction form...");
  };

  const handleConfirmTransaction = (id: string) => {
    // Confirm transaction functionality would be implemented here
    console.log(`Confirming transaction: ${id}`);
  };

  const handleCancelTransaction = (id: string) => {
    // Cancel transaction functionality would be implemented here
    console.log(`Cancelling transaction: ${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <DollarSign className="w-8 h-8 text-primary" />
            المعاملات المالية
          </h1>
          <p className="text-muted-foreground">إدارة الإيرادات والمصروفات</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExportReport()}>
            <Download className="w-4 h-4 mr-2" />
            تصدير التقرير
          </Button>
          <AddTransactionDialog />
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-education-green to-education-green/80 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90">إجمالي الإيرادات</p>
                <h3 className="text-3xl font-bold">{totalIncome.toLocaleString()} د.ج</h3>
              </div>
              <TrendingUp className="w-12 h-12 text-white/70" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-education-orange to-education-orange/80 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90">إجمالي المصروفات</p>
                <h3 className="text-3xl font-bold">{totalExpenses.toLocaleString()} د.ج</h3>
              </div>
              <TrendingDown className="w-12 h-12 text-white/70" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/90">صافي الربح</p>
                <h3 className="text-3xl font-bold">{netBalance.toLocaleString()} د.ج</h3>
              </div>
              <DollarSign className="w-12 h-12 text-primary-foreground/70" />
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
              placeholder="البحث في المعاملات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Transactions Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">جميع المعاملات</TabsTrigger>
          <TabsTrigger value="income">الإيرادات</TabsTrigger>
          <TabsTrigger value="expense">المصروفات</TabsTrigger>
          <TabsTrigger value="pending">المعلقة</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>جميع المعاملات ({filteredTransactions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-education-green/20' : 'bg-education-orange/20'}`}>
                        {transaction.type === 'income' ? 
                          <TrendingUp className="w-5 h-5 text-education-green" /> :
                          <TrendingDown className="w-5 h-5 text-education-orange" />
                        }
                      </div>
                      <div>
                        <h3 className="font-semibold">{transaction.description}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{transaction.category}</span>
                          {transaction.studentName && <span>• {transaction.studentName}</span>}
                          <span>• {new Date(transaction.date).toLocaleDateString('ar-SA')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-left">
                        <p className={`font-bold text-lg ${transaction.type === 'income' ? 'text-education-green' : 'text-education-orange'}`}>
                          {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString()} د.ج
                        </p>
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="income">
          <Card>
            <CardHeader>
              <CardTitle>الإيرادات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTransactions.filter(t => t.type === 'income').map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-education-green/20">
                        <TrendingUp className="w-5 h-5 text-education-green" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{transaction.description}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{transaction.category}</span>
                          {transaction.studentName && <span>• {transaction.studentName}</span>}
                          <span>• {new Date(transaction.date).toLocaleDateString('ar-SA')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-left">
                        <p className="font-bold text-lg text-education-green">
                          +{transaction.amount.toLocaleString()} د.ج
                        </p>
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expense">
          <Card>
            <CardHeader>
              <CardTitle>المصروفات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTransactions.filter(t => t.type === 'expense').map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-education-orange/20">
                        <TrendingDown className="w-5 h-5 text-education-orange" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{transaction.description}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{transaction.category}</span>
                          <span>• {new Date(transaction.date).toLocaleDateString('ar-SA')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-left">
                        <p className="font-bold text-lg text-education-orange">
                          -{transaction.amount.toLocaleString()} د.ج
                        </p>
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>المعاملات المعلقة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTransactions.filter(t => t.status === 'pending').map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-education-green/20' : 'bg-education-orange/20'}`}>
                        {transaction.type === 'income' ? 
                          <TrendingUp className="w-5 h-5 text-education-green" /> :
                          <TrendingDown className="w-5 h-5 text-education-orange" />
                        }
                      </div>
                      <div>
                        <h3 className="font-semibold">{transaction.description}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{transaction.category}</span>
                          {transaction.studentName && <span>• {transaction.studentName}</span>}
                          <span>• {new Date(transaction.date).toLocaleDateString('ar-SA')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-left">
                        <p className={`font-bold text-lg ${transaction.type === 'income' ? 'text-education-green' : 'text-education-orange'}`}>
                          {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString()} د.ج
                        </p>
                        {getStatusBadge(transaction.status)}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="default" onClick={() => handleConfirmTransaction(transaction.id)}>تأكيد</Button>
                        <Button size="sm" variant="outline" onClick={() => handleCancelTransaction(transaction.id)}>إلغاء</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTransactions;