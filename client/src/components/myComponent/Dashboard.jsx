import React, { useEffect, useState } from "react";
import { Type } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import LEDDisplay from "./LedDisplay";
import { useAuthStore } from "@/stores/userStore";
import api from "@/services/api";
import AddDisplay from "./AddDisplay";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Dashboard() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = !!accessToken;

  const [displays, setDisplays] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          const response = await api.get("/user/getData");
          const { displays } = response.data;
          setDisplays(displays);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <h1 className="text-2xl font-bold text-white">LED</h1>
              </div>
            </div>
            <div>
              <AddDisplay />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 ">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <Type className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Total Displays</p>
                <p className="text-white text-xl font-bold">
                  {displays?.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Displays Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displays.map((display) => (
            <LEDDisplay key={display._id} display={display} />
          ))}
        </div>
      </div>
    </div>
  );
}
