import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Award,
  Video,
  FileText,
  CheckCircle2,
  Clock,
  Play,
  HelpCircle,
  Plus,
  Search,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Printer,
  ShieldCheck,
  UserCheck,
  BarChart2,
  Filter,
  PieChart,
  Check,
  ArrowRight,
  User,
  AlertCircle,
  RotateCcw,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LMSCourse, LMSMaterial, SOPDocument } from '../../types';

interface CircularChartProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
}

const CircularProgressChart: React.FC<CircularChartProps> = ({
  percentage,
  size = 150,
  strokeWidth = 14,
  label = 'Selesai',
  sublabel,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const validPercentage = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = circumference - (validPercentage / 100) * circumference;

  return (
    <div
      className="relative inline-flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="rotate-[-90deg]">
        <defs>
          <linearGradient id="lmsRadialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c1352d" />
            <stop offset="60%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        {/* Background track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-[#2a1a15]/10 dark:text-[#fdf8f0]/10"
        />
        {/* Foreground animated progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#lmsRadialGrad)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none p-2">
        <span className="text-3xl font-black text-[#2a1a15] dark:text-[#fdf8f0] tracking-tight">
          {validPercentage}%
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#7a5c4b] dark:text-[#edd6b4]/80">
          {label}
        </span>
        {sublabel && (
          <span className="text-[9px] text-[#c1352d] dark:text-[#f87171] font-semibold mt-0.5 line-clamp-1">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};

export const LMSAcademy: React.FC = () => {
  const {
    courses,
    sops,
    cashierName,
    enrollEmployeeInCourse,
    submitCourseQuiz,
    addCourseMaterial,
    createSop,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'progress' | 'courses' | 'matrix' | 'certs' | 'sops'>('progress');
  const [selectedCourse, setSelectedCourse] = useState<LMSCourse | null>(courses[0] || null);
  const [activeMaterialIndex, setActiveMaterialIndex] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<{ score: number; passed: boolean; certificateNo?: string } | null>(null);

  // User-specific progress dashboard states
  const staffList = [
    { name: 'Rian Pratama', role: 'Lead Cashier & Barista', avatar: 'RP', dept: 'Front of House' },
    { name: 'Siti Rahma', role: 'Head Barista & Trainer', avatar: 'SR', dept: 'Bar & Training' },
    { name: 'Deni Setiawan', role: 'Junior Barista', avatar: 'DS', dept: 'Front of House' },
    { name: 'Fajar Nugraha', role: 'Head Roaster & Q-Grader', avatar: 'FN', dept: 'Roastery Lab' },
    { name: 'Bagus Prakoso', role: 'Roastery Specialist', avatar: 'BP', dept: 'Roastery Lab' },
  ];

  const [selectedEmployee, setSelectedEmployee] = useState<string>(cashierName || 'Rian Pratama');
  const [remainingFilterCourse, setRemainingFilterCourse] = useState<string>('all');

  const [userCompletedModules, setUserCompletedModules] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem('ondeway_lms_user_completed_modules');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      'Rian Pratama': ['mat-c1-1', 'mat-c1-2', 'mat-c1-3', 'mat-c2-1'],
      'Siti Rahma': ['mat-c1-1', 'mat-c1-2', 'mat-c1-3', 'mat-c2-1', 'mat-c2-2'],
      'Deni Setiawan': ['mat-c1-1'],
      'Fajar Nugraha': ['mat-c3-1', 'mat-c3-2'],
      'Bagus Prakoso': ['mat-c3-1', 'mat-c3-2'],
    };
  });

  const toggleModuleCompletion = (empName: string, moduleId: string) => {
    setUserCompletedModules(prev => {
      const currentList = prev[empName] || [];
      const updated = currentList.includes(moduleId)
        ? currentList.filter(id => id !== moduleId)
        : [...currentList, moduleId];
      const next = { ...prev, [empName]: updated };
      try {
        localStorage.setItem('ondeway_lms_user_completed_modules', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleResetEmployeeProgress = (empName: string) => {
    setUserCompletedModules(prev => {
      const next = { ...prev, [empName]: [] };
      try {
        localStorage.setItem('ondeway_lms_user_completed_modules', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleCompleteAllModules = (empName: string) => {
    const allIds = courses.flatMap(c => c.materials.map(m => m.id));
    setUserCompletedModules(prev => {
      const next = { ...prev, [empName]: Array.from(new Set(allIds)) };
      try {
        localStorage.setItem('ondeway_lms_user_completed_modules', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const currentEmpCompletedModules = userCompletedModules[selectedEmployee] || [];

  // Compute statistics for selectedEmployee
  const courseProgressList = courses.map(course => {
    const isEnrolled = course.enrolledEmployees.includes(selectedEmployee);
    const passedRecord = course.completedEmployees.find(e => e.employeeName === selectedEmployee);
    const totalMaterials = course.materials.length;
    const completedMaterials = course.materials.filter(m => currentEmpCompletedModules.includes(m.id));
    const completedCount = completedMaterials.length;
    const remainingMaterials = course.materials.filter(m => !currentEmpCompletedModules.includes(m.id));
    const progressPercent = totalMaterials > 0 ? Math.round((completedCount / totalMaterials) * 100) : 0;
    const isCertified = passedRecord !== undefined;

    return {
      course,
      isEnrolled,
      isCertified,
      passedRecord,
      totalMaterials,
      completedCount,
      remainingMaterials,
      progressPercent,
    };
  });

  const totalModulesAllCourses = courseProgressList.reduce((acc, c) => acc + c.totalMaterials, 0);
  const totalCompletedModulesAll = courseProgressList.reduce((acc, c) => acc + c.completedCount, 0);
  const overallRate = totalModulesAllCourses > 0
    ? Math.round((totalCompletedModulesAll / totalModulesAllCourses) * 100)
    : 0;

  const allRemainingModulesList = courseProgressList.flatMap(c =>
    c.remainingMaterials.map(mat => ({
      course: c.course,
      material: mat,
    }))
  );

  const filteredRemainingModules = allRemainingModulesList.filter(
    item => remainingFilterCourse === 'all' || item.course.id === remainingFilterCourse
  );

  const totalRemainingMinutes = allRemainingModulesList.reduce(
    (acc, item) => acc + item.material.durationMinutes,
    0
  );

  const employeeEarnedCerts = courses.flatMap(c =>
    c.completedEmployees
      .filter(e => e.employeeName === selectedEmployee)
      .map(e => ({
        ...e,
        courseTitle: c.title,
        courseCode: c.code,
      }))
  );

  const selectedStaffObj = staffList.find(s => s.name === selectedEmployee) || {
    name: selectedEmployee,
    role: 'Staff Ondeway',
    avatar: selectedEmployee.slice(0, 2).toUpperCase(),
    dept: 'Operasional',
  };

  // Certificate modal
  const [viewingCert, setViewingCert] = useState<{
    employeeName: string;
    courseTitle: string;
    certificateNo: string;
    date: string;
    score: number;
  } | null>(null);

  // SOP search & view
  const [sopSearch, setSopSearch] = useState('');
  const [selectedSop, setSelectedSop] = useState<SOPDocument | null>(null);
  const [showAddSopModal, setShowAddSopModal] = useState(false);
  const [newSopTitle, setNewSopTitle] = useState('');
  const [newSopCode, setNewSopCode] = useState('');
  const [newSopCat, setNewSopCat] = useState('Bar & Ekstraksi');
  const [newSopKind, setNewSopKind] = useState<SOPDocument['fileKind']>('SOP Operasional');
  const [newSopSummary, setNewSopSummary] = useState('');
  const [newSopContent, setNewSopContent] = useState('');

  // Course filter
  const [courseCategoryFilter, setCourseCategoryFilter] = useState<string>('all');

  const filteredCourses = courses.filter(
    c => courseCategoryFilter === 'all' || c.category === courseCategoryFilter
  );

  const filteredSops = sops.filter(
    s =>
      s.title.toLowerCase().includes(sopSearch.toLowerCase()) ||
      s.code.toLowerCase().includes(sopSearch.toLowerCase()) ||
      s.summary.toLowerCase().includes(sopSearch.toLowerCase())
  );

  const totalCertificates = courses.reduce(
    (sum, c) => sum + c.completedEmployees.length,
    0
  );

  const handleSelectQuizOption = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleEvaluateQuiz = () => {
    if (!selectedCourse) return;
    let correctCount = 0;
    selectedCourse.quiz.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round(
      (correctCount / selectedCourse.quiz.length) * 100
    );

    const res = submitCourseQuiz(selectedCourse.id, cashierName, calculatedScore);
    setQuizResult({
      score: calculatedScore,
      passed: res.passed,
      certificateNo: res.certificateNo,
    });
    setQuizSubmitted(true);
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizResult(null);
  };

  const handleCreateSopSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSopTitle || !newSopCode) return;
    createSop({
      code: newSopCode,
      title: newSopTitle,
      category: newSopCat,
      fileKind: newSopKind,
      summary: newSopSummary,
      content: newSopContent,
      author: cashierName,
      lastUpdated: new Date().toISOString().slice(0, 10),
    });
    setShowAddSopModal(false);
    setNewSopTitle('');
    setNewSopCode('');
    setNewSopSummary('');
    setNewSopContent('');
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Stats */}
      <div className="bg-linear-to-r from-[#c1352d]/15 via-[#cf7440]/10 to-transparent p-5 rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#c1352d] uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Ondeway Academy · LMS & Sertifikasi</span>
          </div>
          <h2 className="text-xl font-black text-[#2a1a15] dark:text-[#fdf8f0]">
            Pusat Pelatihan Barista & Standarisasi Roastery
          </h2>
          <p className="text-xs text-[#7a5c4b] dark:text-[#edd6b4]/80 mt-1 max-w-2xl leading-relaxed">
            Kurikulum internal pelatihan ekstraksi espresso, microfoam susu, protokol cupping SCA,
            hingga SOP operasional kasir BizDash dengan ujian kompetensi dan penerbitan sertifikat resmi.
          </p>
        </div>

        {/* Stats badges */}
        <div className="flex items-center gap-3 bg-white/60 dark:bg-[#201712]/60 backdrop-blur-xs p-3 rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10">
          <div className="text-center px-2">
            <div className="text-lg font-black text-[#c1352d]">{courses.length}</div>
            <div className="text-[10px] text-gray-500 font-semibold">Kursus Aktif</div>
          </div>
          <div className="w-px h-8 bg-gray-300 dark:bg-gray-700" />
          <div className="text-center px-2">
            <div className="text-lg font-black text-emerald-700">{totalCertificates}</div>
            <div className="text-[10px] text-gray-500 font-semibold">Sertifikat Lulus</div>
          </div>
          <div className="w-px h-8 bg-gray-300 dark:bg-gray-700" />
          <div className="text-center px-2">
            <div className="text-lg font-black text-amber-600">{sops.length}</div>
            <div className="text-[10px] text-gray-500 font-semibold">Dokumen SOP</div>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#fffdf9] dark:bg-[#1e1612] border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 text-xs font-semibold overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('progress')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all shrink-0 ${
            activeTab === 'progress'
              ? 'bg-[#c1352d] text-white shadow-xs font-bold'
              : 'text-[#7a5c4b] dark:text-[#edd6b4] hover:bg-[#c1352d]/10'
          }`}
        >
          <PieChart className="w-3.5 h-3.5" />
          <span>Dashboard Progres Belajar</span>
          <span
            className={`ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${
              activeTab === 'progress'
                ? 'bg-white/20 text-white'
                : 'bg-[#c1352d]/10 text-[#c1352d] dark:text-[#f87171]'
            }`}
          >
            {overallRate}%
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all shrink-0 ${
            activeTab === 'courses'
              ? 'bg-[#c1352d] text-white shadow-xs font-bold'
              : 'text-[#7a5c4b] dark:text-[#edd6b4] hover:bg-[#c1352d]/10'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Jalur Belajar & Modul Kursus</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('matrix')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all shrink-0 ${
            activeTab === 'matrix'
              ? 'bg-[#c1352d] text-white shadow-xs font-bold'
              : 'text-[#7a5c4b] dark:text-[#edd6b4] hover:bg-[#c1352d]/10'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Matriks Kompetensi Tim Barista</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('certs')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all shrink-0 ${
            activeTab === 'certs'
              ? 'bg-[#c1352d] text-white shadow-xs font-bold'
              : 'text-[#7a5c4b] dark:text-[#edd6b4] hover:bg-[#c1352d]/10'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Galeri Sertifikasi Kelulusan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sops')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all shrink-0 ${
            activeTab === 'sops'
              ? 'bg-[#c1352d] text-white shadow-xs font-bold'
              : 'text-[#7a5c4b] dark:text-[#edd6b4] hover:bg-[#c1352d]/10'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Dokumen SOP & Panduan Operasional</span>
        </button>
      </div>

      {/* 0. USER-SPECIFIC PROGRESS DASHBOARD */}
      {activeTab === 'progress' && (
        <div className="space-y-5">
          {/* User Profile & Switcher Bar */}
          <div className="bg-[#fffdf9] dark:bg-[#1e1612] p-4 sm:p-5 rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#c1352d] to-[#d97706] text-white flex items-center justify-center font-black text-base shadow-sm ring-2 ring-[#c1352d]/20">
                {selectedStaffObj.avatar}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-black text-[#2a1a15] dark:text-[#fdf8f0]">
                    {selectedStaffObj.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#c1352d]/10 text-[#c1352d] dark:text-[#f87171]">
                    {selectedStaffObj.role}
                  </span>
                  {selectedEmployee === cashierName && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                      Kasir Aktif
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#7a5c4b] dark:text-[#edd6b4]/80 mt-0.5">
                  Departemen: <span className="font-semibold">{selectedStaffObj.dept}</span> · Kurikulum Barista, Roastery & Kasir Ondeway
                </p>
              </div>
            </div>

            {/* Staff Selector & Actions */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <label className="text-xs font-bold text-gray-500 whitespace-nowrap">
                Pilih Karyawan:
              </label>
              <select
                value={selectedEmployee}
                onChange={e => setSelectedEmployee(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs font-bold text-[#2a1a15] dark:text-[#fdf8f0] focus:ring-2 focus:ring-[#c1352d] focus:outline-hidden"
              >
                {staffList.map(s => (
                  <option key={s.name} value={s.name}>
                    {s.name} — {s.role}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => handleResetEmployeeProgress(selectedEmployee)}
                title="Reset progres modul karyawan ini"
                className="px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={() => handleCompleteAllModules(selectedEmployee)}
                title="Tandai semua modul selesai untuk simulasi"
                className="px-2.5 py-1.5 rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border border-emerald-600/20 text-[11px] font-bold hover:bg-emerald-600/20 flex items-center gap-1 transition-colors"
              >
                <Check className="w-3 h-3" />
                <span>Selesaikan Semua</span>
              </button>
            </div>
          </div>

          {/* Top Section: Circular Chart Card + Metric Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Circular Progress Gauge Card */}
            <div className="lg:col-span-2 bg-[#fffdf9] dark:bg-[#1e1612] p-5 rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 flex flex-col sm:flex-row items-center gap-6 shadow-xs">
              <CircularProgressChart
                percentage={overallRate}
                size={155}
                strokeWidth={14}
                label="Tingkat Selesai"
                sublabel={`${totalCompletedModulesAll} / ${totalModulesAllCourses} Modul`}
              />

              <div className="flex-1 min-w-0 space-y-3.5 w-full">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-[#2a1a15] dark:text-[#fdf8f0]">
                      Tingkat Kelulusan & Progres Belajar
                    </h3>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#c1352d]/10 text-[#c1352d] dark:text-[#f87171]">
                      {overallRate >= 80 ? '⭐ Siap Sertifikasi' : overallRate >= 40 ? '⚡ Sedang Berjalan' : '🎯 Baru Memulai'}
                    </span>
                  </div>
                  <p className="text-xs text-[#7a5c4b] dark:text-[#edd6b4]/80 mt-1">
                    Visualisasi persentase penyelesaian kurikulum spesialisasi kopi berdasarkan modul yang telah dipelajari oleh <strong>{selectedStaffObj.name}</strong>.
                  </p>
                </div>

                {/* Overall Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[#7a5c4b] dark:text-[#edd6b4]">Total Akumulasi Modul</span>
                    <span className="text-[#c1352d] font-black">{totalCompletedModulesAll} dari {totalModulesAllCourses} Modul ({overallRate}%)</span>
                  </div>
                  <div className="w-full bg-[#2a1a15]/10 dark:bg-[#fdf8f0]/10 rounded-full h-3.5 overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-[#c1352d] via-[#d97706] to-[#10b981] rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${overallRate}%` }}
                    />
                  </div>
                </div>

                {/* Status Badges Breakdown */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{courseProgressList.filter(c => c.isCertified).length} Kursus Lulus Bersertifikat</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{courseProgressList.filter(c => !c.isCertified && c.completedCount > 0).length} Sedang Ditempuh</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-bold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{courseProgressList.filter(c => c.completedCount === 0).length} Belum Dimulai</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
              {/* Sisa Modul */}
              <div className="p-4 rounded-2xl bg-[#fffdf9] dark:bg-[#1e1612] border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 flex items-center gap-3.5 shadow-xs">
                <div className="w-11 h-11 rounded-xl bg-[#c1352d]/10 text-[#c1352d] flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-black text-[#2a1a15] dark:text-[#fdf8f0]">
                    {allRemainingModulesList.length}
                  </div>
                  <div className="text-[11px] font-semibold text-gray-500">
                    Sisa Modul Belum Selesai
                  </div>
                </div>
              </div>

              {/* Estimasi Jam Belajar */}
              <div className="p-4 rounded-2xl bg-[#fffdf9] dark:bg-[#1e1612] border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 flex items-center gap-3.5 shadow-xs">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-black text-[#2a1a15] dark:text-[#fdf8f0]">
                    {Math.floor(totalRemainingMinutes / 60)}j {totalRemainingMinutes % 60}m
                  </div>
                  <div className="text-[11px] font-semibold text-gray-500">
                    Estimasi Sisa Waktu Belajar
                  </div>
                </div>
              </div>

              {/* Sertifikat Diperoleh */}
              <div className="p-4 rounded-2xl bg-[#fffdf9] dark:bg-[#1e1612] border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 flex items-center gap-3.5 shadow-xs">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-black text-[#2a1a15] dark:text-[#fdf8f0]">
                    {employeeEarnedCerts.length}
                  </div>
                  <div className="text-[11px] font-semibold text-gray-500">
                    Sertifikasi Kelulusan Diraih
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Course Completion Rates with Progress Bars */}
          <div className="bg-[#fffdf9] dark:bg-[#1e1612] p-5 rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h3 className="text-base font-black text-[#2a1a15] dark:text-[#fdf8f0] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#c1352d]" />
                  <span>Tingkat Penyelesaian per Kursus (Progress Bars)</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Tinjauan capaian setiap mata pelajaran dengan progress bar interaktif dan status kelulusan.
                </p>
              </div>
              <span className="text-xs text-gray-500 font-bold self-start sm:self-auto">
                {courseProgressList.length} Mata Pelatihan
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courseProgressList.map(cp => {
                const { course, isCertified, passedRecord, totalMaterials, completedCount, progressPercent, remainingMaterials } = cp;
                return (
                  <div
                    key={course.id}
                    className="p-4 rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 bg-white/70 dark:bg-[#251b16]/70 flex flex-col justify-between gap-3 shadow-xs hover:border-[#c1352d]/40 transition-all"
                  >
                    <div>
                      {/* Course Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#c1352d]/10 text-[#c1352d]">
                            {course.category}
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono">
                            {course.code}
                          </span>
                        </div>
                        {isCertified ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Lulus ({passedRecord?.score}%)</span>
                          </span>
                        ) : progressPercent > 0 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400">
                            Sedang Ditempuh
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-500">
                            Belum Dimulai
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-black text-[#2a1a15] dark:text-[#fdf8f0] mt-1.5 line-clamp-1">
                        {course.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                        Instruktur: {course.instructor} · Tingkat: {course.level}
                      </p>
                    </div>

                    {/* Progress Bar & Breakdown */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 font-semibold">
                          Progres Modul: <strong className="text-[#2a1a15] dark:text-[#fdf8f0]">{completedCount} / {totalMaterials}</strong>
                        </span>
                        <span className="font-black text-[#c1352d]">
                          {progressPercent}%
                        </span>
                      </div>
                      <div className="w-full bg-[#2a1a15]/10 dark:bg-[#fdf8f0]/10 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCertified || progressPercent === 100
                              ? 'bg-linear-to-r from-emerald-600 to-teal-500'
                              : 'bg-linear-to-r from-[#c1352d] to-[#e65c00]'
                          }`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-500">
                        <span>{remainingMaterials.length > 0 ? `${remainingMaterials.length} modul tersisa` : 'Semua modul selesai'}</span>
                        <span>Estimasi: {course.estimatedHours} Jam</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
                      {isCertified && passedRecord ? (
                        <button
                          type="button"
                          onClick={() => {
                            setViewingCert({
                              employeeName: selectedEmployee,
                              courseTitle: course.title,
                              certificateNo: passedRecord.certificateNo,
                              date: passedRecord.completedAt,
                              score: passedRecord.score,
                            });
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-600/20 text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Lihat Sertifikat</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-500 italic">
                          Passing score kuis: {course.passingScorePercent}%
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCourse(course);
                          // find first uncompleted material
                          const firstUncompleted = course.materials.findIndex(
                            m => !currentEmpCompletedModules.includes(m.id)
                          );
                          setActiveMaterialIndex(firstUncompleted >= 0 ? firstUncompleted : 0);
                          setActiveTab('courses');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#c1352d] text-white font-bold text-xs hover:bg-[#a92b24] shadow-xs flex items-center gap-1 transition-colors"
                      >
                        <span>{progressPercent > 0 ? 'Lanjutkan Belajar' : 'Buka Kursus'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Sisa Modul Pembelajaran (Remaining Modules) */}
          <div className="bg-[#fffdf9] dark:bg-[#1e1612] p-5 rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h3 className="text-base font-black text-[#2a1a15] dark:text-[#fdf8f0] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span>Daftar Sisa Modul yang Perlu Diselesaikan ({filteredRemainingModules.length} Modul)</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Klik <em>"Pelajari Sekarang"</em> untuk membuka modul atau <em>"Tandai Selesai"</em> untuk memperbarui progres langsung.
                </p>
              </div>

              {/* Filter by course */}
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-gray-400" />
                <select
                  value={remainingFilterCourse}
                  onChange={e => setRemainingFilterCourse(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs font-semibold text-[#2a1a15] dark:text-[#fdf8f0] focus:ring-2 focus:ring-[#c1352d] focus:outline-hidden"
                >
                  <option value="all">Semua Kursus ({allRemainingModulesList.length} Sisa)</option>
                  {courses.map(c => {
                    const count = c.materials.filter(m => !currentEmpCompletedModules.includes(m.id)).length;
                    return (
                      <option key={c.id} value={c.id}>
                        {c.title} ({count} sisa)
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {filteredRemainingModules.length === 0 ? (
              <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-emerald-800 dark:text-emerald-300">
                  Semua Modul Berhasil Diselesaikan!
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 max-w-md mx-auto">
                  Karyawan <strong>{selectedStaffObj.name}</strong> telah menyelesaikan seluruh modul pelatihan pada filter ini. Lanjutkan ke ujian kuis untuk penerbitan sertifikat resmi.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('courses')}
                    className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 shadow-xs inline-flex items-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Ambil Ujian Sertifikasi Sekarang</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredRemainingModules.map((item, idx) => (
                  <div
                    key={`${item.course.id}-${item.material.id}`}
                    className="p-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#201813] flex flex-col justify-between gap-3 shadow-2xs hover:border-[#c1352d]/40 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#c1352d]/10 text-[#c1352d] flex items-center justify-center shrink-0 mt-0.5">
                        {item.material.kind === 'video' ? (
                          <Video className="w-4 h-4 text-red-500" />
                        ) : item.material.kind === 'doc' ? (
                          <FileText className="w-4 h-4 text-blue-500" />
                        ) : (
                          <BookOpen className="w-4 h-4 text-emerald-600" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase">
                            {item.material.kind} · {item.material.durationMinutes} Menit
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono">
                            {item.course.code}
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-[#2a1a15] dark:text-[#fdf8f0] mt-1 line-clamp-1">
                          {item.material.title}
                        </h5>
                        <p className="text-[10px] text-gray-500 truncate mt-0.5">
                          Kursus: {item.course.title}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => toggleModuleCompletion(selectedEmployee, item.material.id)}
                        className="px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-[11px] font-bold text-gray-700 dark:text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-600 hover:border-emerald-600/30 flex items-center gap-1 transition-colors"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Tandai Selesai</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCourse(item.course);
                          const mIdx = item.course.materials.findIndex(m => m.id === item.material.id);
                          setActiveMaterialIndex(mIdx >= 0 ? mIdx : 0);
                          setActiveTab('courses');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#c1352d]/10 text-[#c1352d] dark:text-[#f87171] hover:bg-[#c1352d] hover:text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
                      >
                        <span>Pelajari Sekarang</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Sertifikat Resmi yang Telah Diraih */}
          {employeeEarnedCerts.length > 0 && (
            <div className="bg-[#fffdf9] dark:bg-[#1e1612] p-5 rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-[#2a1a15] dark:text-[#fdf8f0] flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>Sertifikat Kelulusan Terverifikasi ({employeeEarnedCerts.length})</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Sertifikasi resmi dengan passing grade ≥ 80% yang telah diterbitkan untuk {selectedStaffObj.name}.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {employeeEarnedCerts.map((cert, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-4 rounded-2xl bg-linear-to-br from-[#c1352d]/5 via-amber-500/5 to-transparent border border-amber-600/20 flex flex-col justify-between gap-3 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400">
                          {cert.certificateNo}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700">
                          Skor {cert.score}%
                        </span>
                      </div>
                      <h4 className="text-xs font-black text-[#2a1a15] dark:text-[#fdf8f0] mt-1.5">
                        {cert.courseTitle}
                      </h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        Diterbitkan: {cert.completedAt}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setViewingCert({
                          employeeName: cert.employeeName,
                          courseTitle: cert.courseTitle,
                          certificateNo: cert.certificateNo,
                          date: cert.completedAt,
                          score: cert.score,
                        });
                      }}
                      className="w-full py-1.5 rounded-xl bg-amber-600/15 hover:bg-amber-600/25 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Buka Dokumen Sertifikat</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 1. COURSES & LEARNING PATHS TAB */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left 1/3: Course list selector */}
          <div className="space-y-3">
            {/* Category Filter */}
            <div className="flex gap-1 overflow-x-auto pb-1 text-xs">
              {['all', 'Barista', 'Roastery', 'Kasir & Front of House'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCourseCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] whitespace-nowrap font-semibold ${
                    courseCategoryFilter === cat
                      ? 'bg-[#c1352d] text-white border-[#c1352d]'
                      : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {cat === 'all' ? 'Semua Jalur' : cat}
                </button>
              ))}
            </div>

            {/* Course Cards */}
            <div className="space-y-2.5">
              {filteredCourses.map(c => {
                const isSelected = selectedCourse?.id === c.id;
                const isEnrolled = c.enrolledEmployees.includes(cashierName);
                const hasPassed = c.completedEmployees.some(e => e.employeeName === cashierName);

                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCourse(c);
                      setActiveMaterialIndex(0);
                      handleResetQuiz();
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#c1352d] bg-[#c1352d]/5 dark:bg-[#c1352d]/10 shadow-sm'
                        : 'border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 bg-[#fffdf9] dark:bg-[#1e1612] hover:border-[#c1352d]/40'
                    }`}
                  >
                    <div className="flex gap-3">
                      <img
                        src={c.thumbnail}
                        alt={c.title}
                        className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-[#c1352d]/10 text-[#c1352d]">
                            {c.category}
                          </span>
                          <span className="text-[10px] text-gray-500 flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />
                            <span>{c.estimatedHours}h</span>
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-[#2a1a15] dark:text-[#fdf8f0] line-clamp-1 mt-1">
                          {c.title}
                        </h4>

                        <div className="text-[10px] text-gray-500 truncate mt-0.5">
                          Instruktur: {c.instructor}
                        </div>

                        {/* Status badges */}
                        <div className="flex items-center gap-1.5 mt-2">
                          {hasPassed ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-700">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Lulus Bersertifikat</span>
                            </span>
                          ) : isEnrolled ? (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-500/10 text-blue-700">
                              Sedang Dipelajari
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-gray-100 text-gray-600">
                              Belum Terdaftar
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 2/3: Active Course Learning Content & Interactive Quiz */}
          <div className="lg:col-span-2 space-y-4">
            {selectedCourse ? (
              <div className="bg-[#fffdf9] dark:bg-[#1e1612] rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 p-5 shadow-xs space-y-4">
                {/* Course Title Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#c1352d]/10 text-[#c1352d]">
                        {selectedCourse.code}
                      </span>
                      <span className="text-xs font-semibold text-gray-500">
                        Tingkat: {selectedCourse.level}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-[#2a1a15] dark:text-[#fdf8f0] mt-1">
                      {selectedCourse.title}
                    </h3>
                    <p className="text-xs text-[#7a5c4b] dark:text-[#edd6b4]/80 mt-0.5">
                      {selectedCourse.description}
                    </p>
                  </div>

                  {!selectedCourse.enrolledEmployees.includes(cashierName) && (
                    <button
                      type="button"
                      onClick={() => enrollEmployeeInCourse(selectedCourse.id, cashierName)}
                      className="px-4 py-2 rounded-xl bg-[#c1352d] text-white font-bold text-xs hover:bg-[#a92b24] shadow-xs shrink-0 flex items-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Daftarkan Diri ({cashierName})</span>
                    </button>
                  )}
                </div>

                {/* Lesson Materials Steps */}
                <div>
                  <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Daftar Modul Pembelajaran ({selectedCourse.materials.length} Materi):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {selectedCourse.materials.map((mat, mIdx) => {
                      const isMatCompleted = currentEmpCompletedModules.includes(mat.id);
                      return (
                        <button
                          key={mat.id}
                          type="button"
                          onClick={() => setActiveMaterialIndex(mIdx)}
                          className={`p-2.5 rounded-xl border text-left flex items-start gap-2 text-xs transition-all ${
                            activeMaterialIndex === mIdx
                              ? 'border-[#c1352d] bg-[#c1352d]/10 text-[#c1352d] font-bold'
                              : 'border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 mt-0.5 ${
                              isMatCompleted
                                ? 'bg-emerald-600 text-white'
                                : 'bg-[#c1352d]/20 text-[#c1352d]'
                            }`}
                          >
                            {isMatCompleted ? <Check className="w-3 h-3" /> : mIdx + 1}
                          </div>
                          <div className="min-w-0">
                            <div className="truncate font-semibold text-[11px]">{mat.title}</div>
                            <div className="text-[10px] text-gray-500 uppercase flex items-center gap-1 mt-0.5">
                              {mat.kind === 'video' ? (
                                <Video className="w-3 h-3 text-red-500" />
                              ) : mat.kind === 'doc' ? (
                                <FileText className="w-3 h-3 text-blue-500" />
                              ) : (
                                <BookOpen className="w-3 h-3 text-emerald-500" />
                              )}
                              <span>{mat.kind} · {mat.durationMinutes}m</span>
                              {isMatCompleted && (
                                <span className="text-emerald-600 font-bold ml-1">✓ Selesai</span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Material Viewer */}
                {selectedCourse.materials[activeMaterialIndex] && (
                  <div className="p-4 rounded-2xl bg-[#2a1a15]/3 dark:bg-[#fdf8f0]/3 space-y-3">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="font-extrabold text-xs text-[#2a1a15] dark:text-[#fdf8f0]">
                        {selectedCourse.materials[activeMaterialIndex].title}
                      </div>
                      <span className="text-[10px] text-gray-500 font-semibold">
                        Durasi Estimasi: {selectedCourse.materials[activeMaterialIndex].durationMinutes} Menit
                      </span>
                    </div>

                    {/* Video embed if kind === 'video' */}
                    {selectedCourse.materials[activeMaterialIndex].kind === 'video' && (
                      <div className="aspect-16/9 w-full rounded-xl overflow-hidden bg-black/80 shadow-md relative">
                        <iframe
                          src={selectedCourse.materials[activeMaterialIndex].mediaUrl}
                          title={selectedCourse.materials[activeMaterialIndex].title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}

                    {/* Text guide content */}
                    <div className="text-xs text-[#4a3227] dark:text-[#edd6b4] leading-relaxed whitespace-pre-line p-3 rounded-xl bg-white dark:bg-[#1a120e] border border-gray-200 dark:border-gray-800">
                      {selectedCourse.materials[activeMaterialIndex].content}
                    </div>

                    {selectedCourse.materials[activeMaterialIndex].kind === 'doc' && (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-blue-500/10 text-blue-800 dark:text-blue-300 text-xs">
                        <span className="font-semibold">Dokumen SOP Standar: {selectedCourse.materials[activeMaterialIndex].title}</span>
                        <a
                          href={selectedCourse.materials[activeMaterialIndex].mediaUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-[10px] hover:bg-blue-700 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Unduh PDF</span>
                        </a>
                      </div>
                    )}

                    {/* Module completion status & quick toggle */}
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => toggleModuleCompletion(selectedEmployee, selectedCourse.materials[activeMaterialIndex].id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                          currentEmpCompletedModules.includes(selectedCourse.materials[activeMaterialIndex].id)
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-600'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          {currentEmpCompletedModules.includes(selectedCourse.materials[activeMaterialIndex].id)
                            ? `Selesai oleh ${selectedEmployee} (Klik untuk Batal)`
                            : `Tandai Selesai (${selectedEmployee})`}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('progress')}
                        className="text-xs text-[#c1352d] dark:text-[#f87171] font-bold hover:underline flex items-center gap-1"
                      >
                        <PieChart className="w-3.5 h-3.5" />
                        <span>Lihat Dashboard Progres Karyawan</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* UJIAN & KUIS KOMPETENSI (QUIZ) */}
                <div className="pt-4 border-t space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-[#2a1a15] dark:text-[#fdf8f0] flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-[#c1352d]" />
                        <span>Ujian & Kuis Kompetensi (Passing Score: {selectedCourse.passingScorePercent}%)</span>
                      </h4>
                      <p className="text-[10px] text-gray-500">
                        Jawab seluruh pertanyaan berikut untuk meraih sertifikasi kelulusan resmi Ondeway Academy.
                      </p>
                    </div>

                    {quizSubmitted && (
                      <button
                        type="button"
                        onClick={handleResetQuiz}
                        className="text-xs text-[#c1352d] font-bold hover:underline"
                      >
                        Ulangi Kuis
                      </button>
                    )}
                  </div>

                  {/* Questions */}
                  <div className="space-y-3">
                    {selectedCourse.quiz.map((q, qIdx) => (
                      <div
                        key={q.id}
                        className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a120e] text-xs space-y-2"
                      >
                        <div className="font-bold text-[#2a1a15] dark:text-[#fdf8f0]">
                          {qIdx + 1}. {q.question}
                        </div>

                        <div className="space-y-1.5">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = quizAnswers[q.id] === optIdx;
                            const isCorrect = q.correctAnswerIndex === optIdx;

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                disabled={quizSubmitted}
                                onClick={() => handleSelectQuizOption(q.id, optIdx)}
                                className={`w-full p-2 rounded-lg text-left text-xs transition-all flex items-center justify-between border ${
                                  quizSubmitted
                                    ? isCorrect
                                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-800 font-bold'
                                      : isSelected
                                      ? 'border-red-500 bg-red-500/10 text-red-800'
                                      : 'border-gray-200 text-gray-500'
                                    : isSelected
                                    ? 'border-[#c1352d] bg-[#c1352d]/10 text-[#c1352d] font-bold'
                                    : 'border-gray-200 hover:bg-gray-50'
                                }`}
                              >
                                <span>{opt}</span>
                                {quizSubmitted && isCorrect && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div className="text-[11px] text-gray-500 italic p-2 bg-gray-50 dark:bg-gray-800/40 rounded-lg">
                            Penjelasan: {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Submit / Score Banner */}
                  {!quizSubmitted ? (
                    <button
                      type="button"
                      disabled={Object.keys(quizAnswers).length < selectedCourse.quiz.length}
                      onClick={handleEvaluateQuiz}
                      className="w-full py-2.5 rounded-xl bg-[#c1352d] text-white font-bold text-xs hover:bg-[#a92b24] shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      <Award className="w-4 h-4" />
                      <span>Kirim Jawaban & Evaluasi Nilai</span>
                    </button>
                  ) : (
                    quizResult && (
                      <div
                        className={`p-4 rounded-2xl border text-center space-y-2 animate-in zoom-in-95 ${
                          quizResult.passed
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-900 dark:text-emerald-200'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-200'
                        }`}
                      >
                        <div className="text-xl font-black">
                          {quizResult.passed ? '🎉 Selamat, Anda Lulus!' : '⚠️ Nilai Belum Mencapai Target'}
                        </div>
                        <div className="text-sm font-bold">
                          Skor Anda: {quizResult.score}% (Syarat Kelulusan: {selectedCourse.passingScorePercent}%)
                        </div>
                        {quizResult.passed && quizResult.certificateNo && (
                          <div>
                            <p className="text-xs">
                              Sertifikat resmi kelulusan telah diterbitkan dengan nomor:
                            </p>
                            <div className="font-mono font-extrabold text-[#c1352d] text-sm mt-1">
                              {quizResult.certificateNo}
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setViewingCert({
                                  employeeName: cashierName,
                                  courseTitle: selectedCourse.title,
                                  certificateNo: quizResult.certificateNo!,
                                  date: new Date().toISOString().slice(0, 10),
                                  score: quizResult.score,
                                })
                              }
                              className="mt-2 px-4 py-1.5 rounded-xl bg-[#c1352d] text-white font-bold text-xs hover:bg-[#a92b24] shadow-xs inline-flex items-center gap-1"
                            >
                              <Award className="w-3.5 h-3.5" />
                              <span>Lihat & Cetak Sertifikat</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500 bg-white dark:bg-[#1e1612] rounded-2xl border">
                Pilih kursus dari panel kiri untuk mulai belajar.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. COMPETENCY MATRIX TAB */}
      {activeTab === 'matrix' && (
        <div className="bg-[#fffdf9] dark:bg-[#1e1612] rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 overflow-hidden shadow-xs text-xs space-y-3 p-5">
          <div className="border-b pb-3">
            <h4 className="font-extrabold text-sm text-[#2a1a15] dark:text-[#fdf8f0]">
              Matriks Keterampilan & Kompetensi Tim Barista
            </h4>
            <p className="text-[11px] text-[#7a5c4b] dark:text-[#edd6b4]/80 mt-0.5">
              Pemantauan status penguasaan standar operasional tiap barista dan roaster Ondeway Coffee Company
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center">
              <thead className="bg-[#fdf8f0] dark:bg-[#251b16] font-bold text-[10px] text-gray-600 dark:text-gray-300 uppercase border-b">
                <tr>
                  <th className="py-2.5 px-3 text-left">Nama Barista / Roaster</th>
                  <th className="py-2.5 px-2">Dial-in Espresso</th>
                  <th className="py-2.5 px-2">Microfoam & Latte Art</th>
                  <th className="py-2.5 px-2">Roasting & Cupping SCA</th>
                  <th className="py-2.5 px-2">Kasir POS BizDash</th>
                  <th className="py-2.5 px-2">Kebersihan & SOP</th>
                  <th className="py-2.5 px-3 text-right">Status Sertifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {staffList.map((st, sIdx) => {
                  const hasC1 = courses[0]?.completedEmployees.some(e => e.employeeName === st.name);
                  const hasC2 = courses[1]?.completedEmployees.some(e => e.employeeName === st.name);
                  const hasC3 = courses[2]?.completedEmployees.some(e => e.employeeName === st.name);
                  const hasC4 = courses[3]?.completedEmployees.some(e => e.employeeName === st.name);

                  return (
                    <tr key={sIdx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                      <td className="py-3 px-3 text-left">
                        <div className="font-bold text-[#2a1a15] dark:text-[#fdf8f0]">{st.name}</div>
                        <div className="text-[10px] text-gray-500">{st.role}</div>
                      </td>

                      <td className="py-3 px-2">
                        <span
                          className={`inline-block w-6 h-6 rounded-md font-bold text-[10px] leading-6 ${
                            hasC1 ? 'bg-emerald-500/20 text-emerald-800 font-black' : 'bg-amber-500/15 text-amber-800'
                          }`}
                        >
                          {hasC1 ? 'A' : 'B'}
                        </span>
                      </td>

                      <td className="py-3 px-2">
                        <span
                          className={`inline-block w-6 h-6 rounded-md font-bold text-[10px] leading-6 ${
                            hasC2 || st.name === 'Siti Rahma'
                              ? 'bg-emerald-500/20 text-emerald-800 font-black'
                              : 'bg-amber-500/15 text-amber-800'
                          }`}
                        >
                          {hasC2 || st.name === 'Siti Rahma' ? 'A' : 'B'}
                        </span>
                      </td>

                      <td className="py-3 px-2">
                        <span
                          className={`inline-block w-6 h-6 rounded-md font-bold text-[10px] leading-6 ${
                            hasC3 || st.name.includes('Roaster')
                              ? 'bg-emerald-500/20 text-emerald-800 font-black'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {hasC3 || st.name.includes('Roaster') ? 'A' : '—'}
                        </span>
                      </td>

                      <td className="py-3 px-2">
                        <span
                          className={`inline-block w-6 h-6 rounded-md font-bold text-[10px] leading-6 ${
                            hasC4 || st.name === 'Rian Pratama'
                              ? 'bg-emerald-500/20 text-emerald-800 font-black'
                              : 'bg-amber-500/15 text-amber-800'
                          }`}
                        >
                          {hasC4 || st.name === 'Rian Pratama' ? 'A' : 'B'}
                        </span>
                      </td>

                      <td className="py-3 px-2">
                        <span className="inline-block w-6 h-6 rounded-md font-bold text-[10px] leading-6 bg-emerald-500/20 text-emerald-800 font-black">
                          A
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#c1352d]/10 text-[#c1352d]">
                          SCA Qualified
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. CERTIFICATES GALLERY TAB */}
      {activeTab === 'certs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.flatMap(c =>
              c.completedEmployees.map((e, idx) => (
                <div
                  key={`${c.id}-${idx}`}
                  className="p-5 rounded-2xl bg-[#fffdf9] dark:bg-[#1e1612] border-2 border-[#c1352d]/20 shadow-xs flex flex-col justify-between space-y-4 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#c1352d]/5 rounded-bl-full pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between text-[10px] text-gray-500">
                      <span className="font-mono font-bold text-[#c1352d]">{e.certificateNo}</span>
                      <span>{e.completedAt}</span>
                    </div>

                    <div className="text-center py-3">
                      <Award className="w-10 h-10 text-amber-500 mx-auto mb-1" />
                      <div className="text-[10px] uppercase font-bold tracking-widest text-[#7a5c4b] dark:text-[#edd6b4]/80">
                        SERTIFIKAT KELULUSAN
                      </div>
                      <div className="text-sm font-black text-[#2a1a15] dark:text-[#fdf8f0] mt-1">
                        {e.employeeName}
                      </div>
                      <div className="text-xs font-bold text-[#c1352d] mt-0.5">{c.title}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold mt-1">
                        Nilai Kelulusan: {e.score}%
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setViewingCert({
                        employeeName: e.employeeName,
                        courseTitle: c.title,
                        certificateNo: e.certificateNo,
                        date: e.completedAt,
                        score: e.score,
                      })
                    }
                    className="w-full py-2 rounded-xl border border-[#c1352d]/30 bg-[#c1352d]/10 hover:bg-[#c1352d] hover:text-white text-[#c1352d] text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Buka Lembar Sertifikat</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 4. SOP DOCUMENTS TAB */}
      {activeTab === 'sops' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-[#fffdf9] dark:bg-[#1e1612] p-4 rounded-2xl border border-[#2a1a15]/10">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={sopSearch}
                onChange={e => setSopSearch(e.target.value)}
                placeholder="Cari SOP ekstraksi, kalibrasi, kebersihan..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16]"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowAddSopModal(true)}
              className="px-4 py-2 rounded-xl bg-[#c1352d] text-white text-xs font-bold hover:bg-[#a92b24] shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Dokumen SOP Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSops.map(s => (
              <div
                key={s.id}
                className="p-4 rounded-2xl bg-[#fffdf9] dark:bg-[#1e1612] border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold text-[#c1352d] bg-[#c1352d]/10 px-2 py-0.5 rounded">
                      {s.code}
                    </span>
                    <span className="text-[10px] text-gray-500">{s.lastUpdated}</span>
                  </div>

                  <h4 className="text-xs font-bold text-[#2a1a15] dark:text-[#fdf8f0] mt-2">
                    {s.title}
                  </h4>
                  <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                    {s.summary}
                  </p>
                </div>

                <div className="pt-2 border-t flex items-center justify-between text-xs">
                  <span className="text-[10px] text-gray-400">Penyusun: {s.author}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedSop(s)}
                    className="text-[#c1352d] font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Baca SOP Lengkap</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW CERTIFICATE MODAL */}
      {viewingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white text-[#111] rounded-3xl p-8 shadow-2xl border-8 border-[#fdf8f0] relative animate-in fade-in zoom-in-95 font-serif text-center space-y-4">
            <button
              onClick={() => setViewingCert(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black font-sans text-xs p-1"
            >
              ✕ Tutup
            </button>

            <div className="space-y-1">
              <div className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#c1352d]">
                ONDEWAY COFFEE COMPANY · ACADEMY
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                SERTIFIKAT KELULUSAN RESMI
              </h2>
              <div className="text-[11px] font-sans text-gray-500 font-mono">
                No: {viewingCert.certificateNo}
              </div>
            </div>

            <div className="py-4 space-y-2">
              <div className="font-sans text-xs text-gray-600">Diberikan secara terhormat kepada:</div>
              <div className="text-2xl font-black text-[#c1352d] border-b-2 border-gray-200 pb-2 max-w-md mx-auto">
                {viewingCert.employeeName}
              </div>
              <p className="font-sans text-xs text-gray-700 max-w-md mx-auto leading-relaxed pt-2">
                Atas dedikasi dan kelulusan evaluasi uji kompetensi standar internasional pada kurikulum:
              </p>
              <div className="font-sans text-sm font-bold text-gray-900">
                "{viewingCert.courseTitle}"
              </div>
              <div className="font-sans text-xs font-semibold text-emerald-700">
                Predikat: Kompeten (Skor {viewingCert.score}%)
              </div>
            </div>

            <div className="flex justify-between items-end pt-6 border-t border-gray-300 font-sans text-xs text-gray-600">
              <div className="text-left">
                <div className="font-mono text-[10px]">Tanggal: {viewingCert.date}</div>
                <div className="text-[10px] text-gray-400">Terdaftar di Database Ondeway OS</div>
              </div>

              <div className="text-right">
                <div className="font-bold text-gray-900">Siti Rahma / Fajar Nugraha</div>
                <div className="text-[10px] text-gray-500">Board of Coffee Quality Assurance</div>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-2 font-sans text-xs">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-[#c1352d] text-white font-bold hover:bg-[#a92b24] flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Lembar Sertifikat</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW SOP DETAIL MODAL */}
      {selectedSop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-[#fffdf9] dark:bg-[#1e1612] rounded-2xl shadow-2xl border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 p-6 animate-in fade-in zoom-in-95 text-xs max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <span className="font-mono text-[10px] font-bold text-[#c1352d] bg-[#c1352d]/10 px-2 py-0.5 rounded">
                  {selectedSop.code}
                </span>
                <h4 className="font-bold text-sm text-[#2a1a15] dark:text-[#fdf8f0] mt-1">
                  {selectedSop.title}
                </h4>
                <p className="text-[10px] text-gray-500">
                  Kategori: {selectedSop.category} · Pembuat: {selectedSop.author} · Update: {selectedSop.lastUpdated}
                </p>
              </div>
              <button
                onClick={() => setSelectedSop(null)}
                className="text-gray-400 hover:text-gray-700 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              <div className="p-3 rounded-xl bg-[#2a1a15]/3 dark:bg-[#fdf8f0]/3 font-semibold text-[#7a5c4b] dark:text-[#edd6b4]/80">
                Ringkasan: {selectedSop.summary}
              </div>

              <div className="whitespace-pre-line leading-relaxed text-[#2a1a15] dark:text-[#fdf8f0] p-4 bg-white dark:bg-[#1a120e] rounded-xl border border-gray-200 dark:border-gray-800">
                {selectedSop.content}
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedSop(null)}
                className="px-4 py-1.5 rounded-xl bg-[#c1352d] text-white font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW SOP MODAL */}
      {showAddSopModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form
            onSubmit={handleCreateSopSubmit}
            className="w-full max-w-lg bg-[#fffdf9] dark:bg-[#1e1612] rounded-2xl shadow-2xl border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 p-6 animate-in fade-in zoom-in-95 text-xs max-h-[90vh] overflow-y-auto space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b">
              <h4 className="font-bold text-sm text-[#2a1a15] dark:text-[#fdf8f0]">
                Tambah Standar Operasional Prosedur (SOP) Baru
              </h4>
              <button
                type="button"
                onClick={() => setShowAddSopModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1">Kode Dokumen</label>
                <input
                  type="text"
                  required
                  value={newSopCode}
                  onChange={e => setNewSopCode(e.target.value.toUpperCase())}
                  placeholder="SOP-OPS-05"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Kategori</label>
                <select
                  value={newSopCat}
                  onChange={e => setNewSopCat(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs font-semibold"
                >
                  <option value="Bar & Ekstraksi">Bar & Ekstraksi</option>
                  <option value="Kasir & Keuangan">Kasir & Keuangan</option>
                  <option value="Gudang & Roastery">Gudang & Roastery</option>
                  <option value="Kebersihan & Sanitasi">Kebersihan & Sanitasi</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold block mb-1">Judul SOP</label>
              <input
                type="text"
                required
                value={newSopTitle}
                onChange={e => setNewSopTitle(e.target.value)}
                placeholder="Contoh: SOP Penanganan Limbah Ampas Kopi & Daur Ulang"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs font-semibold"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Ringkasan Singkat</label>
              <input
                type="text"
                required
                value={newSopSummary}
                onChange={e => setNewSopSummary(e.target.value)}
                placeholder="Penjelasan ringkas tujuan SOP"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Isi Langkah Prosedur Kerja</label>
              <textarea
                required
                rows={5}
                value={newSopContent}
                onChange={e => setNewSopContent(e.target.value)}
                placeholder="1. Langkah pertama...&#10;2. Langkah kedua..."
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] text-xs"
              />
            </div>

            <div className="pt-2 border-t flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddSopModal(false)}
                className="px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-[#c1352d] text-white font-bold hover:bg-[#a92b24]"
              >
                Simpan Dokumen SOP
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
