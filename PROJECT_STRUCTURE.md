# 📁 CareSync Project - Complete Folder Structure

## 🎯 Recommended Structure

```
CareSync/
│
├── backend/                          # Backend Node.js/Express API
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                 # MongoDB connection
│   │   │   └── passport.js           # OAuth configuration
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js     # Auth logic
│   │   │   └── vitalsController.js   # Vitals system logic ✨ NEW
│   │   │
│   │   ├── middleware/
│   │   │   └── auth.js               # JWT authentication
│   │   │
│   │   ├── models/
│   │   │   ├── User.js               # User schema
│   │   │   └── VitalReading.js       # Vitals schema ✨ NEW
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # Auth endpoints
│   │   │   └── vitalsRoutes.js       # Vitals endpoints ✨ NEW
│   │   │
│   │   ├── utils/
│   │   │   ├── jwt.js                # JWT utilities
│   │   │   ├── mockModels.js         # Mock ML models ✨ NEW
│   │   │   └── vitalCache.js         # In-memory cache ✨ NEW
│   │   │
│   │   └── server.js                 # Express app entry point
│   │
│   ├── .env                          # Environment variables
│   ├── package.json                  # Backend dependencies
│   ├── package-lock.json
│   ├── seed.js                       # Database seeder
│   ├── test-vitals.js                # API test script ✨ NEW
│   ├── test-vitals-continuous.js     # Advanced test ✨ NEW
│   │
│   ├── ARCHITECTURE.md               # System architecture ✨ NEW
│   ├── QUICKSTART.md                 # Getting started ✨ NEW
│   ├── VITALS_SYSTEM.md              # Technical docs ✨ NEW
│   ├── README.md                     # Backend README
│   └── CareSync_Vitals.postman_collection.json  # Postman tests ✨ NEW
│
├── frontend/                         # Frontend React/Vite app
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── StatusIndicator.tsx
│   │   │   │   └── SystemStatCard.tsx
│   │   │   │
│   │   │   ├── charts/
│   │   │   │   ├── ECGChart.tsx
│   │   │   │   └── VitalChart.tsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── BedStatusCard.tsx
│   │   │   │   ├── NotificationItem.tsx
│   │   │   │   ├── StatCard.tsx
│   │   │   │   └── VitalCard.tsx
│   │   │   │
│   │   │   ├── device/
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── AppSidebar.tsx
│   │   │   │   └── MainLayout.tsx
│   │   │   │
│   │   │   ├── ui/                   # shadcn/ui components
│   │   │   │   ├── accordion.tsx
│   │   │   │   ├── alert-dialog.tsx
│   │   │   │   ├── alert.tsx
│   │   │   │   ├── avatar.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── chart.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── sidebar.tsx
│   │   │   │   └── ... (all other UI components)
│   │   │   │
│   │   │   ├── ChangePasswordSection.tsx
│   │   │   └── NavLink.tsx
│   │   │
│   │   ├── contexts/
│   │   │   └── SidebarContext.tsx
│   │   │
│   │   ├── data/
│   │   │   ├── adminMockData.ts
│   │   │   └── mockData.ts
│   │   │
│   │   ├── hooks/
│   │   │   ├── use-auth.ts
│   │   │   ├── use-mobile.tsx
│   │   │   └── use-toast.ts
│   │   │
│   │   ├── lib/
│   │   │   ├── api.ts                # API client (Axios/Fetch)
│   │   │   └── utils.ts              # Utility functions
│   │   │
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   └── ... (admin pages)
│   │   │   │
│   │   │   ├── doctor/
│   │   │   │   └── ... (doctor pages)
│   │   │   │
│   │   │   ├── nurse/
│   │   │   │   └── ... (nurse pages)
│   │   │   │
│   │   │   ├── AuthSuccess.tsx
│   │   │   ├── Index.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── NotFound.tsx
│   │   │   ├── PatientDetail.tsx
│   │   │   ├── Settings.tsx
│   │   │   └── Signup.tsx
│   │   │
│   │   ├── App.css
│   │   ├── App.tsx                   # Main App component
│   │   ├── index.css                 # Global styles
│   │   ├── main.tsx                  # React entry point
│   │   └── vite-env.d.ts             # TypeScript definitions
│   │
│   ├── public/
│   │   └── robots.txt
│   │
│   ├── .gitignore
│   ├── components.json               # shadcn/ui config
│   ├── eslint.config.js              # ESLint config
│   ├── index.html                    # HTML entry point
│   ├── package.json                  # Frontend dependencies
│   ├── package-lock.json
│   ├── postcss.config.js             # PostCSS config
│   ├── tailwind.config.ts            # Tailwind CSS config
│   ├── tsconfig.json                 # TypeScript config
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   └── vite.config.ts                # Vite config
│
├── docs/                             # Project documentation
│   ├── IMPLEMENTATION_SUMMARY.md     # Implementation summary
│   └── VITALS_IMPLEMENTATION_COMPLETE.md  # Vitals completion doc
│
├── .git/                             # Git repository
├── .gitignore                        # Git ignore rules
├── bun.lockb                         # Bun lock file
├── README.md                         # Main project README
└── PROJECT_STRUCTURE.md              # This file


```

