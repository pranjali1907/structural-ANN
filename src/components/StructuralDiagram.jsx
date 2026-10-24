import React from 'react';

export default function StructuralDiagram({ componentId, inputs, outputs, design }) {
  const fck = inputs.Concrete_Grade || 'M25';
  const fy = inputs.Steel_Grade || 'Fe500';

  // Component-specific light theme SVG renderer with exact text alignments
  const renderDiagram = () => {
    switch (componentId) {
      case 'footing': {
        const L = inputs.Footing_Length_m || inputs.Footing_Size_m || 2.8;
        const B = inputs.Footing_Width_m || 2.5;
        const D = inputs.Footing_Thickness_mm || 500;
        const P = inputs.Column_Load_kN || 1200;
        const settlement = outputs.Settlement_mm || 14;
        const totalArea = (L * B).toFixed(2);
        const qSoil = ((P * 1.1) / (L * B)).toFixed(1);

        return (
          <svg viewBox="0 0 500 260" className="w-full h-auto bg-slate-50 rounded-xl border border-slate-200 p-2">
            <defs>
              <pattern id="hatchLight" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="10" stroke="#cbd5e1" strokeWidth="1" />
              </pattern>
              <linearGradient id="columnGradLight" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="50%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
              <linearGradient id="footingGradLight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f1f5f9" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
            </defs>

            {/* Soil Hatching Background */}
            <rect x="30" y="170" width="440" height="50" fill="url(#hatchLight)" rx="4" />
            <line x1="30" y1="170" x2="470" y2="170" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />

            {/* Column Load Text & Arrow */}
            <text x="250" y="18" fill="#dc2626" fontSize="12" fontWeight="bold" textAnchor="middle">
              Axial Load Pu = {P} kN
            </text>
            <g>
              <line x1="250" y1="22" x2="250" y2="48" stroke="#dc2626" strokeWidth="3" />
              <polygon points="250,53 245,43 255,43" fill="#dc2626" />
            </g>

            {/* Column Pedestal */}
            <rect x="220" y="54" width="60" height="76" fill="url(#columnGradLight)" stroke="#475569" strokeWidth="2" rx="2" />
            <text x="250" y="96" fill="#0f172a" fontSize="10" textAnchor="middle" fontWeight="bold">
              400×400 Col
            </text>

            {/* Trapezoidal Footing Body */}
            <polygon 
              points="60,170 440,170 330,130 170,130" 
              fill="url(#footingGradLight)" 
              stroke="#0284c7" 
              strokeWidth="2.5" 
            />
            {/* Main Reinforcement Mesh */}
            <line x1="75" y1="162" x2="425" y2="162" stroke="#d97706" strokeWidth="3.5" strokeDasharray="6,2" />
            {[100, 150, 200, 250, 300, 350, 400].map(cx => (
              <circle key={cx} cx={cx} cy="162" r="3" fill="#dc2626" />
            ))}

            {/* Footing Plan Dimensions L x B */}
            <line x1="60" y1="188" x2="440" y2="188" stroke="#475569" strokeWidth="1" />
            <line x1="60" y1="183" x2="60" y2="193" stroke="#475569" strokeWidth="1" />
            <line x1="440" y1="183" x2="440" y2="193" stroke="#475569" strokeWidth="1" />
            <text x="250" y="202" fill="#0f172a" fontSize="11" textAnchor="middle" fontWeight="bold">
              Footing Plan: L = {L} m × B = {B} m ({Math.round(L*1000)} × {Math.round(B*1000)} mm)
            </text>

            {/* Side Thickness Dimension */}
            <line x1="452" y1="130" x2="452" y2="170" stroke="#0284c7" strokeWidth="1" />
            <text x="458" y="153" fill="#0284c7" fontSize="10" fontWeight="bold">D = {D}mm</text>

            {/* Soil Pressure Reaction Arrows */}
            <g stroke="#059669" strokeWidth="1.5">
              {[80, 135, 190, 250, 310, 365, 420].map((x, i) => (
                <g key={i}>
                  <line x1={x} y1="238" x2={x} y2="220" />
                  <polygon points={`${x},217 ${x-3},225 ${x+3},225`} fill="#059669" />
                </g>
              ))}
            </g>
            <text x="250" y="252" fill="#059669" fontSize="10" textAnchor="middle" fontWeight="bold">
              Soil Reaction q = {qSoil} kN/m² | Area = {totalArea} m² | Settlement δ = {settlement} mm
            </text>
          </svg>
        );
      }

      case 'column': {
        const Pu = inputs.Column_Axial_kN || 1400;
        const Mx = inputs.Mx_kNm || 65;
        const My = inputs.My_kNm || 55;
        const side = design?.sectionWidth || 400;

        return (
          <svg viewBox="0 0 500 260" className="w-full h-auto bg-slate-50 rounded-xl border border-slate-200 p-2">
            {/* Column Elevation View */}
            <g transform="translate(45, 10)">
              <text x="80" y="16" fill="#334155" fontSize="11" fontWeight="bold" textAnchor="middle">
                Column Elevation
              </text>
              <rect x="50" y="30" width="60" height="190" fill="#e2e8f0" stroke="#0284c7" strokeWidth="2" rx="3" />
              {/* Main Bars */}
              <line x1="56" y1="30" x2="56" y2="220" stroke="#dc2626" strokeWidth="4" />
              <line x1="104" y1="30" x2="104" y2="220" stroke="#dc2626" strokeWidth="4" />
              {/* Ties */}
              {[45, 80, 115, 150, 185].map(y => (
                <line key={y} x1="54" y1={y} x2="106" y2={y} stroke="#d97706" strokeWidth="1.5" />
              ))}
              {/* Axial Force */}
              <line x1="80" y1="-2" x2="80" y2="22" stroke="#dc2626" strokeWidth="3" />
              <polygon points="80,27 75,17 85,17" fill="#dc2626" />
              <text x="80" y="-8" fill="#dc2626" fontSize="10" textAnchor="middle" fontWeight="bold">
                Pu = {Pu} kN
              </text>
            </g>

            {/* Column Cross Section View */}
            <g transform="translate(255, 10)">
              <text x="100" y="16" fill="#334155" fontSize="11" fontWeight="bold" textAnchor="middle">
                Cross Section ({side}×{side} mm)
              </text>
              <rect x="25" y="30" width="150" height="150" fill="#f1f5f9" stroke="#0284c7" strokeWidth="3" rx="4" />
              <rect x="37" y="42" width="126" height="126" fill="none" stroke="#d97706" strokeWidth="2" rx="2" strokeDasharray="4,2" />
              
              {/* Rebar Dots */}
              {[[42,47],[100,47],[158,47],[42,105],[158,105],[42,163],[100,163],[158,163]].map(([cx,cy], idx) => (
                <circle key={idx} cx={cx} cy={cy} r="6.5" fill="#dc2626" stroke="#ffffff" strokeWidth="1.5" />
              ))}

              <text x="100" y="200" fill="#0369a1" fontSize="11" textAnchor="middle" fontWeight="bold">
                {design?.recommendedRebar || '8#20mm Fe500'}
              </text>
              <text x="100" y="218" fill="#475569" fontSize="10" textAnchor="middle">
                Mx = {Mx} kNm | My = {My} kNm ({inputs.Column_Axial_Type})
              </text>
              <text x="100" y="235" fill="#059669" fontSize="10" textAnchor="middle" fontWeight="semibold">
                Stress σ = {outputs.Column_Stress_MPa} MPa | {fck} Concrete
              </text>
            </g>
          </svg>
        );
      }

      case 'slab': {
        const lx = inputs.Slab_lx_m || 3.5;
        const ly = inputs.Slab_ly_m || 5.0;
        const D = inputs.Slab_Thickness_mm || 130;
        const w = inputs.Slab_Load_kN_m2 || 8.5;

        return (
          <svg viewBox="0 0 500 260" className="w-full h-auto bg-slate-50 rounded-xl border border-slate-200 p-2">
            {/* Slab Plan View */}
            <g transform="translate(35, 10)">
              <text x="100" y="16" fill="#334155" fontSize="11" fontWeight="bold" textAnchor="middle">
                Slab Plan ({lx}m × {ly}m)
              </text>
              <rect x="10" y="25" width="180" height="195" fill="#f1f5f9" stroke="#0284c7" strokeWidth="2.5" rx="4" />
              
              {/* Short & Long Span Rebar Grid */}
              <line x1="20" y1="110" x2="180" y2="110" stroke="#dc2626" strokeWidth="3" />
              <line x1="20" y1="150" x2="180" y2="150" stroke="#dc2626" strokeWidth="3" />
              <line x1="100" y1="35" x2="100" y2="210" stroke="#d97706" strokeWidth="2" strokeDasharray="5,3" />

              <text x="100" y="105" fill="#dc2626" fontSize="10" textAnchor="middle" fontWeight="bold">
                Mx = {outputs.Slab_Mx} kNm/m
              </text>
              <text x="100" y="165" fill="#b45309" fontSize="10" textAnchor="middle" fontWeight="bold">
                My = {outputs.Slab_My} kNm/m
              </text>
            </g>

            {/* Slab Section View */}
            <g transform="translate(260, 10)">
              <text x="100" y="16" fill="#334155" fontSize="11" fontWeight="bold" textAnchor="middle">
                Cross-Section (D = {D}mm)
              </text>
              <rect x="10" y="45" width="180" height="60" fill="#e2e8f0" stroke="#0284c7" strokeWidth="2" rx="3" />
              {/* Main Bottom Bars */}
              <line x1="15" y1="93" x2="185" y2="93" stroke="#dc2626" strokeWidth="4" />
              {[35, 65, 95, 125, 155].map(x => (
                <circle key={x} cx={x} cy="87" r="4" fill="#d97706" />
              ))}

              <text x="100" y="132" fill="#0f172a" fontSize="11" textAnchor="middle" fontWeight="bold">
                {design?.recommendedRebar || `10mm @ 150mm c/c`}
              </text>
              <text x="100" y="152" fill="#059669" fontSize="10" textAnchor="middle" fontWeight="semibold">
                Deflection Δ = {outputs.Slab_Deflection_mm} mm ({design?.deflectionStatus})
              </text>
              <text x="100" y="172" fill="#64748b" fontSize="10" textAnchor="middle">
                Design Load w = {w} kN/m² ({fck} / {fy})
              </text>
            </g>
          </svg>
        );
      }

      default: {
        // Generic Beam Renderer (Ground Beam, Plinth Beam, Floor Beam, Lintel)
        const L = inputs.GB_Length_m || inputs.PB_Length_m || inputs.FloorBeam_Length_m || inputs.Lintel_Length_m || 4.5;
        const w = inputs.GB_UDL_kN_m || inputs.PB_UDL_kN_m || inputs.FloorBeam_UDL_kN_m || inputs.Lintel_UDL_kN_m || 25;
        const defl = outputs.GB_Deflection_mm || outputs.FloorBeam_Deflection_mm || outputs.Lintel_Deflection_mm || outputs.PB_Strain || 4.2;

        return (
          <svg viewBox="0 0 500 240" className="w-full h-auto bg-slate-50 rounded-xl border border-slate-200 p-2">
            {/* Title Centered at X=250 */}
            <text x="250" y="20" fill="#0f172a" fontSize="12" fontWeight="bold" textAnchor="middle">
              Flexural Beam Elevation (Span L = {L} m)
            </text>

            {/* UDL Value Centered at X=250 */}
            <text x="250" y="38" fill="#dc2626" fontSize="11" fontWeight="bold" textAnchor="middle">
              UDL w = {w} kN/m
            </text>

            {/* Horizontal UDL Bar & Downward Arrows */}
            <g stroke="#dc2626" strokeWidth="1.5">
              <line x1="60" y1="46" x2="440" y2="46" stroke="#dc2626" strokeWidth="2" />
              {[70, 120, 170, 220, 270, 320, 370, 430].map(x => (
                <g key={x}>
                  <line x1={x} y1="46" x2={x} y2="68" />
                  <polygon points={`${x},73 ${x-3},65 ${x+3},65`} fill="#dc2626" />
                </g>
              ))}
            </g>

            {/* Solid Beam Concrete Body */}
            <rect x="60" y="75" width="380" height="75" fill="#e2e8f0" stroke="#0284c7" strokeWidth="2.5" rx="3" />
            
            {/* Beam End Supports */}
            <polygon points="60,150 45,175 75,175" fill="#64748b" />
            <polygon points="440,150 425,175 455,175" fill="#64748b" />
            <circle cx="440" cy="180" r="4" fill="#64748b" />

            {/* Longitudinal Tension & Compression Rebar */}
            <line x1="65" y1="140" x2="435" y2="140" stroke="#dc2626" strokeWidth="4" />
            <line x1="65" y1="85" x2="435" y2="85" stroke="#64748b" strokeWidth="2.5" />

            {/* Vertical Shear Stirrups */}
            {[85, 130, 175, 220, 265, 310, 355, 400].map(x => (
              <rect key={x} x={x} y="82" width="2" height="61" fill="#d97706" />
            ))}

            {/* Deflected Curve Profile */}
            <path d="M 60,150 Q 250,178 440,150" fill="none" stroke="#e11d48" strokeWidth="2" strokeDasharray="4,3" />

            {/* Deflection Value Centered at X=250 */}
            <text x="250" y="196" fill="#e11d48" fontSize="11" fontWeight="bold" textAnchor="middle">
              Deflection Δ = {defl} mm
            </text>
          </svg>
        );
      }
    }
  };

  // Extract key values for clean HTML summary below canvas
  const Mu = outputs.GB_Moment || outputs.PB_Moment || outputs.FloorBeam_Moment || outputs.Lintel_Moment || outputs.Footing_Moment_kNm || outputs.Slab_Mx || 0;
  const Vu = outputs.GB_Shear || outputs.PB_Shear || outputs.FloorBeam_Shear || outputs.Lintel_Shear || outputs.Footing_Shear_kN || outputs.Column_Shear_kN || outputs.Slab_Shear || 0;
  const Tu = outputs.Torsion || 0;

  return (
    <div className="w-full space-y-3">
      {/* Top Diagram Header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
          Interactive Structural Schematic (IS 456)
        </span>
        <span className="text-xs text-slate-500">
          Grade: <strong className="text-indigo-700 font-bold">{fck}</strong> / <strong className="text-amber-700 font-bold">{fy}</strong>
        </span>
      </div>

      {/* SVG Graphic Canvas */}
      {renderDiagram()}

      {/* Responsive HTML Details Card - No Text Truncation / Overlap! */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
          <div className="text-xs font-black text-indigo-700 flex items-center gap-2">
            <span>ANN Predicted Response:</span>
            <span className="bg-indigo-50 text-indigo-800 px-2.5 py-0.5 rounded border border-indigo-200 font-extrabold">
              Mu = {Mu} kNm | Vu = {Vu} kN {Tu > 0 ? `| Tu = ${Tu} kNm` : ''}
            </span>
          </div>

          <div className="text-xs font-bold text-slate-800">
            Recommended Section: <span className="text-indigo-600 font-black">{design?.sectionWidth || 230}mm × {design?.sectionDepth || 450}mm</span> ({fck} / {fy})
          </div>
        </div>

        <div className="text-xs text-slate-700 space-y-1 pt-1">
          <div className="flex items-start gap-1.5">
            <strong className="text-slate-900 font-bold flex-shrink-0">Rebar Detail:</strong>
            <span className="text-slate-800 font-semibold">{design?.recommendedRebar || '3#16mm Main Bars'}</span>
          </div>

          {design?.shearStirrups && (
            <div className="flex items-start gap-1.5">
              <strong className="text-slate-900 font-bold flex-shrink-0">Shear Stirrups:</strong>
              <span className="text-amber-700 font-semibold">{design?.shearStirrups}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
