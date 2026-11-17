# VayuGrid (वायुग्रिड) — Urban Air Quality & Exposure Intelligence OS

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF.svg)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6.svg)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4.svg)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/Gemini-2.5--Flash-8E75B2.svg)](https://ai.google.dev/)

> **VayuGrid** is a production-grade, minimalist SaaS web application and exposure intelligence operating system that helps families and communities navigate severe winter smog and urban air pollution. Tailored to a household's exact micro-environment and infrastructure, it prescribes hyper-personalized low-emission daily routines, indoor air quality (IAQ) interventions, and sustainable lifestyle alternatives while transparently quantifying direct health and emission impacts.

---

## Key Capabilities & Architecture

### 1. Visual Design System & High-Craft SaaS Architecture
- **Editorial Aesthetic:** Modeled strictly after high-craft operational data products (**Linear, Vercel, Stripe, Raycast**).
- **Hairline Separation:** Crisp `1px solid #E4E4E7` borders, zero muddy drop shadows, light-first `#FAFAFA` architectural canvas.
- **Data Typography:** JetBrains Mono with enforced `tabular-nums` for all AQI figures, PM2.5/PM10 metrics, timestamps, and CO₂e ledgers.
- **Desaturated Semantic Palette:** Standardized 6-tier air quality status pills (Good, Moderate, Unhealthy for Sensitive Groups, Unhealthy, Very Unhealthy, Severe Crisis).

### 2. Multi-Device Adaptive Experience (Windows Desktop, Android Mobile, Tablet)
- **Automatic Device & OS Detection:** Detects Windows, Android, iOS, macOS, iPad, and desktop/tablet/mobile form factors.
- **Adaptive Layouts:**
  - **Windows Desktop:** High-density SaaS cockpit with fixed sidebar profiler, quick `Ctrl+K` command trigger, and split-screen telemetry.
  - **Android Mobile:** Single-column layout with a fixed thumb-friendly bottom navigation bar (`Citizen Safety`, `Hourly Curve`, `Protocols`, `My Setup`, `World AQI`) and slide-up drawer profiler.
  - **Tablet / iPad:** Balanced 2-column touch grid layout.
- **Manual Device Switcher:** One-click header switcher to preview or lock any device mode.

### 3. Exact Device Location & Reverse Geocoding
- **Dual-Source Reverse Geocoding:** Accurately resolves physical street address, locality, city, state, postal code, and country via BigDataCloud & OpenStreetMap Nominatim with IP fallback.
- **Live Monitored Telemetry:** Automatically fetches real-time atmospheric measurements for the resolved device coordinates.

### 4. Live Global Air Quality API (Open-Meteo Integration)
- **Zero-Key Open Internet Feed:** Direct browser integration with Open-Meteo European Atmosphere Service (Copernicus CAMS & ECMWF).
- **Global Leaderboard & Instant Search:** Real-time city search, live AQI ranking across major world metropolises, and dynamic GPS lookup.

### 5. Liquid Glass Borosilicate Chamber (UI Refraction Mode)
- **Fluid Atmospheric Dynamics:** Optical glass refraction styling with particle density simulation tracking ambient outdoor PM2.5.
- **Interactive HEPA Purge:** Clean-air purge cycle with progressive particulate scrubbing physics.
- **Header Switcher:** One-click toggle between crisp matte SaaS finish and optical liquid glass refraction.

### 6. Citizen Family Safety & Jargon Buster
- **Everyday Family Safety Cards:** Plain-English, color-coded guidance for everyday family decisions:
  - Morning Walks & Jogging safety windows.
  - Children & Elderly outdoor play recommendations.
  - Window ventilation timing based on thermal boundary inversion.
  - N95 / FFP2 mask requirements.
  - Kitchen cooking ventilation & exhaust guidelines.
- **"Explain Terms in Plain English" Jargon Buster:** Friendly human analogies for PM2.5, Thermal Inversion, HEPA H13, and Air Quality Index.
- **Floating Family AI Assistant ("Ask Vayu"):** Instant conversational Q&A with one-click everyday citizen prompt chips.

### 7. Grounded Atmospheric Logic & GenAI Structured Output
- **CPCB & WHO Compliance:** Calibrated against CPCB National AQI breakpoints and the WHO 24-hour guideline (15 µg/m³).
- **Diurnal Thermal Inversion Dynamics:** Accurately models shallow nighttime/morning atmospheric boundary layer capping and afternoon solar mixing.
- **Gemini 2.5 Flash SDK Integration:** Strict JSON schema validation with fallback to the local scientific physics model.
- **Interactive What-If Exposure Simulator:** Real-time 24-hour diurnal exposure curve (Outdoor Ambient vs. Protected Indoor vs. WHO Safe Limit) powered by Recharts.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | Modern UI framework with high-performance concurrent rendering |
| **TypeScript 5.9** | Strict end-to-end type safety |
| **Vite 8.3** | Lightning-fast HMR and optimized production bundle |
| **Tailwind CSS v4** | Modern utility-first stylesheet engine |
| **Recharts** | Interactive 24-hour diurnal atmospheric exposure curves |
| **Lucide Icons** | Consistent, high-craft SVG icon library |
| **@google/genai (v3.4.0)** | Official Gemini SDK with structured JSON schema outputs |
| **Open-Meteo API** | Free live open air quality and geocoding telemetry |
| **BigDataCloud / OSM** | Free dual-source reverse geocoding engine |

---

## Quick Start & Installation

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm or yarn

### 1. Clone & Install
```bash
git clone https://github.com/vkenterprisesltd725-maker/vayugrid.git
cd vayugrid
npm install
```

### 2. Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## Verification & Automated Testing Suite

The repository has undergone automated multi-scenario browser and engine verifications:
1. **Core SaaS Telemetry & Action Cards:** CPCB/WHO calculation engine, profile modifications, what-if sliders.
2. **Liquid Glass Mode:** Refraction optics, HEPA chamber purge cycle, fluid ambient backdrops.
3. **Citizen View & Live API:** Open-Meteo live API requests, city search, Jargon Buster modal, Easy Chat conversational assistant.
4. **Visuals & Color System:** Unsplash skyline imagery for cities, dynamic smog color overlays, 6-tier continuous AQI spectrum bar.
5. **Device & Location Resolution:** Windows desktop layout, Android mobile app layout with bottom navigation, iPad/tablet layout, and GPS reverse geocoding.

---

## License

This project is licensed under the [MIT License](LICENSE).
