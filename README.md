# Machine Learning–Based Prediction of Structural Response and Preliminary Design Parameters

An interactive **Artificial Neural Network (ANN)** and Machine Learning application for structural engineers and researchers to predict structural responses (bending moments, shear forces, deflections, stresses, strains) and derive preliminary design parameters of **Reinforced Concrete (RC)** structural members compliant with **IS 456:2000**.

---

## 🏗️ Supported RC Structural Members
1. **Isolated Footing** (Length, Width, Thickness, SBC, Axial Load, Seismic Zone II-IV, Bar Diameter)
2. **Ground Beam (GB)** (Span, UDL, Section Dimensions, Main & Hanger Reinforcement)
3. **Plinth Beam (PB)** (Span, Wall UDL, Column Location)
4. **RC Column** (Axial Load, Biaxial Moments Mx/My, Bar Diameter, Square/Rectangular/Circular Sections)
5. **Lintel Beam** (Clear Opening Span, Section Depth, Wall Thickness, Bar Diameter, Masonry UDL)
6. **Floor Beam** (Span, Total UDL, Torsion, Reinforcement Detailing)
7. **RC Slab Panel** (Short Span Lx, Long Span Ly, Thickness, One-Way / Two-Way Restrained / Cantilever)

---

## ✨ Key Features
- **ANN Multi-Task Predictor**: Real-time structural response prediction trained on finite-element building dataset samples.
- **Dynamic $R^2$ Goodness-of-Fit Engine**: Calculates live localized regression $R^2$ and RMSE scores reflecting parameter domain density and analytical consistency.
- **IS 456:2000 Analytical Verification**: Real-time cross-validation against Indian Standard code equations with optional show/hide toggle.
- **Interactive SVG Structural Schematics**: Dimensioned elevation and cross-sectional diagrams with exact alignment and load arrows.
- **Whole-Building Design Suite**: Multi-storey gravity & seismic load distribution engine with bill of materials estimation.
- **ANN Architecture & Training Studio**: Interactive hyperparameter tuning (Epochs, Learning Rate, Hidden Neurons, Activation) with real-time algorithm comparison across:
  - Artificial Neural Network (ANN)
  - Random Forest Regressor
  - Gradient Boosting (XGBoost)
  - Multiple Linear Regression
- **Hybrid ANN Training & Dataset Explorer**: Allows users to upload custom CSV datasets to retrain and augment the model dynamically.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/siddhivibhute/structural-ANN.git

# Navigate into the project directory
cd structural-ANN

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### Build for Production
```bash
npm run build
```

---

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS, Lucide Icons
- **Visualizations**: Custom SVG Vector Diagrams, Recharts
- **ML / Math**: Custom Multi-Task Neural Network & k-NN Weighted Manifold Engine
