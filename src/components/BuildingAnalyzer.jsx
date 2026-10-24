import React, { useState, useMemo } from 'react';
import { annEngine, getNumericGrade, getZoneMultiplier } from '../utils/annEngine';
import { 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  FileCheck
} from 'lucide-react';

export default function BuildingAnalyzer() {
  const [buildingInputs, setBuildingInputs] = useState({
    storeys: 'G+6',
    zone: 'IV',
    concreteGrade: 'M25',
    steelGrade: 'Fe500',
    sbc: 220,
    spanLx: 4.5,
    spanLy: 6.0,
    liveLoad: 4.0
  });

  const numFloors = parseInt(buildingInputs.storeys.replace('G+', ''), 10) + 1;

  // Compute building wide structural estimations
  const buildingResults = useMemo(() => {
    const fc = getNumericGrade(buildingInputs.concreteGrade);
    const fy = getNumericGrade(buildingInputs.steelGrade);
    const zoneMult = getZoneMultiplier(buildingInputs.zone);
    const sbc = buildingInputs.sbc;

    const floorArea = buildingInputs.spanLx * buildingInputs.spanLy;
    const loadPerSqM = 12.0 + buildingInputs.liveLoad;
    const colAxialLoad = Math.round(floorArea * loadPerSqM * numFloors * 0.85);

    const reqSide = Number((Math.sqrt((colAxialLoad * 1.1) / sbc)).toFixed(2));
    const footingRes = annEngine.predictComponent('footing', {
      Footing_Length_m: reqSide,
      Footing_Width_m: reqSide,
      Footing_Size_m: reqSide,
      Footing_Thickness_mm: 550,
      SBC_kN_m2: sbc,
      Column_Load_kN: colAxialLoad,
      Concrete_Grade: buildingInputs.concreteGrade,
      Steel_Grade: buildingInputs.steelGrade
    });

    const groundBeamRes = annEngine.predictComponent('groundBeam', {
      GB_Length_m: buildingInputs.spanLx,
      GB_UDL_kN_m: Math.round(20 + numFloors * 2),
      Concrete_Grade: buildingInputs.concreteGrade,
      Steel_Grade: buildingInputs.steelGrade
    });

    const plinthBeamRes = annEngine.predictComponent('plinthBeam', {
      PB_Length_m: buildingInputs.spanLx,
      PB_UDL_kN_m: 14,
      Column_Position: 'Edge',
      Concrete_Grade: buildingInputs.concreteGrade,
      Steel_Grade: buildingInputs.steelGrade
    });

    const columnRes = annEngine.predictComponent('column', {
      Column_Axial_kN: colAxialLoad,
      Mx_kNm: Math.round(45 + numFloors * 8 * zoneMult * 4),
      My_kNm: Math.round(35 + numFloors * 6 * zoneMult * 4),
      Column_Position: 'Interior',
      Column_Axial_Type: 'Biaxial',
      Concrete_Grade: buildingInputs.concreteGrade,
      Steel_Grade: buildingInputs.steelGrade
    });

    const lintelRes = annEngine.predictComponent('lintel', {
      Lintel_Length_m: 1.8,
      Lintel_UDL_kN_m: 8.5,
      Concrete_Grade: buildingInputs.concreteGrade,
      Steel_Grade: buildingInputs.steelGrade
    });

    const floorBeamRes = annEngine.predictComponent('floorBeam', {
      FloorBeam_Length_m: buildingInputs.spanLy,
      FloorBeam_UDL_kN_m: Math.round(18 + buildingInputs.liveLoad * 3),
      FloorBeam_Position: 'Y',
      Concrete_Grade: buildingInputs.concreteGrade,
      Steel_Grade: buildingInputs.steelGrade
    });

    const slabRes = annEngine.predictComponent('slab', {
      Slab_lx_m: buildingInputs.spanLx,
      Slab_ly_m: buildingInputs.spanLy,
      Slab_Thickness_mm: 140,
      Slab_Load_kN_m2: Math.round(5.0 + buildingInputs.liveLoad + 1.5),
      Concrete_Grade: buildingInputs.concreteGrade,
      Steel_Grade: buildingInputs.steelGrade
    });

    return [
      { id: 'footing', name: 'Footing', res: footingRes },
      { id: 'groundBeam', name: 'Ground Beam', res: groundBeamRes },
      { id: 'plinthBeam', name: 'Plinth Beam', res: plinthBeamRes },
      { id: 'column', name: 'RC Column', res: columnRes },
      { id: 'lintel', name: 'Lintel Beam', res: lintelRes },
      { id: 'floorBeam', name: 'Floor Beam', res: floorBeamRes },
      { id: 'slab', name: 'RC Slab Panel', res: slabRes },
    ];
  }, [buildingInputs, numFloors]);

  return (
    <div className="space-y-6">
      {/* Building Configurations Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              Whole-Building Structural Preliminary Design Suite
            </h2>
            <p className="text-xs text-slate-500">
              Input overall building configuration to generate preliminary design sizes and responses for all 7 RC members simultaneously
            </p>
          </div>
          <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold px-3 py-1 rounded-full">
            IS 456 & IS 1893 Integrated
          </span>
        </div>

        {/* Input Parameters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <div>
            <label className="text-[11px] text-slate-600 font-bold">Storeys</label>
            <select
              value={buildingInputs.storeys}
              onChange={(e) => setBuildingInputs(p => ({ ...p, storeys: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg p-2 text-xs font-bold mt-1"
            >
              {['G+3', 'G+4', 'G+5', 'G+6', 'G+7', 'G+8'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-600 font-bold">Seismic Zone</label>
            <select
              value={buildingInputs.zone}
              onChange={(e) => setBuildingInputs(p => ({ ...p, zone: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg p-2 text-xs font-bold mt-1"
            >
              {['II', 'III', 'IV', 'V'].map(z => <option key={z} value={z}>Zone {z}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-600 font-bold">Concrete Grade</label>
            <select
              value={buildingInputs.concreteGrade}
              onChange={(e) => setBuildingInputs(p => ({ ...p, concreteGrade: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg p-2 text-xs font-bold mt-1"
            >
              {['M20', 'M25', 'M30', 'M35', 'M40'].map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-600 font-bold">Steel Grade</label>
            <select
              value={buildingInputs.steelGrade}
              onChange={(e) => setBuildingInputs(p => ({ ...p, steelGrade: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg p-2 text-xs font-bold mt-1"
            >
              {['Fe415', 'Fe500'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-600 font-bold">Soil SBC (kN/m²)</label>
            <input
              type="number"
              value={buildingInputs.sbc}
              onChange={(e) => setBuildingInputs(p => ({ ...p, sbc: parseFloat(e.target.value) || 200 }))}
              className="w-full bg-slate-50 border border-slate-300 text-indigo-700 rounded-lg p-2 text-xs font-bold mt-1 text-right"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-600 font-bold">Bay Span Lx (m)</label>
            <input
              type="number"
              step="0.1"
              value={buildingInputs.spanLx}
              onChange={(e) => setBuildingInputs(p => ({ ...p, spanLx: parseFloat(e.target.value) || 4.5 }))}
              className="w-full bg-slate-50 border border-slate-300 text-indigo-700 rounded-lg p-2 text-xs font-bold mt-1 text-right"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-600 font-bold">Bay Span Ly (m)</label>
            <input
              type="number"
              step="0.1"
              value={buildingInputs.spanLy}
              onChange={(e) => setBuildingInputs(p => ({ ...p, spanLy: parseFloat(e.target.value) || 6.0 }))}
              className="w-full bg-slate-50 border border-slate-300 text-indigo-700 rounded-lg p-2 text-xs font-bold mt-1 text-right"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-600 font-bold">Imposed Load (kN/m²)</label>
            <input
              type="number"
              step="0.5"
              value={buildingInputs.liveLoad}
              onChange={(e) => setBuildingInputs(p => ({ ...p, liveLoad: parseFloat(e.target.value) || 3.0 }))}
              className="w-full bg-slate-50 border border-slate-300 text-indigo-700 rounded-lg p-2 text-xs font-bold mt-1 text-right"
            />
          </div>
        </div>
      </div>

      {/* Building Frame 2D Visualization & Preliminary Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 2D Building Structural Frame Elevation Canvas */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-indigo-600" />
              Structural Frame Model ({buildingInputs.storeys})
            </h3>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Zone {buildingInputs.zone}
            </span>
          </div>

          <svg viewBox="0 0 260 360" className="w-full h-auto bg-slate-50 rounded-xl border border-slate-200 p-3">
            {/* Ground Soil Hatch */}
            <rect x="20" y="310" width="220" height="40" fill="#e2e8f0" rx="2" />
            <line x1="20" y1="310" x2="240" y2="310" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,2" />

            {/* Footings */}
            <rect x="35" y="295" width="40" height="15" fill="#cbd5e1" stroke="#0284c7" strokeWidth="1.5" />
            <rect x="110" y="295" width="40" height="15" fill="#cbd5e1" stroke="#0284c7" strokeWidth="1.5" />
            <rect x="185" y="295" width="40" height="15" fill="#cbd5e1" stroke="#0284c7" strokeWidth="1.5" />

            {/* Columns */}
            <line x1="55" y1="30" x2="55" y2="295" stroke="#475569" strokeWidth="6" />
            <line x1="130" y1="30" x2="130" y2="295" stroke="#475569" strokeWidth="8" />
            <line x1="205" y1="30" x2="205" y2="295" stroke="#475569" strokeWidth="6" />

            {/* Floor Beams & Slabs across storeys */}
            {[50, 90, 130, 170, 210, 250, 280].slice(0, numFloors).map((y, idx) => (
              <g key={y}>
                <line x1="45" y1={y} x2="215" y2={y} stroke="#0284c7" strokeWidth="4" />
                <text x="225" y={y+3} fill="#64748b" fontSize="8" fontWeight="bold">F{numFloors - idx}</text>
              </g>
            ))}

            <text x="130" y="340" fill="#059669" fontSize="10" textAnchor="middle" fontWeight="bold">
              Est. Max Column Load Pu ≈ {buildingResults.find(b => b.id === 'column')?.res.userInputs.Column_Axial_kN} kN
            </text>
          </svg>
        </div>

        {/* 7 RC Members Preliminary Design Results Table */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                ANN & IS 456 Structural Member Preliminary Design Schedule
              </h3>
              <p className="text-xs text-slate-500">
                Recommended member dimensions, steel reinforcement and compliance status
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <th className="p-2.5 font-bold">Member</th>
                  <th className="p-2.5 font-bold">Key ANN Responses</th>
                  <th className="p-2.5 font-bold">Rec. Dimensions (b × D)</th>
                  <th className="p-2.5 font-bold">Steel Reinforcement</th>
                  <th className="p-2.5 font-bold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {buildingResults.map(item => {
                  const rec = item.res?.designRecommendation;
                  const ann = item.res?.annPredictions || {};

                  let responseText = '';
                  if (item.id === 'footing') responseText = `Mu: ${ann.Footing_Moment_kNm} kNm | δ: ${ann.Settlement_mm}mm`;
                  else if (item.id === 'groundBeam') responseText = `Mu: ${ann.GB_Moment} kNm | Δ: ${ann.GB_Deflection_mm}mm`;
                  else if (item.id === 'plinthBeam') responseText = `Mu: ${ann.PB_Moment} kNm | Vu: ${ann.PB_Shear} kN`;
                  else if (item.id === 'column') responseText = `Vu: ${ann.Column_Shear_kN} kN | σ: ${ann.Column_Stress_MPa} MPa`;
                  else if (item.id === 'lintel') responseText = `Mu: ${ann.Lintel_Moment} kNm | Δ: ${ann.Lintel_Deflection_mm}mm`;
                  else if (item.id === 'floorBeam') responseText = `Mu: ${ann.FloorBeam_Moment} kNm | Tu: ${ann.Torsion} kNm`;
                  else if (item.id === 'slab') responseText = `Mx: ${ann.Slab_Mx} kNm/m | My: ${ann.Slab_My}`;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-2.5 font-extrabold text-slate-900">{item.name}</td>
                      <td className="p-2.5 text-indigo-700 font-semibold">{responseText}</td>
                      <td className="p-2.5 font-black text-slate-900">
                        {rec?.sectionWidth} × {rec?.sectionDepth} mm
                      </td>
                      <td className="p-2.5 text-slate-700 font-medium max-w-[220px]">
                        <span className="line-clamp-2">{rec?.recommendedRebar}</span>
                      </td>
                      <td className="p-2.5 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          rec?.isSafe 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                            : 'bg-amber-50 text-amber-700 border-amber-300'
                        }`}>
                          {rec?.isSafe ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                          {rec?.isSafe ? 'PASS' : 'CHECK'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
