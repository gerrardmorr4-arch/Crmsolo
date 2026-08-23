# CRMSolo - Real Estate CRM Comparison & Revenue ROI Engine

CRMSolo is a full-stack web application designed for independent real estate agents and brokers to compare leading CRMs (Pipedrive, Streak, Follow Up Boss), calculate ROI and deal recovery potential, and stay updated with live CRM industry news powered by Google Gemini Search Grounding.

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- **Node.js**: v18 or later
- **npm** or **bun** / **yarn**

### 1. Installation

Clone your repository and install dependencies:

```bash
git clone https://github.com/YOUR_USERNAME/crmsolo.git
cd crmsolo
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and set your variables:

```bash
cp .env.example .env
```

Define `GEMINI_API_KEY` (optional for live search grounding, fallback curated news is automatically served if not provided):

```env
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production Build & Deployment

### Build the Application

To compile both the Vite client assets and the Express backend server:

```bash
npm run build
```

This generates production-ready assets in the `dist/` directory and bundles the backend server into `dist/server.cjs`.

### Start the Production Server

```bash
npm run start
```

---

## 🛠️ Deploying to Hosting Platforms

### Option A: Render / Railway / Cloud Run

1. Connect your GitHub repository to your preferred hosting provider (e.g. Render, Railway, Google Cloud Run).
2. Set the **Build Command**: `npm run build`
3. Set the **Start Command**: `npm run start`
4. Add Environment Variable:
   - `GEMINI_API_KEY`: *(Your Google AI Studio Gemini API Key)*
   - `PORT`: `3000` (or leave default assigned by platform)

### Option B: Docker Container

A standard Docker container can build and serve CRMSolo using Node:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

---

## ⚙️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion (Framer Motion)
- **Backend**: Express.js, TypeScript (bundled via esbuild)
- **AI Integration**: `@google/genai` (Gemini API with Search Grounding)
- **Build Tools**: Vite, esbuild, tsx
