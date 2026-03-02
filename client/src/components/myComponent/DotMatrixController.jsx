import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import api from "@/services/api";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function DisplayDetailsPage() {
  const { id } = useParams(); // Gets the ID from the URL
  const navigate = useNavigate();

  const [display, setDisplay] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    firstline: "",
    firstlineScroll: false,
    secondline: "",
    secondlineScroll: true,
  });

  // Fetch display details when the component mounts or the ID changes
  useEffect(() => {
    const fetchDisplayDetails = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const response = await api.get(`/user/getDetails/${id}`);
        const displayData = response.data;
        setDisplay(displayData);

        // Populate the form with the fetched data
        setFormData({
          firstline: displayData.firstline,
          firstlineScroll: displayData.firstlineScroll,
          secondline: displayData.secondline,
          secondlineScroll: displayData.secondlineScroll,
        });
      } catch (error) {
        console.error("Error fetching display details:", error);
        toast.error("Failed to load display details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDisplayDetails();
  }, [id]);

  // Handle input changes for the form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission to update the display
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) return;

    setIsUpdating(true);
    try {
      // Send only the fields that can be updated
      const updatePayload = {
        firstline: formData.firstline,
        firstlineScroll: formData.firstlineScroll,
        secondline: formData.secondline,
        secondlineScroll: formData.secondlineScroll,
      };

      await api.put(`/display/update/${id}`, updatePayload);
      toast.success("Display updated successfully!");

      // Optionally, update the local state to reflect changes immediately
      setDisplay((prev) => ({ ...prev, ...updatePayload }));
    } catch (error) {
      console.error("Error updating display:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update display.";
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  // Show a loading spinner while fetching data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show an error message if the display couldn't be found
  if (!display) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Display Not Found
          </h2>
          <p className="text-slate-400 mb-4">
            The display you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="text-red-400 hover:text-red-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">{display.name}</h1>
              <p className="text-slate-400 text-sm">
                Hardware ID: {display.hardwareID}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Line Section */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                First Line
              </h3>
              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="firstline"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Text Content
                  </label>
                  <input
                    type="text"
                    id="firstline"
                    name="firstline"
                    value={formData.firstline}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg py-3 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="firstlineScroll"
                    name="firstlineScroll"
                    checked={formData.firstlineScroll}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-red-600 bg-slate-900 border-slate-600 rounded focus:ring-red-500"
                  />
                  <label
                    htmlFor="firstlineScroll"
                    className="text-sm font-medium text-slate-300"
                  >
                    Enable Scrolling
                  </label>
                </div>
              </div>
            </div>

            {/* Second Line Section */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Second Line
              </h3>
              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="secondline"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Text Content
                  </label>
                  <input
                    type="text"
                    id="secondline"
                    name="secondline"
                    value={formData.secondline}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg py-3 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="secondlineScroll"
                    name="secondlineScroll"
                    checked={formData.secondlineScroll}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-red-600 bg-slate-900 border-slate-600 rounded focus:ring-red-500"
                  />
                  <label
                    htmlFor="secondlineScroll"
                    className="text-sm font-medium text-slate-300"
                  >
                    Enable Scrolling
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUpdating}
              className={cn(
                "flex items-center justify-center gap-2 w-full bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg",
                isUpdating && "opacity-70 cursor-not-allowed",
              )}
            >
              <Save className="w-5 h-5" />
              {isUpdating ? "Updating..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
