import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ComponentPredictor from './components/ComponentPredictor';
import BuildingAnalyzer from './components/BuildingAnalyzer';
import ANNStudio from './components/ANNStudio';
import DatasetExplorer from './components/DatasetExplorer';
import { DatasetProvider } from './context/DatasetContext';

export default function App() {
  const [activeTab, setActiveTab] = useState('predictor');

  return (
    <DatasetProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
        {/* Header Navigation */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Main View Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {activeTab === 'predictor' && <ComponentPredictor />}
          {activeTab === 'building'  && <BuildingAnalyzer />}
          {activeTab === 'studio'    && <ANNStudio />}
          {activeTab === 'dataset'   && <DatasetExplorer />}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-4 px-4 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
            <span className="font-semibold text-slate-600">
              Machine Learning–Based Prediction of Structural Response and Preliminary Design Parameters
            </span>
            <span className="text-slate-500 font-medium">
              Artificial Neural Network (ANN) Structural Analysis Tool
            </span>
          </div>
        </footer>
      </div>
    </DatasetProvider>
  );
}
