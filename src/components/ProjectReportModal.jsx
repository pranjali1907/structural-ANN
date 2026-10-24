import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  FileText,
  UserCheck
} from 'lucide-react';

export default function ProjectReportModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h2 className="font-bold text-base text-white">Project Proposal & Synopsis Report</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Printable Content */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-200 text-sm print:text-black print:bg-white print:p-0" id="project-report-content">
          {/* Title Cover Header */}
          <div className="text-center border-b border-slate-800 pb-6 space-y-2">
            <span className="text-xs uppercase tracking-widest font-extrabold text-indigo-400">
              Bachelor of Technology in Civil Engineering (2026-27)
            </span>
            <h1 className="text-2xl font-black text-white leading-tight">
              Machine Learning–Based Prediction of Structural Response and Preliminary Design Parameters of Reinforced Concrete Structural Members
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              ANN-Based Multi-Task Surrogate Modeling & IS 456:2000 Automated Structural Design Tool
            </p>
          </div>

          {/* Academic Metadata & Team Members */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <h3 className="font-bold text-xs text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" /> Project Team Members:
              </h3>
              <ul className="space-y-1 text-xs text-slate-300">
                <li>• Mr. Padalkar Jay Arun (URN: 23051001)</li>
                <li>• Mr. Mahadik Viraj Dhanaji (URN: 23051006)</li>
                <li>• Ms. Gaikwad Sanika Bharat (URN: 1024052011)</li>
                <li>• Ms. Ghail Shruti Ramesh (URN: 1024052054)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-xs text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> Academic Guidance & Institution:
              </h3>
              <p className="text-xs text-slate-200 font-semibold">
                Under the Guidance of: Dr. B. V. Mane
              </p>
              <p className="text-xs text-slate-400">
                Associate Professor, Civil Engineering Department
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Department of Civil Engineering<br />
                Annasaheb Dange College of Engineering and Technology, Ashta
              </p>
            </div>
          </div>

          {/* Section 1: Executive Summary & Need of Study */}
          <div className="space-y-2">
            <h3 className="font-bold text-base text-white border-l-4 border-indigo-500 pl-3">
              1. Project Need & Objectives
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Traditional design and analysis of reinforced concrete (RC) structural members rely on iterative empirical formulas and finite element numerical simulations, which are computationally intensive during preliminary design stages. This project introduces an Artificial Neural Network (ANN) framework trained on 600 structural building records to rapidly predict structural responses and recommend preliminary member dimensions according to IS 456:2000 and IS 1893:2016.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
                <strong className="text-indigo-300 block mb-1">Key Objectives:</strong>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  <li>Develop structural response dataset for 7 RC member components.</li>
                  <li>Train multi-output ANN model to predict moments, shear, deflection & stress.</li>
                  <li>Provide automated preliminary design section recommendations.</li>
                  <li>Achieve &gt;98% prediction accuracy compared to codal formulations.</li>
                </ul>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
                <strong className="text-emerald-300 block mb-1">Target 7 RC Members:</strong>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  <li>Footing (Moment, Shear, Settlement, Stress)</li>
                  <li>Ground Beam & Plinth Beam (Moment, Shear, Deflection)</li>
                  <li>RC Column (Shear Force, Compressive Stress, Strain)</li>
                  <li>Lintel, Floor Beam & RC Slab (Mx, My, Torsion)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2: Input & Output Parameters Definition */}
          <div className="space-y-2">
            <h3 className="font-bold text-base text-white border-l-4 border-indigo-500 pl-3">
              2. Input & Output Parameters Breakdown
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse border border-slate-800">
                <thead>
                  <tr className="bg-slate-950 text-indigo-300 border-b border-slate-800">
                    <th className="p-2 border-r border-slate-800">Component</th>
                    <th className="p-2 border-r border-slate-800">Input Parameters</th>
                    <th className="p-2">ANN Output Predictions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td className="p-2 font-bold text-white border-r border-slate-800">Footing</td>
                    <td className="p-2 border-r border-slate-800">Footing size B, thickness D, column load P, SBC, fck, fy</td>
                    <td className="p-2 text-indigo-300 font-semibold">Moment (Mu), Shear (Vu), Settlement (δ), Stress (σ), Strain (ε)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-white border-r border-slate-800">Ground Beam</td>
                    <td className="p-2 border-r border-slate-800">Beam span L, width b, depth d, UDL w, fck, fy</td>
                    <td className="p-2 text-indigo-300 font-semibold">Bending moment, Shear force, Deflection, Flexural stress</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-white border-r border-slate-800">RC Column</td>
                    <td className="p-2 border-r border-slate-800">Axial load Pu, Mx, My, position, biaxial/uniaxial, fck, fy</td>
                    <td className="p-2 text-indigo-300 font-semibold">Shear force, Compressive stress, Concrete strain</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-white border-r border-slate-800">Floor Beam</td>
                    <td className="p-2 border-r border-slate-800">Span L, position, UDL w, width b, depth d, fck, fy</td>
                    <td className="p-2 text-indigo-300 font-semibold">Bending moment, Shear force, Torsion (Tu), Deflection</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-white border-r border-slate-800">RC Slab</td>
                    <td className="p-2 border-r border-slate-800">Span Lx, Ly, thickness D, design load w, fck, fy</td>
                    <td className="p-2 text-indigo-300 font-semibold">Short span Mx, Long span My, Shear, Deflection</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: IS Codal References */}
          <div className="space-y-2 border-t border-slate-800 pt-4 text-xs text-slate-400">
            <h4 className="font-bold text-slate-200">IS Code References & Guidelines Enforced:</h4>
            <p>
              1. IS 456:2000 Plain and Reinforced Concrete - Code of Practice<br />
              2. IS 1893 (Part 1): 2016 Criteria for Earthquake Resistant Design of Structures<br />
              3. IS 875 (Parts 1-5): Design Loads for Buildings and Structures
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
