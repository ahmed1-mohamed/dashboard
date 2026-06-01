"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function UnauthorizedPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const role = session?.user?.role_name;

  // 🔁 Redirect بعد 3 ثواني
  useEffect(() => {
    const timer = setTimeout(() => {
      if (role === "admin") {
        router.push("/admin/home");
      } else if (role === "expert") {
        router.push("/expert/home");
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="text-center bg-white p-10 rounded-2xl shadow-xl max-w-md w-full">
        {/* 🔴 Code */}
        <h1 className="text-5xl font-bold text-red-600 mb-4">403</h1>

        {/* 🛑 Title */}
        <h2 className="text-2xl font-semibold mb-3">Unauthorized Access</h2>

        {/* 📄 Description */}
        <p className="text-gray-600 mb-4">
          You don't have permission to access this page.
        </p>

        {/* 👤 Role */}
        {role && (
          <p className="text-sm text-gray-500 mb-6">
            Your current role is:{" "}
            <span className="font-semibold text-black">{role}</span>
          </p>
        )}

        {/* ⏳ Auto redirect info */}
        <p className="text-xs text-gray-400 mb-6">
          Redirecting to dashboard in 10 seconds...
        </p>

        {/* 🔘 Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => {
              if (role === "admin") {
                router.push("/admin/home");
              } else if (role === "expert") {
                router.push("/expert/home");
              }
            }}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => router.back()}
            className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
