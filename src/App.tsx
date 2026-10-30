/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { PosTerminal } from './components/pos/PosTerminal';
import { TransactionList } from './components/transactions/TransactionList';
import { InventoryManagement } from './components/inventory/InventoryManagement';
import { RecipeHppCalculator } from './components/recipes/RecipeHppCalculator';
import { RoasteryBatches } from './components/roastery/RoasteryBatches';
import { FinanceDashboard } from './components/finance/FinanceDashboard';
import { AttendanceShift } from './components/attendance/AttendanceShift';
import { CustomerList } from './components/customers/CustomerList';
import { PromoList } from './components/promos/PromoList';
import { StrategicDashboard } from './components/strategy/StrategicDashboard';
import { DesignSystemGuide } from './components/design/DesignSystemGuide';
import { LMSAcademy } from './components/lms/LMSAcademy';
import { MenuMasterData } from './components/menu/MenuMasterData';
import { EmployeeManagement } from './components/employees/EmployeeManagement';
import { OrgStructureView } from './components/organization/OrgStructureView';

import { DigitalReceiptModal } from './components/pos/DigitalReceiptModal';

const MainContent: React.FC = () => {
  const { activeTab, transactions } = useApp();
  const [scannedTx, setScannedTx] = React.useState<any>(null);

  // Auto-detect ?receipt= in URL query params when scanned
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invoiceQuery = params.get('receipt');
    if (invoiceQuery && transactions.length > 0) {
      const found = transactions.find(t => t.invoiceNo === invoiceQuery);
      if (found) {
        setScannedTx(found);
      }
    }
  }, [transactions]);

  return (
    <main className="flex-1 min-w-0 p-4 md:p-6 lg:ml-64 bg-[#fdf8f0]/40 dark:bg-[#140f0c] text-[#2a1a15] dark:text-[#fdf8f0] transition-colors min-h-[calc(100vh-4rem)]">
      {activeTab === 'pos' && <PosTerminal />}
      {activeTab === 'menu' && <MenuMasterData />}
      {activeTab === 'transactions' && <TransactionList />}
      {activeTab === 'inventory' && <InventoryManagement />}
      {activeTab === 'recipes' && <RecipeHppCalculator />}
      {activeTab === 'roastery' && <RoasteryBatches />}
      {activeTab === 'finance' && <FinanceDashboard />}
      {activeTab === 'attendance' && <AttendanceShift />}
      {activeTab === 'employees' && <EmployeeManagement />}
      {activeTab === 'lms' && <LMSAcademy />}
      {activeTab === 'customers' && <CustomerList />}
      {activeTab === 'promos' && <PromoList />}
      {activeTab === 'strategy' && <StrategicDashboard />}
      {activeTab === 'org_structure' && <OrgStructureView />}
      {activeTab === 'raci_org' && <OrgStructureView />}
      {activeTab === 'design' && <DesignSystemGuide />}

      {/* Scanned QR digital receipt & feedback form modal */}
      {scannedTx && (
        <DigitalReceiptModal
          transaction={scannedTx}
          isOpen={!!scannedTx}
          onClose={() => {
            setScannedTx(null);
            const url = new URL(window.location.href);
            url.searchParams.delete('receipt');
            window.history.replaceState({}, '', url.pathname + url.search);
          }}
        />
      )}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col font-sans bg-[#fdf8f0] dark:bg-[#140f0c] antialiased text-[#2a1a15] dark:text-[#fdf8f0] selection:bg-[#c1352d]/20 selection:text-[#c1352d]">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <MainContent />
        </div>
      </div>
    </AppProvider>
  );
}
