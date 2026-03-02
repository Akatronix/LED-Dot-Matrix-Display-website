import React from "react";
import { useNavigate } from "react-router-dom";
import { FileQuestion, Home } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* 404 Content */}
      <div className="relative z-10 text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-800/50 rounded-full mb-8 border border-slate-700">
          <FileQuestion className="w-12 h-12 text-slate-400" />
        </div>

        {/* Error Code and Message */}
        <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-linear-to-r from-red-500 to-slate-400 mb-4">
          404
        </h1>
        <h2 className="text-3xl font-bold text-white mb-2">Page Not Found</h2>
        <p className="text-slate-400 text-lg max-w-md mx-auto mb-8">
          Oops! The page you're looking for seems to have vanished into the
          digital void.
        </p>

        {/* Action Button */}
        <button
          onClick={() => navigate("/")}
          className={cn(
            "inline-flex items-center gap-2 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg",
          )}
        >
          <Home className="w-5 h-5" />
          Go Home
        </button>
      </div>
    </div>
  );
}
