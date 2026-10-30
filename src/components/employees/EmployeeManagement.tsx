import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Award,
  Phone,
  Mail,
  Building,
  CreditCard,
  UserCheck,
  ShieldCheck,
  Printer,
  X,
  Eye,
  EyeOff,
  Sparkles,
  Calendar,
  AlertTriangle,
  GraduationCap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Employee } from '../../types';

const DEPARTMENTS: Employee['department'][] = [
  'Front of House',
  'Roastery & Quality Lab',
  'Kitchen & Pastry',
  'Finance & Admin',
  'Executive Board',
];

const EMPLOYMENT_STATUSES: Employee['employmentStatus'][] = [
  'Tetap',
  'Kontrak',
  'Probation',
  'Part-time',
];

export const EmployeeManagement: React.FC = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee, courses } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showSalary, setShowSalary] = useState(false);

  // Modals
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
  const [viewingEmpProfile, setViewingEmpProfile] = useState<Employee | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nik: '',
    name: '',
    role: '',
    department: 'Front of House' as Employee['department'],
    employmentStatus: 'Tetap' as Employee['employmentStatus'],
    joinDate: new Date().toISOString().slice(0, 10),
    email: '',
    phone: '',
    baseSalary: 5500000,
    attendanceAllowance: 800000,
    outletId: 'out-1',
    outletName: 'Ondeway Roastery & Cafe (Pusat)',
    bankName: 'BCA',
    accountNumber: '',
    accountHolder: '',
    certificationsStr: 'Ondeway Barista Foundation (LMS-01)',
    emergencyName: '',
    emergencyRelation: 'Keluarga',
    emergencyPhone: '',
    status: 'active' as Employee['status'],
  });

  // Summary Metrics
  const totalEmployees = employees.length;
  const permanentCount = employees.filter(e => e.employmentStatus === 'Tetap').length;
  const contractCount = employees.filter(e => e.employmentStatus === 'Kontrak' || e.employmentStatus === 'Probation').length;
  
  const totalPayrollEstimate = useMemo(() => {
    return employees.reduce((acc, e) => acc + (e.baseSalary || 0) + (e.attendanceAllowance || 0), 0);
  }, [employees]);

  const certifiedCount = employees.filter(e => e.certifications && e.certifications.length > 0).length;

  // Filtered
  const filteredEmployees = useMemo(() => {
    return employees.filter(e => {
      const matchSearch =
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.nik.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDept = selectedDept === 'all' || e.department === selectedDept;
      const matchStatus = selectedStatus === 'all' || e.employmentStatus === selectedStatus;
      return matchSearch && matchDept && matchStatus;
    });
  }, [employees, searchQuery, selectedDept, selectedStatus]);

  const handleOpenAdd = () => {
    setEditingEmp(null);
    const nextNikNumber = (employees.length + 1).toString().padStart(3, '0');
    setFormData({
      nik: `EMP-ODW-${nextNikNumber}`,
      name: '',
      role: '',
      department: 'Front of House',
      employmentStatus: 'Tetap',
      joinDate: new Date().toISOString().slice(0, 10),
      email: '',
      phone: '',
      baseSalary: 5200000,
      attendanceAllowance: 800000,
      outletId: 'out-1',
      outletName: 'Ondeway Roastery & Cafe (Pusat)',
      bankName: 'BCA',
      accountNumber: '',
      accountHolder: '',
      certificationsStr: 'Ondeway Barista Foundation (LMS-01)',
      emergencyName: '',
      emergencyRelation: 'Orang Tua / Pasangan',
      emergencyPhone: '',
      status: 'active',
    });
    setShowAddEditModal(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditingEmp(emp);
    setFormData({
      nik: emp.nik,
      name: emp.name,
      role: emp.role,
      department: emp.department,
      employmentStatus: emp.employmentStatus,
      joinDate: emp.joinDate,
      email: emp.email,
      phone: emp.phone,
      baseSalary: emp.baseSalary,
      attendanceAllowance: emp.attendanceAllowance,
      outletId: emp.outletId,
      outletName: emp.outletName,
      bankName: emp.bankAccount?.bankName || 'BCA',
      accountNumber: emp.bankAccount?.accountNumber || '',
      accountHolder: emp.bankAccount?.accountHolder || emp.name,
      certificationsStr: (emp.certifications || []).join(', '),
      emergencyName: emp.emergencyContact?.name || '',
      emergencyRelation: emp.emergencyContact?.relation || 'Keluarga',
      emergencyPhone: emp.emergencyContact?.phone || '',
      status: emp.status,
    });
    setShowAddEditModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.nik.trim()) return;

    const certsArray = formData.certificationsStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const empPayload = {
      nik: formData.nik,
      name: formData.name,
      role: formData.role,
      department: formData.department,
      employmentStatus: formData.employmentStatus,
      joinDate: formData.joinDate,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '')}@ondeway.co.id`,
      phone: formData.phone || '081200000000',
      baseSalary: Number(formData.baseSalary),
      attendanceAllowance: Number(formData.attendanceAllowance),
      outletId: formData.outletId,
      outletName: formData.outletName,
      bankAccount: {
        bankName: formData.bankName,
        accountNumber: formData.accountNumber || '-',
        accountHolder: formData.accountHolder || formData.name,
      },
      certifications: certsArray,
      emergencyContact: {
        name: formData.emergencyName || '-',
        relation: formData.emergencyRelation || '-',
        phone: formData.emergencyPhone || '-',
      },
      status: formData.status,
    };

    if (editingEmp) {
      updateEmployee(editingEmp.id, empPayload);
    } else {
      addEmployee(empPayload);
    }
    setShowAddEditModal(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Hapus data karyawan "${name}" dari sistem?`)) {
      deleteEmployee(id);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'NIK,Nama Lengkap,Jabatan,Departemen,Status Kerja,Tgl Bergabung,Email,Telepon,Gaji Pokok,Tunjangan,Bank,No Rekening,Sertifikasi',
    ];
    const rows = employees.map(e => {
      const certs = (e.certifications || []).join('; ');
      return `"${e.nik}","${e.name.replace(/"/g, '""')}","${e.role}","${e.department}","${e.employmentStatus}","${e.joinDate}","${e.email}","${e.phone}",${e.baseSalary},${e.attendanceAllowance},"${e.bankAccount?.bankName || '-'}","${e.bankAccount?.accountNumber || '-'}","${certs}"`;
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Master_Data_Karyawan_Ondeway_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printIDCard = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-[#c1352d]/15 via-[#cf7440]/10 to-transparent p-5 rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#c1352d] uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Human Resource Management · Ondeway OS</span>
          </div>
          <h2 className="text-xl font-black text-[#2a1a15] dark:text-[#fdf8f0]">
            Master Data Karyawan & Manajemen SDM
          </h2>
          <p className="text-xs text-[#7a5c4b] dark:text-[#edd6b4]/80 mt-1 max-w-2xl leading-relaxed">
            Database profil staf, Nomor Induk Karyawan (NIK), departemen kerja, status kepegawaian (Tetap/Kontrak), kompensasi gaji pokok, serta sertifikasi keahlian barista dan roastery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 bg-white/60 dark:bg-[#201712]/60 hover:bg-white dark:hover:bg-[#251b16] text-xs font-bold text-[#2a1a15] dark:text-[#fdf8f0] flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-[#c1352d]" />
            <span>Ekspor CSV</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-[#c1352d] text-white hover:bg-[#a92b24] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Karyawan Baru</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-[#fffdf9] dark:bg-[#1e1612] p-4 rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#c1352d]/10 text-[#c1352d] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#2a1a15] dark:text-[#fdf8f0]">
              {totalEmployees}
            </div>
            <div className="text-[11px] font-semibold text-gray-500">
              Total Staf Aktif
            </div>
          </div>
        </div>

        <div className="bg-[#fffdf9] dark:bg-[#1e1612] p-4 rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
              {permanentCount} <span className="text-xs font-normal text-gray-400">/ {contractCount}</span>
            </div>
            <div className="text-[11px] font-semibold text-gray-500">
              Staf Tetap / Kontrak
            </div>
          </div>
        </div>

        <div className="bg-[#fffdf9] dark:bg-[#1e1612] p-4 rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black text-[#2a1a15] dark:text-[#fdf8f0] truncate">
                {showSalary
                  ? `Rp ${(totalPayrollEstimate / 1000000).toFixed(1)} Jt`
                  : 'Rp ••••••••'}
              </span>
              <button
                type="button"
                onClick={() => setShowSalary(!showSalary)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showSalary ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="text-[11px] font-semibold text-gray-500">
              Estimasi Payroll Bulanan
            </div>
          </div>
        </div>

        <div className="bg-[#fffdf9] dark:bg-[#1e1612] p-4 rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-purple-700 dark:text-purple-400">
              {certifiedCount}
            </div>
            <div className="text-[11px] font-semibold text-gray-500">
              Barista Bersertifikat
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#fffdf9] dark:bg-[#1e1612] p-4 rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari nama, NIK, jabatan atau departemen..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#251b16] text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#c1352d]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#251b16] text-xs font-semibold text-[#2a1a15] dark:text-[#fdf8f0]"
            >
              <option value="all">Semua Status Hubungan Kerja</option>
              {EMPLOYMENT_STATUSES.map(st => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            {/* Toggle Salary Visibility */}
            <button
              type="button"
              onClick={() => setShowSalary(!showSalary)}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#251b16] text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1.5"
            >
              {showSalary ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showSalary ? 'Sembunyikan Gaji' : 'Tampilkan Gaji'}</span>
            </button>
          </div>
        </div>

        {/* Department Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedDept('all')}
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold whitespace-nowrap transition-all ${
              selectedDept === 'all'
                ? 'bg-[#c1352d] text-white border-[#c1352d] shadow-2xs'
                : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Semua Departemen ({employees.length})
          </button>
          {DEPARTMENTS.map(dept => {
            const count = employees.filter(e => e.department === dept).length;
            return (
              <button
                key={dept}
                type="button"
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold whitespace-nowrap transition-all ${
                  selectedDept === dept
                    ? 'bg-[#c1352d] text-white border-[#c1352d] shadow-2xs'
                    : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {dept} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-[#fffdf9] dark:bg-[#1e1612] rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#2a1a15]/5 dark:bg-[#fdf8f0]/5 border-b border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 font-bold uppercase tracking-wider text-[10px] text-gray-500">
              <tr>
                <th className="py-3 px-4">Karyawan & NIK</th>
                <th className="py-3 px-4">Jabatan & Divisi</th>
                <th className="py-3 px-4">Status & Masa Kerja</th>
                <th className="py-3 px-4">Kontak Staf</th>
                <th className="py-3 px-4 text-right">Kompensasi (Gaji)</th>
                <th className="py-3 px-4">Sertifikasi Keahlian</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a1a15]/5 dark:divide-[#fdf8f0]/5">
              {filteredEmployees.map(emp => {
                const initials = emp.name
                  .split(' ')
                  .map(n => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();

                return (
                  <tr
                    key={emp.id}
                    className="hover:bg-[#2a1a15]/2 dark:hover:bg-[#fdf8f0]/2 transition-colors"
                  >
                    {/* Employee & NIK */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#c1352d] to-[#d97706] text-white flex items-center justify-center font-black text-xs shadow-2xs shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => setViewingEmpProfile(emp)}
                            className="font-bold text-[#2a1a15] dark:text-[#fdf8f0] text-xs hover:text-[#c1352d] dark:hover:text-[#f87171] text-left block"
                          >
                            {emp.name}
                          </button>
                          <span className="font-mono text-[10px] text-gray-400 font-semibold">
                            {emp.nik}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role & Dept */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#2a1a15] dark:text-[#fdf8f0]">
                        {emp.role}
                      </div>
                      <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#c1352d]/10 text-[#c1352d] mt-0.5">
                        {emp.department}
                      </span>
                    </td>

                    {/* Status & Tenure */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          emp.employmentStatus === 'Tetap'
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                            : emp.employmentStatus === 'Kontrak'
                            ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
                            : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                        }`}
                      >
                        {emp.employmentStatus}
                      </span>
                      <div className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Sejak {emp.joinDate}</span>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-4">
                      <div className="text-[11px] text-[#2a1a15] dark:text-[#fdf8f0] font-semibold flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>{emp.phone}</span>
                      </div>
                      <div className="text-[10px] text-gray-400 truncate mt-0.5 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span>{emp.email}</span>
                      </div>
                    </td>

                    {/* Salary */}
                    <td className="py-3 px-4 text-right">
                      <div className="font-black text-[#2a1a15] dark:text-[#fdf8f0]">
                        {showSalary
                          ? `Rp ${(emp.baseSalary + emp.attendanceAllowance).toLocaleString('id-ID')}`
                          : 'Rp ••••••••'}
                      </div>
                      <div className="text-[9px] text-gray-400">
                        {showSalary ? `Gapok + Tunjangan` : 'Dirahasiakan'}
                      </div>
                    </td>

                    {/* Certifications */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {emp.certifications && emp.certifications.length > 0 ? (
                          emp.certifications.map((cert, cIdx) => (
                            <span
                              key={cIdx}
                              className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-purple-500/10 text-purple-700 dark:text-purple-300 line-clamp-1"
                            >
                              {cert}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-gray-400 italic">Belum bersertifikat</span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewingEmpProfile(emp)}
                          title="Lihat ID Card & Profil"
                          className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(emp)}
                          title="Edit Data Karyawan"
                          className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(emp.id, emp.name)}
                          title="Hapus Karyawan"
                          className="p-1.5 rounded-lg border border-red-200 dark:border-red-900/40 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile ID Card Modal */}
      {viewingEmpProfile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#fffdf9] dark:bg-[#1e1612] w-full max-w-md rounded-3xl border border-[#2a1a15]/20 dark:border-[#fdf8f0]/20 shadow-2xl overflow-hidden">
            {/* Header / ID Badge Top */}
            <div className="bg-linear-to-r from-[#c1352d] to-[#991b1b] p-6 text-white text-center relative">
              <button
                type="button"
                onClick={() => setViewingEmpProfile(null)}
                className="absolute top-4 right-4 p-1 rounded-full bg-black/20 hover:bg-black/40 text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="text-[10px] font-mono tracking-widest uppercase opacity-80 mb-1">
                Ondeway Coffee Company · ID CARD
              </div>
              <div className="w-20 h-20 mx-auto rounded-2xl bg-white text-[#c1352d] font-black text-2xl flex items-center justify-center shadow-md my-3 border-2 border-white/50">
                {viewingEmpProfile.name
                  .split(' ')
                  .map(n => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </div>
              <h3 className="text-lg font-black">{viewingEmpProfile.name}</h3>
              <div className="text-xs font-semibold opacity-90">{viewingEmpProfile.role}</div>
              <div className="text-[10px] font-mono mt-1 opacity-80">{viewingEmpProfile.nik}</div>
            </div>

            {/* Profile Details */}
            <div className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-gray-400 text-[10px] block">Departemen:</span>
                  <span className="font-bold text-[#2a1a15] dark:text-[#fdf8f0]">
                    {viewingEmpProfile.department}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block">Status Kepegawaian:</span>
                  <span className="font-bold text-emerald-600">
                    {viewingEmpProfile.employmentStatus}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block">Tanggal Bergabung:</span>
                  <span className="font-bold text-[#2a1a15] dark:text-[#fdf8f0]">
                    {viewingEmpProfile.joinDate}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block">Penempatan Gerai:</span>
                  <span className="font-bold text-[#2a1a15] dark:text-[#fdf8f0]">
                    {viewingEmpProfile.outletName}
                  </span>
                </div>
              </div>

              {/* Contacts */}
              <div className="space-y-1.5 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex justify-between">
                  <span className="text-gray-400">WhatsApp / Telp:</span>
                  <span className="font-bold">{viewingEmpProfile.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email Resmi:</span>
                  <span className="font-bold">{viewingEmpProfile.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rekening Gaji:</span>
                  <span className="font-bold font-mono">
                    {viewingEmpProfile.bankAccount?.bankName} - {viewingEmpProfile.bankAccount?.accountNumber}
                  </span>
                </div>
              </div>

              {/* Certifications */}
              <div>
                <span className="text-gray-400 text-[10px] block mb-1">Sertifikasi & Kualifikasi:</span>
                <div className="flex flex-wrap gap-1">
                  {viewingEmpProfile.certifications.map((c, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#c1352d]/10 text-[#c1352d]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={printIDCard}
                  className="w-full py-2 rounded-xl bg-[#c1352d] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:bg-[#a92b24]"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak ID Card Pegawai</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showAddEditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#fffdf9] dark:bg-[#1e1612] w-full max-w-2xl rounded-3xl border border-[#2a1a15]/20 dark:border-[#fdf8f0]/20 shadow-2xl overflow-hidden my-8">
            <div className="p-5 bg-linear-to-r from-[#c1352d]/15 to-transparent border-b border-[#2a1a15]/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#c1352d]" />
                <h3 className="font-black text-base text-[#2a1a15] dark:text-[#fdf8f0]">
                  {editingEmp ? 'Edit Data Karyawan' : 'Tambah Karyawan Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddEditModal(false)}
                className="p-1.5 rounded-xl hover:bg-black/10 text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">
                    NIK Pegawai *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nik}
                    onChange={e => setFormData({ ...formData, nik: e.target.value.toUpperCase() })}
                    placeholder="EMP-ODW-011"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] font-mono text-xs font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nama lengkap sesuai KTP"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">
                    Jabatan (Role) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Contoh: Senior Barista / Roaster"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">
                    Departemen *
                  </label>
                  <select
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs font-semibold"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">
                    Status Hubungan Kerja
                  </label>
                  <select
                    value={formData.employmentStatus}
                    onChange={e => setFormData({ ...formData, employmentStatus: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs font-semibold"
                  >
                    {EMPLOYMENT_STATUSES.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">
                    Tanggal Bergabung (Join Date)
                  </label>
                  <input
                    type="date"
                    value={formData.joinDate}
                    onChange={e => setFormData({ ...formData, joinDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs"
                  />
                </div>
              </div>

              {/* Payroll & Banking */}
              <div className="p-3.5 rounded-2xl bg-linear-to-br from-emerald-500/5 via-amber-500/5 to-transparent border border-emerald-500/20 space-y-3">
                <span className="text-xs font-extrabold text-[#2a1a15] dark:text-[#fdf8f0] flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kompensasi Gaji & Rekening Bank Payroll</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 block mb-0.5">
                      Gaji Pokok Bulanan (Rp)
                    </label>
                    <input
                      type="number"
                      step={100000}
                      value={formData.baseSalary}
                      onChange={e => setFormData({ ...formData, baseSalary: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs font-bold text-emerald-700 dark:text-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 block mb-0.5">
                      Tunjangan Kehadiran & Shift (Rp)
                    </label>
                    <input
                      type="number"
                      step={50000}
                      value={formData.attendanceAllowance}
                      onChange={e => setFormData({ ...formData, attendanceAllowance: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 block mb-0.5">
                      Nama Bank
                    </label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={e => setFormData({ ...formData, bankName: e.target.value.toUpperCase() })}
                      placeholder="BCA / Mandiri / BNI"
                      className="w-full px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 block mb-0.5">
                      Nomor Rekening
                    </label>
                    <input
                      type="text"
                      value={formData.accountNumber}
                      onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
                      placeholder="Nomor rekening transfer payroll"
                      className="w-full px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="081234567890"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">
                    Email Resmi
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nama@ondeway.co.id"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs"
                  />
                </div>
              </div>

              {/* Certifications String */}
              <div>
                <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">
                  Sertifikasi & Kualifikasi (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={formData.certificationsStr}
                  onChange={e => setFormData({ ...formData, certificationsStr: e.target.value })}
                  placeholder="SCA Barista Intermediate, Q-Grader, POS BizDash Specialist"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddEditModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#c1352d] text-white text-xs font-bold hover:bg-[#a92b24] shadow-sm"
                >
                  {editingEmp ? 'Simpan Perubahan Data' : 'Simpan Data Karyawan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
