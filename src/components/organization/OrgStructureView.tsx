import React, { useState } from 'react';
import {
  Network,
  Users,
  Plus,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Printer,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Target,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  X,
  Sparkles,
  Layers,
  ArrowRight,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrgNode, RACIRow } from '../../types';

export const OrgStructureView: React.FC = () => {
  const { orgChart, addOrgNodeChild, deleteOrgNode, raci } = useApp();

  const [activeView, setActiveView] = useState<'tree' | 'list' | 'raci'>('tree');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null);

  // Add position modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [targetParentId, setTargetParentId] = useState<string>('org-1');
  const [newPosData, setNewPosData] = useState({
    name: '',
    nik: '',
    role: '',
    department: 'Front of House',
    email: '',
    phone: '',
    responsibility1: '',
    responsibility2: '',
    kpi1: '',
  });

  // Calculate total positions
  const countNodes = (node: OrgNode): number => {
    let count = 1;
    if (node.children) {
      node.children.forEach(c => {
        count += countNodes(c);
      });
    }
    return count;
  };

  const totalPositions = countNodes(orgChart);

  // Flatten nodes for parent selector
  const flattenNodes = (node: OrgNode): { id: string; name: string; role: string }[] => {
    let list = [{ id: node.id, name: node.name, role: node.role }];
    if (node.children) {
      node.children.forEach(c => {
        list = [...list, ...flattenNodes(c)];
      });
    }
    return list;
  };

  const allAvailableParents = flattenNodes(orgChart);

  const handleOpenAddUnder = (parentId: string) => {
    setTargetParentId(parentId);
    setNewPosData({
      name: '',
      nik: `EMP-ODW-0${Math.floor(Math.random() * 90 + 10)}`,
      role: '',
      department: 'Front of House',
      email: '',
      phone: '',
      responsibility1: '',
      responsibility2: '',
      kpi1: '',
    });
    setShowAddModal(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPosData.name.trim() || !newPosData.role.trim()) return;

    const responsibilities = [newPosData.responsibility1, newPosData.responsibility2].filter(Boolean);
    const kpis = [newPosData.kpi1].filter(Boolean);

    addOrgNodeChild(targetParentId, {
      name: newPosData.name,
      nik: newPosData.nik || undefined,
      role: newPosData.role,
      department: newPosData.department,
      email: newPosData.email || `${newPosData.name.toLowerCase().replace(/\s+/g, '')}@ondeway.co.id`,
      phone: newPosData.phone || '081200000000',
      responsibilities: responsibilities.length > 0 ? responsibilities : undefined,
      kpis: kpis.length > 0 ? kpis : undefined,
      children: [],
    });

    setShowAddModal(false);
  };

  const handleDeleteNode = (id: string, name: string) => {
    if (id === orgChart.id) {
      alert('Posisi pucuk pimpinan (Founder / MD) tidak dapat dihapus.');
      return;
    }
    if (confirm(`Hapus posisi "${name}" dari struktur organisasi? Posisi bawahan juga akan terhapus.`)) {
      deleteOrgNode(id);
      if (selectedNode?.id === id) {
        setSelectedNode(null);
      }
    }
  };

  // Department color indicator
  const getDeptColor = (dept: string) => {
    if (dept.includes('Executive') || dept.includes('Board')) {
      return 'border-[#c1352d] bg-[#c1352d]/10 text-[#c1352d] ring-[#c1352d]/30';
    }
    if (dept.includes('Roastery') || dept.includes('Quality')) {
      return 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-amber-500/30';
    }
    if (dept.includes('Front') || dept.includes('Bar') || dept.includes('Cafe')) {
      return 'border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-400 ring-blue-500/30';
    }
    if (dept.includes('Finance') || dept.includes('Admin')) {
      return 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-emerald-500/30';
    }
    return 'border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-400 ring-purple-500/30';
  };

  // Render tree node recursively
  const renderTreeNode = (node: OrgNode, isRoot: boolean = false) => {
    const initials = node.name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const subCount = node.children ? node.children.length : 0;
    const deptStyle = getDeptColor(node.department);

    return (
      <div key={node.id} className="flex flex-col items-center">
        {/* Node Box */}
        <div
          onClick={() => setSelectedNode(node)}
          className={`relative p-3.5 rounded-2xl bg-white dark:bg-[#1f1712] border-2 shadow-sm text-center min-w-[210px] max-w-[240px] cursor-pointer hover:scale-102 transition-all ${
            selectedNode?.id === node.id
              ? 'border-[#c1352d] ring-4 ring-[#c1352d]/20 shadow-md'
              : 'border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 hover:border-[#c1352d]/50'
          }`}
        >
          {/* Department pill */}
          <div className="flex justify-between items-center mb-2">
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${deptStyle}`}>
              {node.department}
            </span>
            {node.nik && (
              <span className="font-mono text-[9px] text-gray-400 font-bold">
                {node.nik}
              </span>
            )}
          </div>

          {/* Avatar & Info */}
          <div className="flex items-center gap-2.5 text-left mb-2">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#c1352d] to-[#d97706] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <h5 className="font-black text-xs text-[#2a1a15] dark:text-[#fdf8f0] truncate">
                {node.name}
              </h5>
              <div className="text-[10px] font-bold text-[#c1352d] dark:text-[#f87171] truncate">
                {node.role}
              </div>
            </div>
          </div>

          {/* Subordinates & Actions info */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[10px]">
            <span className="text-gray-400 font-semibold">
              {subCount > 0 ? `${subCount} Bawahan Langsung` : 'Staf Pelaksana'}
            </span>
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                handleOpenAddUnder(node.id);
              }}
              title="Tambah Bawahan di bawah posisi ini"
              className="p-1 rounded-md bg-[#c1352d]/10 text-[#c1352d] hover:bg-[#c1352d] hover:text-white transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Tree Connectors */}
        {node.children && node.children.length > 0 && (
          <div className="flex flex-col items-center w-full">
            {/* Vertical stem down */}
            <div className="w-0.5 h-6 bg-[#c1352d]/40" />

            {/* Horizontal bar across children */}
            <div className="relative flex justify-center gap-6 pt-6 before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-[calc(100%-120px)] before:h-0.5 before:bg-[#c1352d]/30">
              {node.children.map((child, idx) => (
                <div key={child.id} className="relative flex flex-col items-center">
                  {/* Stem to child */}
                  <div className="absolute -top-6 w-0.5 h-6 bg-[#c1352d]/30" />
                  {renderTreeNode(child)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render hierarchical list
  const renderListRows = (node: OrgNode, level: number = 0) => {
    return (
      <React.Fragment key={node.id}>
        <tr
          onClick={() => setSelectedNode(node)}
          className={`hover:bg-[#2a1a15]/3 dark:hover:bg-[#fdf8f0]/3 cursor-pointer transition-colors ${
            selectedNode?.id === node.id ? 'bg-[#c1352d]/5 dark:bg-[#c1352d]/10' : ''
          }`}
        >
          <td className="py-3 px-4 font-bold text-xs" style={{ paddingLeft: `${level * 24 + 16}px` }}>
            <div className="flex items-center gap-2">
              {level > 0 && <span className="text-[#c1352d] font-mono">└─</span>}
              <span className="text-[#2a1a15] dark:text-[#fdf8f0] font-black">{node.name}</span>
              {node.nik && <span className="font-mono text-[10px] text-gray-400 font-semibold">{node.nik}</span>}
            </div>
          </td>
          <td className="py-3 px-4 text-xs font-semibold text-[#c1352d]">{node.role}</td>
          <td className="py-3 px-4 text-xs">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#c1352d]/10 text-[#c1352d]">
              {node.department}
            </span>
          </td>
          <td className="py-3 px-4 text-xs text-gray-500">{node.email}</td>
          <td className="py-3 px-4 text-xs text-center font-bold text-gray-600 dark:text-gray-300">
            {node.children ? node.children.length : 0}
          </td>
          <td className="py-3 px-4 text-center">
            <div className="flex items-center justify-center gap-1">
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  handleOpenAddUnder(node.id);
                }}
                className="p-1 rounded-md bg-[#c1352d]/10 text-[#c1352d] hover:bg-[#c1352d] hover:text-white"
                title="Tambah Subordinat"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              {level > 0 && (
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    handleDeleteNode(node.id, node.name);
                  }}
                  className="p-1 rounded-md text-red-500 hover:bg-red-50"
                  title="Hapus Posisi"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </td>
        </tr>
        {node.children && node.children.map(c => renderListRows(c, level + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-[#c1352d]/15 via-[#cf7440]/10 to-transparent p-5 rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#c1352d] uppercase tracking-wider mb-1">
            <Network className="w-4 h-4" />
            <span>Governance & Structure · Ondeway OS</span>
          </div>
          <h2 className="text-xl font-black text-[#2a1a15] dark:text-[#fdf8f0]">
            Bagan Struktur Organisasi & Akuntabilitas RACI
          </h2>
          <p className="text-xs text-[#7a5c4b] dark:text-[#edd6b4]/80 mt-1 max-w-2xl leading-relaxed">
            Peta hierarki garis pelaporan dan pertanggungjawaban divisi Roastery, Store Barista, dan Finance. Klik setiap kartu jabatan untuk meninjau deskripsi kerja, target KPI, dan subordinat langsung.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-white/70 dark:bg-[#201712]/70 p-1 rounded-xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveView('tree')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeView === 'tree'
                  ? 'bg-[#c1352d] text-white shadow-2xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Bagan Pohon Visual
            </button>
            <button
              type="button"
              onClick={() => setActiveView('list')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeView === 'list'
                  ? 'bg-[#c1352d] text-white shadow-2xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Daftar Tingkat Jabatan
            </button>
            <button
              type="button"
              onClick={() => setActiveView('raci')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeView === 'raci'
                  ? 'bg-[#c1352d] text-white shadow-2xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Matriks RACI
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleOpenAddUnder('org-1')}
            className="px-4 py-2 rounded-xl bg-[#c1352d] text-white hover:bg-[#a92b24] text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Posisi</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      {activeView === 'tree' && (
        <div className="bg-[#fffdf9] dark:bg-[#1e1612] rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs p-5 space-y-4">
          {/* Zoom controls & Summary */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500">
                Total Posisi Terdaftar: <strong className="text-[#2a1a15] dark:text-[#fdf8f0]">{totalPositions} Jabatan</strong>
              </span>
              <span className="text-xs text-gray-300 dark:text-gray-700">|</span>
              <span className="text-[11px] text-gray-400 italic">
                Tips: Klik kartu untuk melihat KPI & deskripsi tugas posisi
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setZoomLevel(Math.max(60, zoomLevel - 10))}
                className="p-1 rounded-lg hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                title="Perkecil Bagan"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-mono text-[11px]">{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel(Math.min(140, zoomLevel + 10))}
                className="p-1 rounded-lg hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                title="Perbesar Bagan"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(100)}
                className="p-1 rounded-lg hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 ml-1"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Org Tree Canvas */}
          <div className="overflow-x-auto overflow-y-auto min-h-[500px] p-6 flex justify-center bg-[#2a1a15]/2 dark:bg-[#fdf8f0]/2 rounded-xl">
            <div
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
                transition: 'transform 0.2s ease-out',
              }}
              className="inline-block"
            >
              {renderTreeNode(orgChart, true)}
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {activeView === 'list' && (
        <div className="bg-[#fffdf9] dark:bg-[#1e1612] rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#2a1a15]/5 dark:bg-[#fdf8f0]/5 border-b border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 font-bold uppercase tracking-wider text-[10px] text-gray-500">
                <tr>
                  <th className="py-3 px-4">Tingkat Hirarki Jabatan & Nama</th>
                  <th className="py-3 px-4">Posisi (Role)</th>
                  <th className="py-3 px-4">Departemen</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4 text-center">Subordinat</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a1a15]/5 dark:divide-[#fdf8f0]/5">
                {renderListRows(orgChart, 0)}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RACI Matrix View */}
      {activeView === 'raci' && (
        <div className="bg-[#fffdf9] dark:bg-[#1e1612] rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs overflow-hidden p-5 space-y-4">
          <div>
            <h3 className="font-black text-sm text-[#2a1a15] dark:text-[#fdf8f0]">
              Matriks Akuntabilitas RACI (Proses Utama Ondeway Coffee)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              R = Responsible (Pelaksana) · A = Accountable (Penanggung Jawab Akhir) · C = Consulted (Konsultasi Ahli) · I = Informed (Penerima Laporan)
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-gray-200 dark:border-gray-800">
              <thead className="bg-[#2a1a15]/5 dark:bg-[#fdf8f0]/5 font-bold uppercase text-[10px] text-gray-500">
                <tr>
                  <th className="py-3 px-4">Proses Operasional Utama</th>
                  <th className="py-3 px-3 text-center">Owner / MD</th>
                  <th className="py-3 px-3 text-center">Head Roaster</th>
                  <th className="py-3 px-3 text-center">Head Barista</th>
                  <th className="py-3 px-3 text-center">Lead Kasir</th>
                  <th className="py-3 px-3 text-center">Inventory Mgr</th>
                  <th className="py-3 px-3 text-center">Finance Lead</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {raci.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <td className="py-3 px-4 font-bold text-[#2a1a15] dark:text-[#fdf8f0]">
                      {row.process}
                    </td>
                    <td className="py-3 px-3 text-center font-black">
                      <span className={`px-2 py-0.5 rounded ${row.owner === 'A' ? 'bg-red-500/10 text-red-600' : 'text-gray-500'}`}>{row.owner}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-black">
                      <span className={`px-2 py-0.5 rounded ${row.roasteryHead === 'R' ? 'bg-emerald-500/10 text-emerald-600' : row.roasteryHead === 'A' ? 'bg-red-500/10 text-red-600' : 'text-gray-500'}`}>{row.roasteryHead}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-black">
                      <span className={`px-2 py-0.5 rounded ${row.headBarista === 'R' ? 'bg-emerald-500/10 text-emerald-600' : row.headBarista === 'A' ? 'bg-red-500/10 text-red-600' : 'text-gray-500'}`}>{row.headBarista}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-black">
                      <span className={`px-2 py-0.5 rounded ${row.cashier === 'R' ? 'bg-emerald-500/10 text-emerald-600' : 'text-gray-500'}`}>{row.cashier}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-black">
                      <span className={`px-2 py-0.5 rounded ${row.inventoryMgr === 'R' ? 'bg-emerald-500/10 text-emerald-600' : 'text-gray-500'}`}>{row.inventoryMgr}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-black">
                      <span className={`px-2 py-0.5 rounded ${row.financeMgr === 'A' ? 'bg-red-500/10 text-red-600' : 'text-gray-500'}`}>{row.financeMgr}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Node Detail Modal */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#fffdf9] dark:bg-[#1e1612] w-full max-w-md rounded-3xl border border-[#2a1a15]/20 dark:border-[#fdf8f0]/20 shadow-2xl overflow-hidden">
            <div className="p-5 bg-linear-to-r from-[#c1352d]/15 to-transparent border-b border-[#2a1a15]/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Network className="w-5 h-5 text-[#c1352d]" />
                <h3 className="font-black text-base text-[#2a1a15] dark:text-[#fdf8f0]">
                  Detail Posisi & Tanggung Jawab
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded-xl hover:bg-black/10 text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 rounded-2xl bg-[#c1352d] text-white flex items-center justify-center font-black text-base shadow-sm">
                  {selectedNode.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-black text-sm text-[#2a1a15] dark:text-[#fdf8f0]">
                    {selectedNode.name}
                  </h4>
                  <div className="text-xs font-bold text-[#c1352d]">{selectedNode.role}</div>
                  <div className="text-[10px] text-gray-500 font-semibold">{selectedNode.department} · {selectedNode.nik || 'EMP'}</div>
                </div>
              </div>

              {/* Responsibilities */}
              {selectedNode.responsibilities && selectedNode.responsibilities.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-gray-500 block mb-1">
                    Tanggung Jawab Utama (Job Description):
                  </span>
                  <ul className="space-y-1 list-disc list-inside text-gray-700 dark:text-gray-300">
                    {selectedNode.responsibilities.map((r, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* KPIs */}
              {selectedNode.kpis && selectedNode.kpis.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400 block mb-1 flex items-center gap-1">
                    <Target className="w-3.5 h-3.5" />
                    <span>Target Key Performance Indicators (KPI):</span>
                  </span>
                  <ul className="space-y-0.5 list-disc list-inside text-amber-900 dark:text-amber-300 font-semibold text-[11px]">
                    {selectedNode.kpis.map((kpi, idx) => (
                      <li key={idx}>{kpi}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Direct Reports */}
              <div>
                <span className="text-[11px] font-bold text-gray-500 block mb-1">
                  Subordinat / Bawahan Langsung ({selectedNode.children ? selectedNode.children.length : 0}):
                </span>
                {selectedNode.children && selectedNode.children.length > 0 ? (
                  <div className="space-y-1.5">
                    {selectedNode.children.map(child => (
                      <div
                        key={child.id}
                        onClick={() => setSelectedNode(child)}
                        className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#201712] flex items-center justify-between cursor-pointer hover:border-[#c1352d]"
                      >
                        <div>
                          <div className="font-bold text-[#2a1a15] dark:text-[#fdf8f0]">{child.name}</div>
                          <div className="text-[10px] text-[#c1352d]">{child.role}</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 italic text-[11px]">Tidak ada bawahan langsung.</div>
                )}
              </div>

              {/* Action */}
              <div className="pt-2 flex justify-between gap-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => handleOpenAddUnder(selectedNode.id)}
                  className="px-3 py-1.5 rounded-xl bg-[#c1352d] text-white font-bold text-xs flex items-center gap-1 hover:bg-[#a92b24]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Bawahan</span>
                </button>
                {selectedNode.id !== orgChart.id && (
                  <button
                    type="button"
                    onClick={() => handleDeleteNode(selectedNode.id, selectedNode.name)}
                    className="px-3 py-1.5 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 font-bold text-xs"
                  >
                    Hapus Posisi
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Position Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#fffdf9] dark:bg-[#1e1612] w-full max-w-lg rounded-3xl border border-[#2a1a15]/20 dark:border-[#fdf8f0]/20 shadow-2xl overflow-hidden my-8">
            <div className="p-5 bg-linear-to-r from-[#c1352d]/15 to-transparent border-b border-[#2a1a15]/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Network className="w-5 h-5 text-[#c1352d]" />
                <h3 className="font-black text-base text-[#2a1a15] dark:text-[#fdf8f0]">
                  Tambah Posisi ke Bagan Organisasi
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-xl hover:bg-black/10 text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-600 dark:text-gray-300 block mb-1">
                  Atasan Langsung (Reports To) *
                </label>
                <select
                  value={targetParentId}
                  onChange={e => setTargetParentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] font-semibold"
                >
                  {allAvailableParents.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-600 dark:text-gray-300 block mb-1">
                    Nama Staf / Pejabat *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPosData.name}
                    onChange={e => setNewPosData({ ...newPosData, name: e.target.value })}
                    placeholder="Contoh: Rendi Saputra"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-600 dark:text-gray-300 block mb-1">
                    NIK Pegawai
                  </label>
                  <input
                    type="text"
                    value={newPosData.nik}
                    onChange={e => setNewPosData({ ...newPosData, nik: e.target.value.toUpperCase() })}
                    placeholder="EMP-ODW-012"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-600 dark:text-gray-300 block mb-1">
                    Jabatan (Role) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPosData.role}
                    onChange={e => setNewPosData({ ...newPosData, role: e.target.value })}
                    placeholder="Contoh: Junior Barista"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-600 dark:text-gray-300 block mb-1">
                    Departemen *
                  </label>
                  <select
                    value={newPosData.department}
                    onChange={e => setNewPosData({ ...newPosData, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16]"
                  >
                    <option value="Front of House">Front of House</option>
                    <option value="Roastery & Quality Lab">Roastery & Quality Lab</option>
                    <option value="Kitchen & Pastry">Kitchen & Pastry</option>
                    <option value="Finance & Admin">Finance & Admin</option>
                    <option value="Executive Board">Executive Board</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-600 dark:text-gray-300 block mb-1">
                  Tanggung Jawab Utama
                </label>
                <input
                  type="text"
                  value={newPosData.responsibility1}
                  onChange={e => setNewPosData({ ...newPosData, responsibility1: e.target.value })}
                  placeholder="Deskripsi tugas utama posisi ini"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-600 dark:text-gray-300 block mb-1">
                  Target KPI Utama
                </label>
                <input
                  type="text"
                  value={newPosData.kpi1}
                  onChange={e => setNewPosData({ ...newPosData, kpi1: e.target.value })}
                  placeholder="Target pencapaian keberhasilan posisi"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#251b16]"
                />
              </div>

              <div className="pt-3 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border text-gray-600 dark:text-gray-300 hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#c1352d] text-white font-bold hover:bg-[#a92b24]"
                >
                  Tambahkan ke Struktur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
