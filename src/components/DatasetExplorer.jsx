import React, { useState, useMemo, useRef } from 'react';
import { useDataset } from '../context/DatasetContext';
import {
  Search,
  Download,
  Database,
  ChevronLeft,
  ChevronRight,
  Upload,
  Cpu,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Trash2,
  FileUp
} from 'lucide-react';

export default function DatasetExplorer() {
  const {
    baseDataset,
    userRows,
    mergedDataset,
    uploadLog,
    isTraining,
    handleFileUpload,
    clearUserData,
  } = useDataset();

  const [searchTerm,       setSearchTerm]       = useState('');
  const [selectedZone,     setSelectedZone]      = useState('ALL');
  const [selectedFloors,   setSelectedFloors]    = useState('ALL');
  const [selectedConcrete, setSelectedConcrete]  = useState('ALL');
  const [sourceFilter,     setSourceFilter]      = useState('ALL'); // ALL | base | user
  const [currentPage,      setCurrentPage]       = useState(1);
  const [dragOver,         setDragOver]          = useState(false);
  const itemsPerPage = 15;
  const fileInputRef = useRef(null);

  // ── Filtering ───────────────────────────────────────────────────────────────
  const filteredDataset = useMemo(() => {
    return mergedDataset.filter(row => {
      const matchSearch = searchTerm === '' ||
        String(row.Building_ID).includes(searchTerm) ||
        String(row.Floors   ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(row.Zone     ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(row.Concrete_Grade ?? '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchZone     = selectedZone     === 'ALL' || row.Zone          === selectedZone;
      const matchFloors   = selectedFloors   === 'ALL' || row.Floors        === selectedFloors;
      const matchConcrete = selectedConcrete === 'ALL' || row.Concrete_Grade === selectedConcrete;
      const matchSource   = sourceFilter     === 'ALL' || (row._source ?? 'base') === sourceFilter;

      return matchSearch && matchZone && matchFloors && matchConcrete && matchSource;
    });
  }, [mergedDataset, searchTerm, selectedZone, selectedFloors, selectedConcrete, sourceFilter]);

  const totalPages   = Math.ceil(filteredDataset.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDataset.slice(start, start + itemsPerPage);
  }, [filteredDataset, currentPage]);

  // ── CSV Export ───────────────────────────────────────────────────────────────
  const exportCSV = () => {
    if (filteredDataset.length === 0) return;
    const keys = Object.keys(filteredDataset[0]).filter(k => k !== '_source');
    const csvContent = [
      keys.join(','),
      ...filteredDataset.map(row => keys.map(k => `"${row[k] ?? ''}"`).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `RC_Structural_Dataset_${filteredDataset.length}_records.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Drag & Drop ─────────────────────────────────────────────────────────────
  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  // ── Log icon helper ─────────────────────────────────────────────────────────
  const LogIcon = uploadLog?.type === 'success' ? CheckCircle2
                : uploadLog?.type === 'error'   ? AlertTriangle
                : Info;
  const logColors = uploadLog?.type === 'success'
    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
    : uploadLog?.type === 'error'
    ? 'bg-red-50 border-red-300 text-red-800'
    : 'bg-blue-50 border-blue-300 text-blue-800';

  return (
    <div className="space-y-6">
      {/* ── Hybrid Training Upload Panel ──────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Cpu className="w-5 h-5 text-indigo-600" />
          <div>
            <h2 className="font-bold text-base text-slate-900">Hybrid ANN Training — Upload Your Dataset</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload a CSV file with RC structural data. The ANN will retrain on your data combined with the built-in base dataset for improved accuracy.
            </p>
          </div>
        </div>

        {/* Drag-and-drop / Click zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
            dragOver
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
            <FileUp className="w-7 h-7 text-indigo-600" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-slate-800">Drag &amp; drop a CSV file here</p>
            <p className="text-xs text-slate-500 mt-1">or <span className="text-indigo-600 font-semibold underline">click to browse</span> — only .csv files accepted</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={e => handleFileUpload(e.target.files[0])}
          />
        </div>

        {/* Expected CSV format hint */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 space-y-1">
          <div className="font-bold text-slate-700 mb-1">📋 Expected CSV Column Format (minimum required):</div>
          <code className="block text-[10px] bg-white border border-slate-200 rounded px-3 py-2 overflow-x-auto text-slate-800 leading-relaxed">
            Building_ID, Floors, Zone, Concrete_Grade, Steel_Grade, Footing_Size_m, Footing_Thickness_mm, Column_Load_kN, Mx_kNm, My_kNm, Footing_Moment_kNm, GB_Moment, Column_Axial_kN, FloorBeam_Moment, Slab_Mx …
          </code>
          <p className="text-slate-500">Any extra columns are preserved. Numeric values are auto-detected.</p>
        </div>

        {/* Training feedback log */}
        {isTraining && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-300 text-amber-800 rounded-xl px-4 py-3 text-sm font-semibold animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Re-training ANN on merged dataset… please wait
          </div>
        )}
        {uploadLog && !isTraining && (
          <div className={`flex items-start gap-3 border rounded-xl px-4 py-3 text-sm font-semibold ${logColors}`}>
            <LogIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{uploadLog.message}</span>
          </div>
        )}

        {/* Clear user data button */}
        {userRows.length > 0 && (
          <button
            onClick={clearUserData}
            className="flex items-center gap-2 text-xs text-red-600 hover:text-red-700 font-bold border border-red-200 hover:border-red-300 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove uploaded data &amp; reset to base dataset
          </button>
        )}
      </div>

      {/* ── Dataset Header + Export ───────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600" />
            RC Building Structural Members Dataset Explorer
          </h2>
          <p className="text-xs text-slate-500">
            Geometry, loading conditions, materials, and computed structural responses
            {userRows.length > 0 && <span className="ml-1 text-emerald-600 font-semibold">· {userRows.length} user records included</span>}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full font-bold">
            Showing {filteredDataset.length} of {mergedDataset.length} Records
          </span>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-600/20"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* ── Search & Filters ─────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search ID, Zone, Floors…"
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
          />
        </div>

        {/* Zone */}
        <select value={selectedZone} onChange={e => { setSelectedZone(e.target.value); setCurrentPage(1); }}
          className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2.5 cursor-pointer">
          <option value="ALL">All Seismic Zones</option>
          {['II','III','IV','V'].map(z => <option key={z} value={z}>Zone {z}</option>)}
        </select>

        {/* Floors */}
        <select value={selectedFloors} onChange={e => { setSelectedFloors(e.target.value); setCurrentPage(1); }}
          className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2.5 cursor-pointer">
          <option value="ALL">All Storeys</option>
          {['G+3','G+4','G+5','G+6','G+7','G+8'].map(f => <option key={f} value={f}>{f}</option>)}
        </select>

        {/* Source */}
        <select value={sourceFilter} onChange={e => { setSourceFilter(e.target.value); setCurrentPage(1); }}
          className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2.5 cursor-pointer">
          <option value="ALL">All Sources</option>
          <option value="base">Base Dataset</option>
          <option value="user">User Uploaded</option>
        </select>
      </div>

      {/* ── Data Table ────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 whitespace-nowrap">
                <th className="p-3 font-bold">Source</th>
                <th className="p-3 font-bold">ID</th>
                <th className="p-3 font-bold">Floors</th>
                <th className="p-3 font-bold">Zone</th>
                <th className="p-3 font-bold">Conc. / Steel</th>
                <th className="p-3 font-bold">Footing Size (m)</th>
                <th className="p-3 font-bold">Footing Mu (kNm)</th>
                <th className="p-3 font-bold">GB Moment (kNm)</th>
                <th className="p-3 font-bold">Col. Load (kN)</th>
                <th className="p-3 font-bold">Col. Mx (kNm)</th>
                <th className="p-3 font-bold">Beam Moment</th>
                <th className="p-3 font-bold">Slab Mx (kNm/m)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={12} className="p-8 text-center text-slate-400 font-semibold">
                    No records match the current filters.
                  </td>
                </tr>
              ) : paginatedData.map((row, idx) => {
                const isUser = row._source === 'user';
                return (
                  <tr key={`${row.Building_ID}-${idx}`} className={`hover:bg-slate-50 transition-colors whitespace-nowrap ${isUser ? 'bg-emerald-50/40' : ''}`}>
                    <td className="p-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isUser ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
                        {isUser ? 'User' : 'Base'}
                      </span>
                    </td>
                    <td className="p-3 font-black text-indigo-600">#{row.Building_ID}</td>
                    <td className="p-3 font-bold text-slate-800">{row.Floors ?? '—'}</td>
                    <td className="p-3 font-extrabold text-amber-700">{row.Zone ? `Zone ${row.Zone}` : '—'}</td>
                    <td className="p-3 text-slate-700 font-medium">{row.Concrete_Grade ?? '—'} / {row.Steel_Grade ?? '—'}</td>
                    <td className="p-3 text-slate-700 font-medium">{row.Footing_Size_m ? `${row.Footing_Size_m}m (${row.Footing_Thickness_mm}mm)` : '—'}</td>
                    <td className="p-3 font-bold text-slate-900">{row.Footing_Moment_kNm ?? '—'}</td>
                    <td className="p-3 text-slate-700 font-medium">{row.GB_Moment ?? '—'}</td>
                    <td className="p-3 font-extrabold text-emerald-700">{row.Column_Axial_kN ?? '—'}</td>
                    <td className="p-3 text-slate-700 font-medium">{row.Mx_kNm ?? '—'}</td>
                    <td className="p-3 text-slate-700 font-medium">{row.FloorBeam_Moment ?? '—'}</td>
                    <td className="p-3 font-bold text-indigo-700">{row.Slab_Mx ?? '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 font-medium">
          <div>
            Page <strong className="text-slate-900 font-bold">{currentPage}</strong> of <strong className="text-slate-900 font-bold">{totalPages}</strong>
            <span className="ml-3 text-slate-400">({filteredDataset.length} records)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