---

## 📦 Current Structure (As-Is)

```
CareSync/
│
├── backend/                          ✅ Already organized
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   ├── .env
│   ├── package.json
│   └── ... (test files, docs)
│
├── src/                              ⚠️ FRONTEND (needs reorganization)
├── public/                           ⚠️ FRONTEND
├── components.json                   ⚠️ FRONTEND
├── eslint.config.js                  ⚠️ FRONTEND
├── index.html                        ⚠️ FRONTEND
├── package.json                      ⚠️ FRONTEND (root-level)
├── tailwind.config.ts                ⚠️ FRONTEND
├── vite.config.ts                    ⚠️ FRONTEND
├── tsconfig*.json                    ⚠️ FRONTEND
│
├── IMPLEMENTATION_SUMMARY.md         📄 Move to docs/
├── VITALS_IMPLEMENTATION_COMPLETE.md 📄 Move to docs/
├── README.md                         ✅ Keep at root
└── ... (git files)
```

---

## 🔄 Recommended Reorganization Plan

### Option 1: Separate Frontend Folder (Recommended)

```bash
CareSync/
├── backend/          # All backend files (already good)
├── frontend/         # Move all React/Vite files here
├── docs/             # Move documentation here
├── .git/
├── .gitignore
└── README.md
```

**Steps to reorganize:**

1. **Create `frontend/` folder**
2. **Move these files/folders TO `frontend/`:**
   - `src/` → `frontend/src/`
   - `public/` → `frontend/public/`
   - `index.html` → `frontend/index.html`
   - `package.json` (frontend) → `frontend/package.json`
   - `package-lock.json` → `frontend/package-lock.json`
   - `node_modules/` → `frontend/node_modules/`
   - `components.json` → `frontend/components.json`
   - `eslint.config.js` → `frontend/eslint.config.js`
   - `postcss.config.js` → `frontend/postcss.config.js`
   - `tailwind.config.ts` → `frontend/tailwind.config.ts`
   - `vite.config.ts` → `frontend/vite.config.ts`
   - `tsconfig*.json` → `frontend/tsconfig*.json`
   - `bun.lockb` → `frontend/bun.lockb`

3. **Create `docs/` folder**
4. **Move documentation TO `docs/`:**
   - `IMPLEMENTATION_SUMMARY.md` → `docs/IMPLEMENTATION_SUMMARY.md`
   - `VITALS_IMPLEMENTATION_COMPLETE.md` → `docs/VITALS_IMPLEMENTATION_COMPLETE.md`

5. **Keep at root:**
   - `backend/`
   - `frontend/` (newly created)
   - `docs/` (newly created)
   - `.git/`
   - `.gitignore`
   - `README.md`

---

### Option 2: Monorepo Style (Alternative)

```bash
CareSync/
├── packages/
│   ├── backend/
│   └── frontend/
├── docs/
├── .git/
├── .gitignore
├── package.json         # Root workspace config
└── README.md
```

---

## 📝 Manual Move Commands (PowerShell)

