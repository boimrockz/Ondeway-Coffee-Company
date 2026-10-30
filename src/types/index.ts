export type ProductCategory =
  | 'Espresso Based'
  | 'Manual Brew'
  | 'Signature Mocktail'
  | 'Non-Coffee'
  | 'Pastry & Food'
  | 'Whole Beans B2B';

export interface ProductVariantOption {
  ice?: 'Normal Ice' | 'Less Ice' | 'No Ice' | 'Hot';
  sugar?: 'Normal Sweet (100%)' | 'Less Sweet (50%)' | 'No Sugar (0%)' | 'Extra Sweet';
  milk?: 'Regular Fresh Milk' | 'Oat Milk (+Rp 7.000)' | 'Almond Milk (+Rp 8.000)';
  extraShot?: boolean;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  category: ProductCategory;
  description: string;
  image: string;
  priceRetail: number;
  priceGrosir: number; // Tier Grosir B2B
  priceDistributor: number; // Tier Distributor B2B
  costHPP: number; // Calculated or base HPP
  unit: string;
  recipeId?: string;
  isAvailable: boolean;
  isPopular?: boolean;
}

export type MaterialCategory =
  | 'green_bean'
  | 'roasted_bean'
  | 'dairy'
  | 'flavor_syrup'
  | 'packaging'
  | 'kitchen';

export interface RawMaterial {
  id: string;
  code: string;
  name: string;
  category: MaterialCategory;
  origin?: string; // e.g., 'Aceh Tengah, 1500 masl'
  stock: number;
  unit: 'gram' | 'kg' | 'ml' | 'liter' | 'pcs';
  costPerUnit: number; // in IDR
  minStockAlert: number;
  supplier?: string;
  lastRestocked?: string;
}

export interface RecipeIngredient {
  materialId: string;
  amount: number;
  unit: string;
}

export interface Recipe {
  id: string;
  productId: string;
  productName: string;
  yieldUnit: string;
  ingredients: RecipeIngredient[];
  preparationNotes?: string;
}

export interface RoastingBatch {
  id: string;
  batchNumber: string;
  date: string;
  greenBeanId: string;
  greenBeanName: string;
  greenWeightKg: number;
  roastedWeightKg: number;
  shrinkagePercent: number; // ((green - roasted) / green) * 100
  roastProfile: 'Light' | 'Medium' | 'Medium-Dark' | 'Dark';
  roasterName: string;
  resultingCostPerKg: number;
  notes?: string;
}

export type CustomerType = 'b2c' | 'b2b';
export type CustomerTier = 'retail' | 'grosir' | 'distributor';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  type: CustomerType;
  tier: CustomerTier;
  points: number;
  totalSpend: number;
  companyName?: string;
  taxId?: string;
  creditLimit?: number;
  currentDebt?: number;
  joinDate: string;
}

export interface PromoVoucher {
  code: string;
  name: string;
  type: 'percent' | 'nominal';
  value: number; // e.g. 15 for 15% or 10000 for 10k
  minOrder: number;
  maxDiscount?: number;
  usedCount: number;
  quota: number;
  active: boolean;
  applicableType?: 'all' | 'b2c' | 'b2b';
  expiryDate: string;
}

export interface CartItem {
  id: string;
  product: Product;
  qty: number;
  variant: ProductVariantOption;
  note: string;
  unitPrice: number;
  extraCost: number;
  totalPrice: number;
  costHPP: number;
}

export type PaymentMethod = 'cash' | 'qris' | 'debit' | 'tempo';
export type OrderType = 'dine_in' | 'take_away' | 'delivery';

export interface TransactionItem {
  productId: string;
  code: string;
  name: string;
  category: ProductCategory;
  qty: number;
  unitPrice: number;
  extraCost: number;
  totalPrice: number;
  costHPP: number;
  variant?: ProductVariantOption;
  note?: string;
}

export interface Transaction {
  id: string;
  invoiceNo: string;
  date: string;
  outletId: string;
  outletName: string;
  customerId?: string;
  customerName: string;
  customerType: CustomerType;
  customerTier: CustomerTier;
  items: TransactionItem[];
  subtotal: number;
  promoCode?: string;
  promoDiscount: number;
  pointsUsed: number;
  pointsDiscount: number;
  pointsEarned: number;
  total: number;
  paymentMethod: PaymentMethod;
  cashGiven?: number;
  changeGiven?: number;
  qrisRef?: string;
  debitCardRef?: string;
  tempoDueDate?: string;
  orderType: OrderType;
  tableNumber?: string;
  status: 'completed' | 'voided';
  voidReason?: string;
  cashierName: string;
  totalHPP: number;
  grossProfit: number;
}

