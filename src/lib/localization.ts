// تنسيق الأرقام والتواريخ للجزائر
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('ar-DZ').format(num);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ar-DZ', {
    style: 'currency',
    currency: 'DZD',
  }).format(amount);
};

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ar-DZ', {
    timeZone: 'Africa/Algiers',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(dateObj);
};

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ar-DZ', {
    timeZone: 'Africa/Algiers',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // إزالة المسافات والرموز
  const cleanPhone = phone.replace(/\D/g, '');
  
  // إذا كان الرقم يبدأ بـ 213 (كود الجزائر)
  if (cleanPhone.startsWith('213')) {
    const number = cleanPhone.substring(3);
    return `+213 ${number.substring(0, 1)} ${number.substring(1, 3)} ${number.substring(3, 5)} ${number.substring(5, 7)} ${number.substring(7)}`;
  }
  
  // إذا كان رقم محلي (9 أرقام)
  if (cleanPhone.length === 9) {
    return `0${cleanPhone.substring(0, 1)} ${cleanPhone.substring(1, 3)} ${cleanPhone.substring(3, 5)} ${cleanPhone.substring(5, 7)} ${cleanPhone.substring(7)}`;
  }
  
  // إذا كان رقم محلي (10 أرقام يبدأ بـ 0)
  if (cleanPhone.length === 10 && cleanPhone.startsWith('0')) {
    return `${cleanPhone.substring(0, 2)} ${cleanPhone.substring(2, 4)} ${cleanPhone.substring(4, 6)} ${cleanPhone.substring(6, 8)} ${cleanPhone.substring(8)}`;
  }
  
  return phone; // إرجاع الرقم كما هو إذا لم يتطابق مع الأنماط
};