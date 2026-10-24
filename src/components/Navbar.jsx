import React from 'react';
import { 
  Building2, 
  Cpu, 
  Database, 
  Sparkles,
  Award
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'predictor', label: 'Member Predictor (7 RC Components)', icon: Cpu },
    { id: 'building', label: 'Whole-Building Design Suite', icon: Building2 },
    { id: 'studio', label: 'ANN Training & Architecture Studio', icon: Sparkles },
    { id: 'dataset', label: 'Dataset & Hybrid Training', icon: Database },
  ];

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('predictor')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-indigo-500/20 ring-2 ring-indigo-100">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg tracking-tight text-slate-900">
                StructuralANN<span className="text-indigo-600">.AI</span>
              </h1>
              <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                IS 456:2000
              </span>
            </div>
            <p className="text-xs text-slate-500">
              ML-Based Prediction of RC Structural Response & Preliminary Design
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <nav className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
