import React, { useState } from "react";
import { CircleUserRound, LogOut, Settings, User } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuthStore } from "@/stores/userStore";
import api from "@/services/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const PopOver = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const userData = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await api.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/logout`);
      localStorage.removeItem("accessToken");
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("An error occurred during logout.");
    } finally {
      logout();
      navigate("/login");
      setIsLoggingOut(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {/* Styled trigger button to match your theme */}
        <button className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors">
          <CircleUserRound className="w-8 h-8 text-white" />
        </button>
      </PopoverTrigger>

      {/* Styled PopoverContent with your theme classes */}
      <PopoverContent
        className="w-56 bg-slate-800 text-white border-slate-700 rounded-lg shadow-xl p-1 z-50"
        align="end" // Aligns the popover to the right of the trigger
      >
        {/* The arrow is now styled to match the dark background */}
        <div className="relative w-full">
          <div className="absolute -top-2 right-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-slate-800"></div>
        </div>

        {/* Menu Items */}
        <div className="py-1">
          <div className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-300 ">
            <User className="w-4 h-4" />

            <div className="text-left">
              <p>{userData?.username}</p>
              <p>{userData?.email}</p>
            </div>
          </div>
          <div className="border-t border-slate-700 my-1"></div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-slate-700 transition-colors rounded-md"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PopOver;