```powershell
# Navigate to project root
cd C:\Projects\CareSync

# Create frontend folder
New-Item -ItemType Directory -Path "frontend"

# Move frontend files
Move-Item -Path "src" -Destination "frontend\"
Move-Item -Path "public" -Destination "frontend\"
Move-Item -Path "index.html" -Destination "frontend\"
Move-Item -Path "components.json" -Destination "frontend\"
Move-Item -Path "eslint.config.js" -Destination "frontend\"
Move-Item -Path "postcss.config.js" -Destination "frontend\"
Move-Item -Path "tailwind.config.ts" -Destination "frontend\"
Move-Item -Path "vite.config.ts" -Destination "frontend\"
Move-Item -Path "tsconfig.json" -Destination "frontend\"
Move-Item -Path "tsconfig.app.json" -Destination "frontend\"
Move-Item -Path "tsconfig.node.json" -Destination "frontend\"
Move-Item -Path "bun.lockb" -Destination "frontend\"

# Move package.json (CAREFUL - don't move backend's package.json)
Move-Item -Path "package.json" -Destination "frontend\"
Move-Item -Path "package-lock.json" -Destination "frontend\"
Move-Item -Path "node_modules" -Destination "frontend\"

# Create docs folder
New-Item -ItemType Directory -Path "docs"

# Move documentation
Move-Item -Path "IMPLEMENTATION_SUMMARY.md" -Destination "docs\"
Move-Item -Path "VITALS_IMPLEMENTATION_COMPLETE.md" -Destination "docs\"
```

---

## 🔧 After Reorganization - Update Configurations

### 1. Update Frontend's `vite.config.ts`
```typescript
// No changes needed - relative paths work the same
```

### 2. Update Backend's `.env`
```env
FRONTEND_URL=http://localhost:8080  # Keep as-is
```

### 3. Update Root `README.md`
```markdown
# CareSync

## Project Structure
- `backend/` - Node.js/Express API
- `frontend/` - React/Vite UI
- `docs/` - Documentation

## Getting Started

### Backend
cd backend
npm install
npm start

### Frontend
cd frontend
npm install
npm run dev
```

### 4. Create `frontend/README.md`
```markdown
# CareSync Frontend

React + TypeScript + Vite + Tailwind CSS

## Development
npm install
npm run dev

## Build
npm run build
```

---

## 📊 File Count Summary

### Backend (as-is)
- **Total files**: ~30 files
- **Structure**: ✅ Already clean

### Frontend (needs reorganization)
- **Total files**: ~100+ files (including UI components)
- **Current location**: Root level (mixed with backend)
- **Target location**: `frontend/` folder

### Documentation
- **Total files**: ~5 files
- **Target location**: `docs/` folder

---

## ✅ Benefits of Reorganization

1. **Clear Separation** - Frontend and backend clearly separated
2. **Independent Deploys** - Deploy backend/frontend separately
3. **Team Collaboration** - Different teams can work independently
4. **CI/CD** - Easier to set up separate pipelines
5. **Dependency Management** - No confusion between dependencies
6. **Professional Structure** - Industry-standard organization

---

## 🚀 Final Structure After Reorganization

```
CareSync/
│
├── backend/              # Backend API (Node.js/Express)
│   ├── src/
│   ├── .env
│   ├── package.json
│   └── ...
│
├── frontend/             # Frontend UI (React/Vite)
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── ...
│
├── docs/                 # Documentation
│   ├── IMPLEMENTATION_SUMMARY.md
│   ├── VITALS_IMPLEMENTATION_COMPLETE.md
│   └── ...
│
├── .git/
├── .gitignore
├── README.md
└── PROJECT_STRUCTURE.md
```

---

## 📌 Important Notes

1. **Before moving**, commit your current work:
   ```bash
   git add .
   git commit -m "Checkpoint before restructure"
   ```

2. **Test after moving**:
   ```bash
   # Test backend
   cd backend
   npm start
   
   # Test frontend (in new terminal)
   cd frontend
   npm run dev
   ```

3. **Update VS Code workspace** if using multi-root workspace

4. **Update any absolute paths** in code if they exist

---

**Ready to reorganize? Follow the PowerShell commands above or move files manually through File Explorer!** 📁
