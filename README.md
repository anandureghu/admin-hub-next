# Admin Hub

A comprehensive administrative management system built with React, Vite, and Supabase. This project provides a robust dashboard for managing employees, vehicles, trips, receipts, and settings.

## 🚀 Features

- **Dashboard**: Real-time overview of key metrics and activities.
- **Employee Management**: Manage staff profiles, roles, and status.
- **Vehicle Tracking**: Monitor vehicle fleet information and maintenance.
- **Trip Logs**: Record and manage business-related travel.
- **Receipt Management**: Digital storage and processing of financial receipts.
- **Authentication**: Secure login and session management powered by Supabase.
- **Responsive Design**: Fully functional across desktop, tablet, and mobile devices.
- **Settings**: Customizable system and user preferences.

## 🛠️ Tech Stack

- **Framework**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **State Management**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)

## 📦 Project Structure

```text
src/
├── components/     # Reusable UI and layout components
│   ├── dashboard/   # Dashboard-specific components
│   ├── layout/      # Shared layout components (AdminLayout)
│   └── ui/          # Low-level shadcn UI components
├── hooks/          # Custom React hooks
├── integrations/   # API and third-party service configurations (Supabase)
├── lib/            # Utility functions and library wrappers
├── pages/          # Full page components used as routes
└── test/           # Test files and utilities
```

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or bun

### Local Setup

1. **Clone the repository**:

   ```sh
   git clone <YOUR_GIT_URL>
   cd admin-hub-next
   ```

2. **Install dependencies**:

   ```sh
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory and add your Supabase credentials:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**:
   ```sh
   npm run dev
   ```

## 🧪 Testing

Run the test suite using Vitest:

```sh
npm run test
```

## 🌐 Deployment

This project is optimized for deployment via Lovable or any modern static hosting provider (Vercel, Netlify, etc.).

For Lovable:

1. Open [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID)
2. Click on **Share** -> **Publish**.
