"use client";

import dynamic from "next/dynamic";

const Dashboard = dynamic(() => import("@/components/Dashboard").then((mod) => mod.Dashboard), {
  ssr: false,
  loading: () => (
    <main className="min-h-screen bg-axo-black p-6 text-white">
      <div className="mx-auto flex min-h-[80vh] max-w-7xl items-center justify-center">
        <div className="glass-card neon-border w-full max-w-xl rounded-lg p-6">
          <div className="mb-5 h-2 w-32 animate-pulse rounded-full bg-axo-green/40" />
          <div className="h-10 w-4/5 animate-pulse rounded bg-white/10" />
          <div className="mt-4 h-4 w-full animate-pulse rounded bg-white/10" />
          <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-white/10" />
        </div>
      </div>
    </main>
  )
});

export default function Home() {
  return <Dashboard />;
}
