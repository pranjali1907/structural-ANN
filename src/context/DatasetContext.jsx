import React, { createContext, useContext, useState, useCallback } from 'react';
import { RC_DATASET } from '../data/dataset';

// ─── Context ──────────────────────────────────────────────────────────────────
const DatasetContext = createContext(null);

export function DatasetProvider({ children }) {
  const [userRows, setUserRows]       = useState([]);   // rows from uploaded CSV
  const [uploadLog, setUploadLog]     = useState(null); // feedback message
  const [isTraining, setIsTraining]   = useState(false);

  // Combined dataset (base + user-uploaded)
  const mergedDataset = [...RC_DATASET, ...userRows];

  // Parse a CSV text string → array of objects
  const parseCSV = useCallback((text) => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) throw new Error('CSV must have a header row and at least one data row.');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());

    return lines.slice(1).map((line, i) => {
      const values = line.split(',').map(v => v.replace(/"/g, '').trim());
      const row = {};
      headers.forEach((h, idx) => {
        const raw = values[idx] ?? '';
        // Try to parse numbers
        const num = parseFloat(raw);
        row[h] = isNaN(num) ? raw : num;
      });
      // Assign a synthetic Building_ID that won't clash with base data
      row.Building_ID = row.Building_ID ?? `U-${i + 1}`;
      row._source = 'user';
      return row;
    });
  }, []);

  // Handle file upload → parse → simulate training → merge
  const handleFileUpload = useCallback((file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'csv') {
      setUploadLog({ type: 'error', message: 'Only .csv files are supported. Please upload a valid CSV file.' });
      return;
    }

    setIsTraining(true);
    setUploadLog(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = parseCSV(e.target.result);
        // Simulate ANN re-training delay (800 ms)
        setTimeout(() => {
          setUserRows(parsed);
          setIsTraining(false);
          setUploadLog({
            type: 'success',
            message: `✅ Hybrid training complete! ${parsed.length} user records merged with ${RC_DATASET.length} base records → Total: ${RC_DATASET.length + parsed.length} training samples.`
          });
        }, 900);
      } catch (err) {
        setIsTraining(false);
        setUploadLog({ type: 'error', message: `❌ Parse error: ${err.message}` });
      }
    };
    reader.readAsText(file);
  }, [parseCSV]);

  // Remove all user-uploaded rows
  const clearUserData = useCallback(() => {
    setUserRows([]);
    setUploadLog({ type: 'info', message: `Dataset reset to ${RC_DATASET.length} base records.` });
  }, []);

  return (
    <DatasetContext.Provider value={{
      baseDataset:    RC_DATASET,
      userRows,
      mergedDataset,
      uploadLog,
      isTraining,
      handleFileUpload,
      clearUserData,
    }}>
      {children}
    </DatasetContext.Provider>
  );
}

export const useDataset = () => {
  const ctx = useContext(DatasetContext);
  if (!ctx) throw new Error('useDataset must be used inside DatasetProvider');
  return ctx;
};
