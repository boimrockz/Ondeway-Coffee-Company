import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  RawMaterial,
  Recipe,
  RoastingBatch,
  Customer,
  PromoVoucher,
  CartItem,
  Transaction,
  CashierShift,
  AttendanceRecord,
  Outlet,
  BSCPerspective,
  OKRItem,
  RACIRow,
  OrgNode,
  OrderType,
  PaymentMethod,
  ProductVariantOption,
  LMSCourse,
  LMSMaterial,
  SOPDocument,
  Employee,
} from '../types';
import {
  INITIAL_OUTLETS,
  INITIAL_MATERIALS,
  INITIAL_PRODUCTS,
  INITIAL_RECIPES,
  INITIAL_ROASTING_BATCHES,
  INITIAL_CUSTOMERS,
  INITIAL_PROMOS,
  INITIAL_TRANSACTIONS,
  INITIAL_SHIFTS,
  INITIAL_ATTENDANCE,
  INITIAL_EMPLOYEES,
  INITIAL_BSC,
  INITIAL_OKRS,
  INITIAL_RACI,
  INITIAL_ORG_CHART,
  INITIAL_COURSES,
  INITIAL_SOPS,
} from '../data/seedData';

interface AppContextType {
  // Theme & Navigation
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Selected state
  currentOutlet: Outlet;
  setCurrentOutlet: (outlet: Outlet) => void;
  cashierName: string;
  setCashierName: (name: string) => void;

  // Data collections
  outlets: Outlet[];
  materials: RawMaterial[];
  products: Product[];
  recipes: Recipe[];
  roastingBatches: RoastingBatch[];
  customers: Customer[];
  promos: PromoVoucher[];
  transactions: Transaction[];
  shifts: CashierShift[];
  currentShift: CashierShift | null;
  attendance: AttendanceRecord[];
  employees: Employee[];
  bsc: BSCPerspective[];
  okrs: OKRItem[];
  raci: RACIRow[];
  orgChart: OrgNode;
  updateOrgChart: (chart: OrgNode) => void;
  addOrgNodeChild: (parentId: string, node: Omit<OrgNode, 'id'>) => void;
  deleteOrgNode: (nodeId: string) => void;

  // LMS & SOP Collections
  courses: LMSCourse[];
  sops: SOPDocument[];
  enrollEmployeeInCourse: (courseId: string, employeeName: string) => void;
  submitCourseQuiz: (
    courseId: string,
    employeeName: string,
    score: number
  ) => { passed: boolean; certificateNo?: string };
  addCourseMaterial: (courseId: string, material: Omit<LMSMaterial, 'id'>) => void;
  createCourse: (course: Omit<LMSCourse, 'id'>) => void;
  createSop: (sop: Omit<SOPDocument, 'id'>) => void;

  // POS & Cart state
  cart: CartItem[];
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer | null) => void;
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  tableNumber: string;
  setTableNumber: (table: string) => void;
  activePromo: PromoVoucher | null;
  pointsToUse: number;
  setPointsToUse: (pts: number) => void;

  // Cart actions
  addToCart: (product: Product, variant?: ProductVariantOption, note?: string) => void;
  updateCartItemQty: (index: number, delta: number) => void;
  removeCartItem: (index: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromo: () => void;

  // Calculated figures
  cartSubtotal: number;
  promoDiscount: number;
  pointsDiscount: number;
  cartTotal: number;
  pointsEarned: number;
  cartTotalHPP: number;

  // Transaction checkout & void
  completeTransaction: (params: {
    paymentMethod: PaymentMethod;
    cashGiven?: number;
    qrisRef?: string;
    debitRef?: string;
    tempoDueDate?: string;
  }) => Transaction;
  voidTransaction: (txId: string, reason: string) => void;

  // Inventory & Roasting actions
  adjustMaterialStock: (materialId: string, delta: number, reason: string) => void;
  addRawMaterial: (material: Omit<RawMaterial, 'id'>) => void;
  updateRawMaterial: (id: string, updates: Partial<RawMaterial>) => void;
  addRoastingBatch: (batch: Omit<RoastingBatch, 'id'>) => void;

  // Recipes & Products actions
  updateRecipe: (recipeId: string, ingredients: Recipe['ingredients']) => void;
  calculateProductHPP: (productId: string) => number;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Employee actions
  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  // Customer actions
  addCustomer: (cust: Omit<Customer, 'id' | 'points' | 'totalSpend' | 'joinDate'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;

  // Promos
  addPromo: (promo: PromoVoucher) => void;

  // Shift & Cash Drawer
  closeCashDrawer: (actualCash: number, notes?: string) => void;
  openNewShift: (shiftName: CashierShift['shiftName'], initialFloat: number) => void;
  clockInAttendance: (employeeName: string, role: string, shift: string) => void;
  clockOutAttendance: (id: string) => void;

  // Reset demo data
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const POINT_VALUE_RUPIAH = 100; // 1 point = Rp 100
const POINT_EARN_DIVISOR = 10000; // earn 1 point for every Rp 10.000 spent

function loadStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(`ondeway_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Failed to load ${key} from localStorage`, e);
    return defaultValue;
  }
}

function saveStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`ondeway_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key} to localStorage`, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('ondeway_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem('ondeway_theme', theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [activeTab, setActiveTab] = useState<string>('pos');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Core collections
  const [outlets] = useState<Outlet[]>(INITIAL_OUTLETS);
  const [currentOutlet, setCurrentOutlet] = useState<Outlet>(() => outlets[0]);
  const [cashierName, setCashierName] = useState<string>('Rian Pratama');

  const [materials, setMaterials] = useState<RawMaterial[]>(() =>
    loadStorage('materials', INITIAL_MATERIALS)
  );
  const [products, setProducts] = useState<Product[]>(() =>
    loadStorage('products', INITIAL_PRODUCTS)
  );
  const [recipes, setRecipes] = useState<Recipe[]>(() =>
    loadStorage('recipes', INITIAL_RECIPES)
  );
  const [roastingBatches, setRoastingBatches] = useState<RoastingBatch[]>(() =>
    loadStorage('roasting_batches', INITIAL_ROASTING_BATCHES)
  );
  const [customers, setCustomers] = useState<Customer[]>(() =>
    loadStorage('customers', INITIAL_CUSTOMERS)
  );
  const [promos, setPromos] = useState<PromoVoucher[]>(() =>
    loadStorage('promos', INITIAL_PROMOS)
  );
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    loadStorage('transactions', INITIAL_TRANSACTIONS)
  );
  const [shifts, setShifts] = useState<CashierShift[]>(() =>
    loadStorage('shifts', INITIAL_SHIFTS)
  );
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() =>
    loadStorage('attendance', INITIAL_ATTENDANCE)
  );
  const [employees, setEmployees] = useState<Employee[]>(() =>
    loadStorage('employees', INITIAL_EMPLOYEES)
  );
  const [courses, setCourses] = useState<LMSCourse[]>(() =>
    loadStorage('courses', INITIAL_COURSES)
  );
  const [sops, setSops] = useState<SOPDocument[]>(() =>
    loadStorage('sops', INITIAL_SOPS)
  );
  const [bsc] = useState<BSCPerspective[]>(INITIAL_BSC);
  const [okrs] = useState<OKRItem[]>(INITIAL_OKRS);
  const [raci] = useState<RACIRow[]>(INITIAL_RACI);
  const [orgChart, setOrgChart] = useState<OrgNode>(() =>
    loadStorage('org_chart', INITIAL_ORG_CHART)
  );

  // Save to localStorage when state updates
  useEffect(() => saveStorage('materials', materials), [materials]);
  useEffect(() => saveStorage('products', products), [products]);
  useEffect(() => saveStorage('recipes', recipes), [recipes]);
  useEffect(() => saveStorage('roasting_batches', roastingBatches), [roastingBatches]);
  useEffect(() => saveStorage('customers', customers), [customers]);
  useEffect(() => saveStorage('promos', promos), [promos]);
  useEffect(() => saveStorage('transactions', transactions), [transactions]);
  useEffect(() => saveStorage('shifts', shifts), [shifts]);
  useEffect(() => saveStorage('attendance', attendance), [attendance]);
  useEffect(() => saveStorage('employees', employees), [employees]);
  useEffect(() => saveStorage('courses', courses), [courses]);
  useEffect(() => saveStorage('sops', sops), [sops]);
  useEffect(() => saveStorage('org_chart', orgChart), [orgChart]);

  // Current active open shift
  const currentShift = shifts.find(s => s.status === 'open') || null;

  // Cart & POS state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [orderType, setOrderType] = useState<OrderType>('dine_in');
  const [tableNumber, setTableNumber] = useState<string>('01');
  const [activePromo, setActivePromo] = useState<PromoVoucher | null>(null);
  const [pointsToUse, setPointsToUse] = useState<number>(0);

  // Dynamic price resolver based on customer tier
  const getProductPriceForCustomer = (product: Product, cust: Customer | null): number => {
    if (!cust) return product.priceRetail;
    if (cust.type === 'b2b') {
      if (cust.tier === 'distributor' && product.priceDistributor) return product.priceDistributor;
      if (cust.tier === 'grosir' && product.priceGrosir) return product.priceGrosir;
    }
    return product.priceRetail;
  };

  // Live HPP calculator for a product from its recipe
  const calculateProductHPP = (productId: string): number => {
    const recipe = recipes.find(r => r.productId === productId);
    if (!recipe || !recipe.ingredients.length) {
      const prod = products.find(p => p.id === productId);
      return prod?.costHPP || 5000;
    }
    let totalCost = 0;
    for (const ing of recipe.ingredients) {
      const mat = materials.find(m => m.id === ing.materialId);
      if (mat) {
        totalCost += ing.amount * mat.costPerUnit;
      }
    }
    return Math.round(totalCost);
  };

  // Keep product base HPP up to date if materials changed
  useEffect(() => {
    setProducts(prev =>
      prev.map(p => {
        const hpp = calculateProductHPP(p.id);
        return p.costHPP !== hpp ? { ...p, costHPP: hpp } : p;
      })
    );
  }, [materials, recipes]);

  // Cart actions
  const addToCart = (product: Product, variant?: ProductVariantOption, note?: string) => {
    const v = variant || { ice: 'Normal Ice', sugar: 'Normal Sweet (100%)' };
    let extraCost = 0;
    if (v.milk === 'Oat Milk (+Rp 7.000)') extraCost += 7000;
    if (v.milk === 'Almond Milk (+Rp 8.000)') extraCost += 8000;
    if (v.extraShot) extraCost += 5000;

    const basePrice = getProductPriceForCustomer(product, selectedCustomer);
    const unitPrice = basePrice;
    const totalPrice = (unitPrice + extraCost) * 1;
    const costHPP = calculateProductHPP(product.id);

    // Look for duplicate item with same variant and note
    setCart(prev => {
      const existingIdx = prev.findIndex(
        i =>
          i.product.id === product.id &&
          JSON.stringify(i.variant) === JSON.stringify(v) &&
          (i.note || '') === (note || '')
      );

      if (existingIdx !== -1) {
        const next = [...prev];
        const item = next[existingIdx];
        const newQty = item.qty + 1;
        next[existingIdx] = {
          ...item,
          qty: newQty,
          totalPrice: (item.unitPrice + item.extraCost) * newQty,
        };
        return next;
      }

      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        product,
        qty: 1,
        variant: v,
        note: note || '',
        unitPrice,
        extraCost,
        totalPrice,
        costHPP,
      };
      return [...prev, newItem];
    });
  };

  // Recalculate prices if customer changes (B2B wholesale vs retail)
  useEffect(() => {
    if (!cart.length) return;
    setCart(prev =>
      prev.map(item => {
        const newUnitPrice = getProductPriceForCustomer(item.product, selectedCustomer);
        return {
          ...item,
          unitPrice: newUnitPrice,
          totalPrice: (newUnitPrice + item.extraCost) * item.qty,
        };
      })
    );
    // Reset points if customer has no points
    if (!selectedCustomer || selectedCustomer.points <= 0) {
      setPointsToUse(0);
    } else if (pointsToUse > selectedCustomer.points) {
      setPointsToUse(selectedCustomer.points);
    }
  }, [selectedCustomer]);

  const updateCartItemQty = (index: number, delta: number) => {
    setCart(prev => {
      const next = [...prev];
      const item = next[index];
      if (!item) return prev;
      const newQty = item.qty + delta;
      if (newQty <= 0) {
        return next.filter((_, idx) => idx !== index);
      }
      next[index] = {
        ...item,
        qty: newQty,
        totalPrice: (item.unitPrice + item.extraCost) * newQty,
      };
      return next;
    });
  };

  const removeCartItem = (index: number) => {
    setCart(prev => prev.filter((_, idx) => idx !== index));
  };

  const clearCart = () => {
    setCart([]);
    setActivePromo(null);
    setPointsToUse(0);
  };

  // Cart calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartTotalHPP = cart.reduce((sum, item) => sum + item.costHPP * item.qty, 0);

  // Promo discount calculation
  let promoDiscount = 0;
  if (activePromo && cartSubtotal >= activePromo.minOrder) {
    if (activePromo.type === 'percent') {
      const disc = Math.round((cartSubtotal * activePromo.value) / 100);
      promoDiscount = activePromo.maxDiscount ? Math.min(disc, activePromo.maxDiscount) : disc;
    } else {
      promoDiscount = Math.min(activePromo.value, cartSubtotal);
    }
  }

  // Points discount calculation
  const maxAllowablePoints = selectedCustomer ? selectedCustomer.points : 0;
  const validPoints = Math.min(pointsToUse, maxAllowablePoints);
  const calculatedPointsDiscount = validPoints * POINT_VALUE_RUPIAH;
  const pointsDiscount = Math.min(calculatedPointsDiscount, Math.max(0, cartSubtotal - promoDiscount));

  const cartTotal = Math.max(0, cartSubtotal - promoDiscount - pointsDiscount);
  // B2C customer earns points on actual amount spent (excluding points deduction)
  const pointsEarned =
    selectedCustomer && selectedCustomer.type === 'b2c'
      ? Math.floor(cartTotal / POINT_EARN_DIVISOR)
      : 0;

  const applyPromoCode = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const found = promos.find(p => p.code.toUpperCase() === trimmed && p.active);
    if (!found) {
      return { success: false, message: 'Kode promo tidak ditemukan atau sudah nonaktif.' };
    }
    if (cartSubtotal < found.minOrder) {
      return {
        success: false,
        message: `Minimal belanja untuk promo ini adalah Rp ${found.minOrder.toLocaleString('id-ID')}`,
      };
    }
    if (found.usedCount >= found.quota) {
      return { success: false, message: 'Kuota promo ini telah habis.' };
    }
    if (found.applicableType === 'b2b' && selectedCustomer?.type !== 'b2b') {
      return { success: false, message: 'Promo ini khusus untuk mitra pelanggan B2B.' };
    }
    if (found.applicableType === 'b2c' && selectedCustomer?.type === 'b2b') {
      return { success: false, message: 'Promo ini khusus untuk pelanggan ritel / B2C.' };
    }

    setActivePromo(found);
    return { success: true, message: `Promo "${found.name}" berhasil diterapkan!` };
  };

  const removePromo = () => {
    setActivePromo(null);
  };

  // Checkout process with full integrations:
  // 1. Deducts raw material stock in real time based on recipes!
  // 2. Adjusts customer points and lifetime total spend
  // 3. Updates promo voucher used count
  // 4. Records transaction with HPP & Gross Profit
  // 5. Appends to current cashier shift sales ledger
  const completeTransaction = ({
    paymentMethod,
    cashGiven,
    qrisRef,
    debitRef,
    tempoDueDate,
  }: {
    paymentMethod: PaymentMethod;
    cashGiven?: number;
    qrisRef?: string;
    debitRef?: string;
    tempoDueDate?: string;
  }): Transaction => {
    if (!cart.length) throw new Error('Keranjang belanja kosong');

    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);
    const invoiceSeq = (transactions.length + 1).toString().padStart(3, '0');
    const invoiceNo = `ODW-${now.getFullYear().toString().substring(2)}${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${invoiceSeq}`;

    // 1. Inventory deduction according to recipes
    const materialsUpdateMap: Record<string, number> = {};
    cart.forEach(item => {
      const recipe = recipes.find(r => r.productId === item.product.id);
      if (recipe && recipe.ingredients.length) {
        recipe.ingredients.forEach(ing => {
          materialsUpdateMap[ing.materialId] =
            (materialsUpdateMap[ing.materialId] || 0) + ing.amount * item.qty;
        });
      }
      // If customer requested Oat Milk variant, deduct extra oat milk
      if (item.variant.milk === 'Oat Milk (+Rp 7.000)') {
        materialsUpdateMap['mat-7'] = (materialsUpdateMap['mat-7'] || 0) + 150 * item.qty;
      }
      // If customer requested extra espresso shot, deduct 18g espresso blend
      if (item.variant.extraShot) {
        materialsUpdateMap['mat-4'] = (materialsUpdateMap['mat-4'] || 0) + 18 * item.qty;
      }
    });

    // Apply deductions to materials state
    setMaterials(prev =>
      prev.map(mat => {
        const used = materialsUpdateMap[mat.id];
        if (used) {
          return {
            ...mat,
            stock: Math.max(0, mat.stock - used),
          };
        }
        return mat;
      })
    );

    // 2. Customer updates (points & spend)
    if (selectedCustomer) {
      setCustomers(prev =>
        prev.map(c => {
          if (c.id === selectedCustomer.id) {
            const nextPoints = Math.max(0, c.points - validPoints) + pointsEarned;
            const nextSpend = c.totalSpend + cartTotal;
            const nextDebt =
              paymentMethod === 'tempo' ? (c.currentDebt || 0) + cartTotal : c.currentDebt;
            return {
              ...c,
              points: nextPoints,
              totalSpend: nextSpend,
              currentDebt: nextDebt,
            };
          }
          return c;
        })
      );
    }

    // 3. Promo counter
    if (activePromo) {
      setPromos(prev =>
        prev.map(p => (p.code === activePromo.code ? { ...p, usedCount: p.usedCount + 1 } : p))
      );
    }

    // 4. Create Transaction record
    const changeGiven =
      paymentMethod === 'cash' && cashGiven ? Math.max(0, cashGiven - cartTotal) : 0;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      invoiceNo,
      date: dateStr,
      outletId: currentOutlet.id,
      outletName: currentOutlet.name,
      customerId: selectedCustomer?.id,
      customerName: selectedCustomer ? selectedCustomer.name : 'Pelanggan Umum Walk-In',
      customerType: selectedCustomer?.type || 'b2c',
      customerTier: selectedCustomer?.tier || 'retail',
      items: cart.map(i => ({
        productId: i.product.id,
        code: i.product.code,
        name: i.product.name,
        category: i.product.category,
        qty: i.qty,
        unitPrice: i.unitPrice,
        extraCost: i.extraCost,
        totalPrice: i.totalPrice,
        costHPP: i.costHPP * i.qty,
        variant: i.variant,
        note: i.note,
      })),
      subtotal: cartSubtotal,
      promoCode: activePromo?.code,
      promoDiscount,
      pointsUsed: validPoints,
      pointsDiscount,
      pointsEarned,
      total: cartTotal,
      paymentMethod,
      cashGiven: paymentMethod === 'cash' ? cashGiven : undefined,
      changeGiven: paymentMethod === 'cash' ? changeGiven : undefined,
      qrisRef: paymentMethod === 'qris' ? qrisRef || `QRIS-${Date.now().toString().slice(-6)}` : undefined,
      debitCardRef: paymentMethod === 'debit' ? debitRef || `DEBIT-${Date.now().toString().slice(-6)}` : undefined,
      tempoDueDate: paymentMethod === 'tempo' ? tempoDueDate || '2026-11-20' : undefined,
      orderType,
      tableNumber: orderType === 'dine_in' ? tableNumber : undefined,
      status: 'completed',
      cashierName,
      totalHPP: cartTotalHPP,
      grossProfit: cartTotal - cartTotalHPP,
    };

    setTransactions(prev => [newTx, ...prev]);

    // 5. Update active Shift
    if (currentShift) {
      setShifts(prev =>
        prev.map(s => {
          if (s.id === currentShift.id) {
            const addCash = paymentMethod === 'cash' ? cartTotal : 0;
            const addQris = paymentMethod === 'qris' ? cartTotal : 0;
            const addDebit = paymentMethod === 'debit' ? cartTotal : 0;
            const addTempo = paymentMethod === 'tempo' ? cartTotal : 0;
            const updatedExpectedCash = s.expectedCashTotal + addCash;

            return {
              ...s,
              totalCashSales: s.totalCashSales + addCash,
              totalQrisSales: s.totalQrisSales + addQris,
              totalDebitSales: s.totalDebitSales + addDebit,
              totalTempoSales: s.totalTempoSales + addTempo,
              expectedCashTotal: updatedExpectedCash,
            };
          }
          return s;
        })
      );
    }

    // Reset cart
    clearCart();
    return newTx;
  };

  // Void transaction: Reverses raw material inventory & customer loyalty points
  const voidTransaction = (txId: string, reason: string) => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx || tx.status === 'voided') return;

    // 1. Reverse inventory
    const materialsReversalMap: Record<string, number> = {};
    tx.items.forEach(item => {
      const recipe = recipes.find(r => r.productId === item.productId);
      if (recipe) {
        recipe.ingredients.forEach(ing => {
          materialsReversalMap[ing.materialId] =
            (materialsReversalMap[ing.materialId] || 0) + ing.amount * item.qty;
        });
      }
    });

    setMaterials(prev =>
      prev.map(mat => {
        const returned = materialsReversalMap[mat.id];
        return returned ? { ...mat, stock: mat.stock + returned } : mat;
      })
    );

    // 2. Reverse customer points
    if (tx.customerId) {
      setCustomers(prev =>
        prev.map(c => {
          if (c.id === tx.customerId) {
            return {
              ...c,
              points: Math.max(0, c.points + tx.pointsUsed - tx.pointsEarned),
              totalSpend: Math.max(0, c.totalSpend - tx.total),
              currentDebt:
                tx.paymentMethod === 'tempo'
                  ? Math.max(0, (c.currentDebt || 0) - tx.total)
                  : c.currentDebt,
            };
          }
          return c;
        })
      );
    }

    // 3. Mark transaction as voided
    setTransactions(prev =>
      prev.map(t => (t.id === txId ? { ...t, status: 'voided', voidReason: reason } : t))
    );
  };

  // Inventory & Roasting actions
  const adjustMaterialStock = (materialId: string, delta: number, reason: string) => {
    setMaterials(prev =>
      prev.map(m => {
        if (m.id === materialId) {
          const newStock = Math.max(0, m.stock + delta);
          return {
            ...m,
            stock: newStock,
            lastRestocked: delta > 0 ? new Date().toISOString().slice(0, 10) : m.lastRestocked,
          };
        }
        return m;
      })
    );
  };

  const addRawMaterial = (material: Omit<RawMaterial, 'id'>) => {
    const newId = `mat-${Date.now()}`;
    setMaterials(prev => [...prev, { ...material, id: newId }]);
  };

  const updateRawMaterial = (id: string, updates: Partial<RawMaterial>) => {
    setMaterials(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
  };

  // Record Roasting Batch:
  // - Deducts Green Bean (kg) from inventory
  // - Adds Roasted Bean (gram) to inventory!
  const addRoastingBatch = (batchData: Omit<RoastingBatch, 'id'>) => {
    const newId = `roast-${Date.now()}`;
    const newBatch: RoastingBatch = { ...batchData, id: newId };
    setRoastingBatches(prev => [newBatch, ...prev]);

    // Deduct green bean
    adjustMaterialStock(batchData.greenBeanId, -batchData.greenWeightKg, `Roasting Batch ${batchData.batchNumber}`);

    // Add roasted bean (convert kg to grams if needed)
    // Find matching roasted bean material or update Ondeway House Blend
    const roastedMaterial = materials.find(m => m.category === 'roasted_bean');
    if (roastedMaterial) {
      const addedGrams = batchData.roastedWeightKg * 1000;
      adjustMaterialStock(roastedMaterial.id, addedGrams, `Hasil Sangrai Batch ${batchData.batchNumber}`);
    }
  };

  const updateRecipe = (recipeId: string, ingredients: Recipe['ingredients']) => {
    setRecipes(prev =>
      prev.map(r => (r.id === recipeId ? { ...r, ingredients } : r))
    );
  };

  const addProduct = (prod: Omit<Product, 'id'>) => {
    const newId = `prod-${Date.now()}`;
    setProducts(prev => [...prev, { ...prod, id: newId }]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Employee actions
  const addEmployee = (emp: Omit<Employee, 'id'>) => {
    const newId = `emp-${Date.now()}`;
    const newEmp: Employee = { ...emp, id: newId };
    setEmployees(prev => [newEmp, ...prev]);
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  };

  // Org chart actions
  const updateOrgChart = (chart: OrgNode) => {
    setOrgChart(chart);
  };

  const addOrgNodeChild = (parentId: string, node: Omit<OrgNode, 'id'>) => {
    const newId = `org-${Date.now()}`;
    const newNode: OrgNode = { ...node, id: newId };

    const insertRecursive = (current: OrgNode): OrgNode => {
      if (current.id === parentId) {
        return {
          ...current,
          children: [...(current.children || []), newNode],
        };
      }
      if (current.children && current.children.length > 0) {
        return {
          ...current,
          children: current.children.map(insertRecursive),
        };
      }
      return current;
    };

    setOrgChart(prev => insertRecursive(prev));
  };

  const deleteOrgNode = (nodeId: string) => {
    const removeRecursive = (current: OrgNode): OrgNode => {
      if (!current.children) return current;
      return {
        ...current,
        children: current.children
          .filter(c => c.id !== nodeId)
          .map(removeRecursive),
      };
    };

    setOrgChart(prev => (prev.id === nodeId ? prev : removeRecursive(prev)));
  };

  const addCustomer = (cust: Omit<Customer, 'id' | 'points' | 'totalSpend' | 'joinDate'>): Customer => {
    const newCustomer: Customer = {
      ...cust,
      id: `cust-${Date.now()}`,
      points: 0,
      totalSpend: 0,
      joinDate: new Date().toISOString().slice(0, 10),
    };
    setCustomers(prev => [...prev, newCustomer]);
    return newCustomer;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const addPromo = (promo: PromoVoucher) => {
    setPromos(prev => [...prev, promo]);
  };

  // Shift & Cash Drawer
  const closeCashDrawer = (actualCash: number, notes?: string) => {
    if (!currentShift) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const variance = actualCash - currentShift.expectedCashTotal;

    setShifts(prev =>
      prev.map(s => {
        if (s.id === currentShift.id) {
          return {
            ...s,
            closedAt: now,
            actualCashTotal: actualCash,
            cashVariance: variance,
            status: 'closed',
            notes: notes || s.notes,
          };
        }
        return s;
      })
    );
  };

  const openNewShift = (shiftName: CashierShift['shiftName'], initialFloat: number) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newShift: CashierShift = {
      id: `shift-${Date.now()}`,
      employeeName: cashierName,
      role: 'Lead Cashier & Barista',
      outletId: currentOutlet.id,
      shiftName,
      openedAt: now,
      initialFloat,
      totalCashSales: 0,
      totalQrisSales: 0,
      totalDebitSales: 0,
      totalTempoSales: 0,
      expectedCashTotal: initialFloat,
      status: 'open',
      notes: 'Buka kasir baru',
    };
    setShifts(prev => [newShift, ...prev]);
  };

  const clockInAttendance = (employeeName: string, role: string, shift: string) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const dateStr = now.toISOString().slice(0, 10);

    const isLate = now.getHours() > 7 || (now.getHours() === 7 && now.getMinutes() > 0);
    const status = isLate ? 'Terlambat' : 'Hadir Tepat Waktu';

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      employeeName,
      role,
      date: dateStr,
      clockIn: timeStr,
      shift,
      status,
      outlet: currentOutlet.name,
    };
    setAttendance(prev => [newRecord, ...prev]);
  };

  const clockOutAttendance = (id: string) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setAttendance(prev =>
      prev.map(a => (a.id === id ? { ...a, clockOut: timeStr } : a))
    );
  };

  // LMS & SOP operations
  const enrollEmployeeInCourse = (courseId: string, employeeName: string) => {
    setCourses(prev =>
      prev.map(c => {
        if (c.id === courseId && !c.enrolledEmployees.includes(employeeName)) {
          return {
            ...c,
            enrolledEmployees: [...c.enrolledEmployees, employeeName],
          };
        }
        return c;
      })
    );
  };

  const submitCourseQuiz = (
    courseId: string,
    employeeName: string,
    score: number
  ): { passed: boolean; certificateNo?: string } => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return { passed: false };

    const passed = score >= course.passingScorePercent;
    let certNo: string | undefined = undefined;

    if (passed) {
      certNo = `ODW-CERT-2026-${(course.completedEmployees.length + 1).toString().padStart(3, '0')}`;
      const nowStr = new Date().toISOString().slice(0, 10);

      setCourses(prev =>
        prev.map(c => {
          if (c.id === courseId) {
            const alreadyCompleted = c.completedEmployees.some(e => e.employeeName === employeeName);
            const updatedCompleted = alreadyCompleted
              ? c.completedEmployees.map(e =>
                  e.employeeName === employeeName ? { ...e, score, completedAt: nowStr } : e
                )
              : [
                  ...c.completedEmployees,
                  {
                    employeeName,
                    completedAt: nowStr,
                    score,
                    certificateNo: certNo!,
                  },
                ];

            return {
              ...c,
              completedEmployees: updatedCompleted,
            };
          }
          return c;
        })
      );
    }

    return { passed, certificateNo: certNo };
  };

  const addCourseMaterial = (courseId: string, material: Omit<LMSMaterial, 'id'>) => {
    const newId = `mat-${Date.now()}`;
    setCourses(prev =>
      prev.map(c => {
        if (c.id === courseId) {
          return {
            ...c,
            materials: [...c.materials, { ...material, id: newId }],
          };
        }
        return c;
      })
    );
  };

  const createCourse = (course: Omit<LMSCourse, 'id'>) => {
    const newId = `course-${Date.now()}`;
    setCourses(prev => [...prev, { ...course, id: newId }]);
  };

  const createSop = (sop: Omit<SOPDocument, 'id'>) => {
    const newId = `sop-${Date.now()}`;
    setSops(prev => [
      {
        ...sop,
        id: newId,
        lastUpdated: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
  };

  const resetAllData = () => {
    setMaterials(INITIAL_MATERIALS);
    setProducts(INITIAL_PRODUCTS);
    setRecipes(INITIAL_RECIPES);
    setRoastingBatches(INITIAL_ROASTING_BATCHES);
    setCustomers(INITIAL_CUSTOMERS);
    setPromos(INITIAL_PROMOS);
    setTransactions(INITIAL_TRANSACTIONS);
    setShifts(INITIAL_SHIFTS);
    setAttendance(INITIAL_ATTENDANCE);
    setEmployees(INITIAL_EMPLOYEES);
    setCourses(INITIAL_COURSES);
    setSops(INITIAL_SOPS);
    setOrgChart(INITIAL_ORG_CHART);
    clearCart();
    setSelectedCustomer(null);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        sidebarOpen,
        setSidebarOpen,
        currentOutlet,
        setCurrentOutlet,
        cashierName,
        setCashierName,
        outlets,
        materials,
        products,
        recipes,
        roastingBatches,
        customers,
        promos,
        transactions,
        shifts,
        currentShift,
        attendance,
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        bsc,
        okrs,
        raci,
        orgChart,
        updateOrgChart,
        addOrgNodeChild,
        deleteOrgNode,
        courses,
        sops,
        enrollEmployeeInCourse,
        submitCourseQuiz,
        addCourseMaterial,
        createCourse,
        createSop,
        cart,
        selectedCustomer,
        setSelectedCustomer,
        orderType,
        setOrderType,
        tableNumber,
        setTableNumber,
        activePromo,
        pointsToUse,
        setPointsToUse,
        addToCart,
        updateCartItemQty,
        removeCartItem,
        clearCart,
        applyPromoCode,
        removePromo,
        cartSubtotal,
        promoDiscount,
        pointsDiscount,
        cartTotal,
        pointsEarned,
        cartTotalHPP,
        completeTransaction,
        voidTransaction,
        adjustMaterialStock,
        addRawMaterial,
        updateRawMaterial,
        addRoastingBatch,
        updateRecipe,
        calculateProductHPP,
        addProduct,
        updateProduct,
        deleteProduct,
        addCustomer,
        updateCustomer,
        addPromo,
        closeCashDrawer,
        openNewShift,
        clockInAttendance,
        clockOutAttendance,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
