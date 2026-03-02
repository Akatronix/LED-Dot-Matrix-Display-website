import api from "@/services/api";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

function LEDDisplay({ display }) {
  const ledColor = "#ef4444";
  const [deleteLoading, SetDeleteLoading] = useState(false);

  const navigate = useNavigate();

  const DeleteDisplay = async (id) => {
    try {
      SetDeleteLoading(true);
      const response = await api.delete(`/display/delete/${id}`);
      setTimeout(() => {
        SetDeleteLoading(false);
      }, 500);
      toast.success(response.data.message);
      navigate(0);
    } catch (error) {
      setTimeout(() => {
        SetDeleteLoading(false);
      }, 500);

      toast.error("Error Deleting Display");

      console.error("Error Deleting Display:", error);
    }
  };

  const getGlowColor = (hex, opacity) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200 hover:shadow-xl transition-shadow">
      <div className="bg-linear-to-r from-slate-800 to-slate-900 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-white font-medium text-sm">
            {display.name ? display.name : ""}
          </span>
        </div>
        {deleteLoading ? (
          <p className="text-white">Loading...</p>
        ) : (
          <button
            onClick={() => DeleteDisplay(display._id)}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* LED Screen */}
      <div className="bg-black p-3 border-b border-slate-800">
        <Link
          to={`/details/${display._id}`}
          className="bg-black rounded-lg relative overflow-hidden flex items-center justify-center"
          style={{ minHeight: "80px" }}
        >
          {/* Screen ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at center, ${getGlowColor(ledColor, 0.08)}, transparent 70%)`,
            }}
          />

          {/* Scanline effect */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.4)_50%)] bg-size-[100%_4px] pointer-events-none opacity-30" />

          {/* Text Display */}
          <div className="relative z-10 w-full px-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 overflow-hidden relative">
                <div className="flex items-center">
                  <div
                    className="font-mono font-bold text-3xl tracking-wider whitespace-nowrap"
                    style={{
                      color: ledColor,
                    }}
                  >
                    {display.firstline ? display.firstline.toUpperCase() : ""}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default LEDDisplay;