export interface CashierShift {
  id: string;
  employeeName: string;
  role: string;
  outletId: string;
  shiftName: 'Shift Pagi (07:00 - 15:00)' | 'Shift Sore (14:30 - 22:30)';
  openedAt: string;
  closedAt?: string;
  initialFloat: number; // Modal awal kas
  totalCashSales: number;
  totalQrisSales: number;
  totalDebitSales: number;
  totalTempoSales: number;
  expectedCashTotal: number; // initialFloat + totalCashSales
  actualCashTotal?: number; // uang fisik saat hitung tutup kasir
  cashVariance?: number; // actual - expected
  status: 'open' | 'closed';
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeName: string;
  role: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  shift: string;
  status: 'Hadir Tepat Waktu' | 'Terlambat' | 'Izin' | 'Cuti';
  outlet: string;
}

export interface Outlet {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  taxRate: number;
}

export interface BSCPerspective {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  icon: string;
  objectives: {
    id: string;
    name: string;
    kpi: string;
    baseline: string;
    target: string;
    actual: string;
    progressPercent: number;
    status: 'good' | 'warn' | 'bad';
    pic: string;
  }[];
}

export interface OKRItem {
  id: string;
  quarter: string;
  objective: string;
  owner: string;
  keyResults: {
    id: string;
    text: string;
    target: number;
    current: number;
    unit: string;
    progress: number;
  }[];
}

export interface RACIRow {
  process: string;
  owner: 'R' | 'A' | 'C' | 'I' | '-';
  roasteryHead: 'R' | 'A' | 'C' | 'I' | '-';
  headBarista: 'R' | 'A' | 'C' | 'I' | '-';
  cashier: 'R' | 'A' | 'C' | 'I' | '-';
  inventoryMgr: 'R' | 'A' | 'C' | 'I' | '-';
  financeMgr: 'R' | 'A' | 'C' | 'I' | '-';
}

export interface Employee {
  id: string;
  nik: string; // e.g. EMP-ODW-001
  name: string;
  role: string;
  department:
    | 'Front of House'
    | 'Roastery & Quality Lab'
    | 'Kitchen & Pastry'
    | 'Finance & Admin'
    | 'Executive Board';
  employmentStatus: 'Tetap' | 'Kontrak' | 'Probation' | 'Part-time';
  joinDate: string;
  email: string;
  phone: string;
  baseSalary: number;
  attendanceAllowance: number;
  outletId: string;
  outletName: string;
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
  certifications: string[];
  avatar?: string;
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
  status: 'active' | 'leave' | 'inactive';
}

export interface OrgNode {
  id: string;
  nik?: string;
  name: string;
  role: string;
  department: string;
  photo?: string;
  phone?: string;
  email?: string;
  responsibilities?: string[];
  kpis?: string[];
  children?: OrgNode[];
}

export type LMSMaterialKind = 'text' | 'video' | 'doc';

export interface LMSMaterial {
  id: string;
  title: string;
  kind: LMSMaterialKind;
  durationMinutes: number;
  content: string;
  mediaUrl?: string;
}

export interface LMSQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface LMSCourse {
  id: string;
  code: string;
  title: string;
  description: string;
  category: 'Barista' | 'Roastery' | 'Kasir & Front of House' | 'Food Safety & SOP';
  level: 'Fondasi (Dasar)' | 'Menengah' | 'Lanjutan (Mastery)';
  thumbnail: string;
  instructor: string;
  estimatedHours: number;
  materials: LMSMaterial[];
  quiz: LMSQuizQuestion[];
  passingScorePercent: number;
  enrolledEmployees: string[];
  completedEmployees: {
    employeeName: string;
    completedAt: string;
    score: number;
    certificateNo: string;
  }[];
}

export interface SOPDocument {
  id: string;
  code: string;
  title: string;
  category: string;
  lastUpdated: string;
  author: string;
  summary: string;
  content: string;
  fileKind: 'SOP Operasional' | 'Resep Standar' | 'Checklist Harian' | 'Manual Mesin';
}

