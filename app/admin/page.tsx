"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-2">
        <div className="animate-spin h-8 w-8 border-4 border-[#e85025] border-t-transparent rounded-full mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Redirecting to Dashboard...</p>
      </div>
    </div>
  );
}
