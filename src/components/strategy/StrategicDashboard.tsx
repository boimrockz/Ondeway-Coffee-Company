import React, { useState } from 'react';
import {
  Target,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  Users,
  Cpu,
  GraduationCap,
  Network,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrgNode } from '../../types';

export const StrategicDashboard: React.FC = () => {
  const { bsc, okrs, raci, orgChart } = useApp();
  const [subTab, setSubTab] = useState<'bsc' | 'okr' | 'raci' | 'org'>('bsc');

  const renderOrgTree = (node: OrgNode) => {
    return (
      <div key={node.id} className="flex flex-col items-center">
        {/* Node Box */}
        <div className="p-3 rounded-2xl bg-white dark:bg-[#201712] border border-[#2a1a15]/15 dark:border-[#fdf8f0]/15 shadow-sm text-center min-w-[200px] hover:border-[#c1352d] transition-all">
          <div className="w-9 h-9 mx-auto rounded-full bg-[#c1352d]/10 text-[#c1352d] font-bold flex items-center justify-center text-xs mb-1.5">
            {node.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="font-bold text-xs text-[#2a1a15] dark:text-[#fdf8f0]">{node.name}</div>
          <div className="text-[10px] text-[#c1352d] font-semibold">{node.role}</div>
          <div className="text-[9px] text-gray-500">{node.department}</div>
        </div>

        {/* Children connector lines */}
        {node.children && node.children.length > 0 && (
          <div className="flex flex-col items-center w-full">
            <div className="w-0.5 h-6 bg-[#c1352d]/30" />
            <div className="flex justify-center gap-6 pt-2 border-t-2 border-[#c1352d]/20 w-full">
              {node.children.map(child => renderOrgTree(child))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#fffdf9] dark:bg-[#1e1612] p-4 rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-[#2a1a15] dark:text-[#fdf8f0] flex items-center gap-2">
            <Target className="w-4 h-4 text-[#c1352d]" />
            <span>Manajemen Kinerja & Strategi Perusahaan (OS)</span>
          </h3>
          <p className="text-[11px] text-[#7a5c4b] dark:text-[#edd6b4]/80 mt-0.5">
            Balanced Scorecard (BSC), OKR Kuartal, Matriks Akuntabilitas RACI, dan Struktur Organisasi
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#2a1a15]/5 dark:bg-[#fdf8f0]/5 p-0.5 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setSubTab('bsc')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              subTab === 'bsc'
                ? 'bg-white dark:bg-[#251b16] text-[#c1352d] shadow-xs'
                : 'text-[#7a5c4b] dark:text-[#edd6b4]'
            }`}
          >
            BSC (Balanced Scorecard)
          </button>
          <button
            type="button"
            onClick={() => setSubTab('okr')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              subTab === 'okr'
                ? 'bg-white dark:bg-[#251b16] text-[#c1352d] shadow-xs'
                : 'text-[#7a5c4b] dark:text-[#edd6b4]'
            }`}
          >
            OKR Kuartal (Q4)
          </button>
          <button
            type="button"
            onClick={() => setSubTab('raci')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              subTab === 'raci'
                ? 'bg-white dark:bg-[#251b16] text-[#c1352d] shadow-xs'
                : 'text-[#7a5c4b] dark:text-[#edd6b4]'
            }`}
          >
            Matriks RACI
          </button>
          <button
            type="button"
            onClick={() => setSubTab('org')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              subTab === 'org'
                ? 'bg-white dark:bg-[#251b16] text-[#c1352d] shadow-xs'
                : 'text-[#7a5c4b] dark:text-[#edd6b4]'
            }`}
          >
            Struktur Tim (Org)
          </button>
        </div>
      </div>

      {/* 1. BSC VIEW */}
      {subTab === 'bsc' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bsc.map(persp => (
            <div
              key={persp.id}
              className="p-5 rounded-2xl bg-[#fffdf9] dark:bg-[#1e1612] border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between border-b pb-3 border-[#2a1a15]/5">
                <div>
                  <h4 className="text-xs font-black text-[#2a1a15] dark:text-[#fdf8f0]">
                    {persp.title}
                  </h4>
                  <p className="text-[10px] text-[#7a5c4b] dark:text-[#edd6b4]/70 mt-0.5">
                    {persp.subtitle}
                  </p>
                </div>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: persp.color }}
                />
              </div>

              <div className="space-y-3">
                {persp.objectives.map(obj => (
                  <div
                    key={obj.id}
                    className="p-3 rounded-xl bg-[#2a1a15]/3 dark:bg-[#fdf8f0]/3 space-y-1.5 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-[#2a1a15] dark:text-[#fdf8f0]">
                        {obj.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          obj.status === 'good'
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                            : 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {obj.actual} (Target: {obj.target})
                      </span>
                    </div>

                    <div className="text-[10px] text-gray-500 flex justify-between">
                      <span>Metrik KPI: {obj.kpi}</span>
                      <span>PIC: {obj.pic}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[9px] font-semibold text-gray-400">
                        <span>Pencapaian:</span>
                        <span>{obj.progressPercent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${obj.progressPercent}%`,
                            backgroundColor: obj.progressPercent >= 90 ? '#2b8a66' : '#d9822b',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. OKR VIEW */}
      {subTab === 'okr' && (
        <div className="space-y-4">
          {okrs.map(okr => (
            <div
              key={okr.id}
              className="p-5 rounded-2xl bg-[#fffdf9] dark:bg-[#1e1612] border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 shadow-xs space-y-4 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#c1352d]/10 text-[#c1352d]">
                    {okr.quarter}
                  </span>
                  <h4 className="text-sm font-black text-[#2a1a15] dark:text-[#fdf8f0] mt-1">
                    {okr.objective}
                  </h4>
                </div>
                <div className="text-xs text-[#7a5c4b] dark:text-[#edd6b4]/80">
                  Lead Owner: <b>{okr.owner}</b>
                </div>
              </div>

              <div className="space-y-3">
                {okr.keyResults.map(kr => (
                  <div
                    key={kr.id}
                    className="p-3 rounded-xl bg-[#2a1a15]/3 dark:bg-[#fdf8f0]/3 space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-semibold text-[#2a1a15] dark:text-[#fdf8f0]">
                        {kr.text}
                      </span>
                      <span className="font-black text-[#c1352d] shrink-0">
                        {kr.current} / {kr.target} {kr.unit}
                      </span>
                    </div>

                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-[#c1352d] rounded-full transition-all"
                        style={{ width: `${kr.progress}%` }}
                      />
                    </div>
                    <div className="text-right text-[10px] font-bold text-gray-500">
                      {kr.progress}% Selesai
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. RACI MATRIX */}
      {subTab === 'raci' && (
        <div className="bg-[#fffdf9] dark:bg-[#1e1612] rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 overflow-hidden shadow-xs text-xs">
          <div className="p-4 bg-[#fdf8f0] dark:bg-[#251b16] border-b border-[#2a1a15]/10 flex flex-wrap gap-4 items-center justify-between text-[11px]">
            <div>
              <h4 className="font-bold text-xs text-[#2a1a15] dark:text-[#fdf8f0]">
                Matriks Tanggung Jawab Operasional (RACI Matrix)
              </h4>
              <p className="text-[10px] text-gray-500">
                Alur akuntabilitas operasional dari kebun, roastery, kasir hingga keuangan
              </p>
            </div>
            <div className="flex items-center gap-3 font-bold text-[10px]">
              <span className="text-[#c1352d]">R: Responsible (Pelaksana)</span>
              <span className="text-emerald-700">A: Accountable (Penanggung Jawab)</span>
              <span className="text-blue-700">C: Consulted (Konsultasi)</span>
              <span className="text-gray-500">I: Informed (Penerima Info)</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center">
              <thead className="bg-gray-50 dark:bg-[#1f1511] font-bold border-b text-[10px] text-gray-500 uppercase">
                <tr>
                  <th className="py-2.5 px-3 text-left">Proses Bisnis Ondeway</th>
                  <th className="py-2.5 px-2">Owner / CEO</th>
                  <th className="py-2.5 px-2">Head Roaster</th>
                  <th className="py-2.5 px-2">Head Barista</th>
                  <th className="py-2.5 px-2">Kasir (POS)</th>
                  <th className="py-2.5 px-2">Inventory Officer</th>
                  <th className="py-2.5 px-2">Finance Lead</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {raci.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-2.5 px-3 text-left font-bold text-[#2a1a15] dark:text-[#fdf8f0]">
                      {row.process}
                    </td>
                    <td className="py-2.5 px-2 font-black">{row.owner}</td>
                    <td className="py-2.5 px-2 font-black">{row.roasteryHead}</td>
                    <td className="py-2.5 px-2 font-black">{row.headBarista}</td>
                    <td className="py-2.5 px-2 font-black">{row.cashier}</td>
                    <td className="py-2.5 px-2 font-black">{row.inventoryMgr}</td>
                    <td className="py-2.5 px-2 font-black">{row.financeMgr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. ORG CHART */}
      {subTab === 'org' && (
        <div className="bg-[#fffdf9] dark:bg-[#1e1612] rounded-2xl border border-[#2a1a15]/10 dark:border-[#fdf8f0]/10 p-6 shadow-xs overflow-x-auto">
          <div className="text-center pb-6">
            <h4 className="text-sm font-extrabold text-[#2a1a15] dark:text-[#fdf8f0]">
              Struktur Organisasi Ondeway Coffee Company
            </h4>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Hierarki kepemimpinan, roastery, operasional cafe, dan keuangan
            </p>
          </div>

          <div className="min-w-[800px] flex justify-center pb-8">
            {renderOrgTree(orgChart)}
          </div>
        </div>
      )}
    </div>
  );
};
