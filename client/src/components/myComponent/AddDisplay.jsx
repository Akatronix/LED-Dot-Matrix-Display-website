import React, { useState } from "react";

import { toast } from "sonner";
import api from "@/services/api";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import PopOver from "./PopOver";
import { Plus } from "lucide-react";

const AddDisplay = ({ onDisplayCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    hardwareID: "",
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Display name is required.";
    }
    if (!formData.hardwareID.trim()) {
      newErrors.hardwareID = "Hardware ID is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await api.post("/display/create", formData);
      toast.success("Display created successfully!");
      setFormData({ name: "", description: "", hardwareID: "" });
      setIsOpen(false);
      if (onDisplayCreated) {
        onDisplayCreated(response.data);
      }
      navigate(0);
    } catch (error) {
      console.error("Error creating display:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to create display.";
      toast.error(errorMessage);
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center justify-center gap-2">
        <PopOver />
        <DialogTrigger asChild>
          <div>
            <button className="sm:flex items-center hidden gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg">
              <Plus className="w-4 h-4" />
              Add Display
            </button>
            <button className="flex items-center sm:hidden gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </DialogTrigger>
      </div>
      <DialogContent className="sm:max-w-106.25 bg-[#111a2e] text-white">
        <DialogHeader>
          <DialogTitle>Create New Display</DialogTitle>
          <DialogDescription className="text-gray-300">
            Add a new LED display to your dashboard. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <div className="col-span-3">
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? "border-red-500" : ""}
                  placeholder="e.g., Front Door Display"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <div className="col-span-3">
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="e.g., The main display above the entrance"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hardwareID" className="text-right">
                Hardware ID
              </Label>
              <div className="col-span-3">
                <Input
                  id="hardwareID"
                  name="hardwareID"
                  value={formData.hardwareID}
                  onChange={handleInputChange}
                  className={errors.hardwareID ? "border-red-500" : ""}
                  placeholder="e.g., HW_16"
                />
                {errors.hardwareID && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.hardwareID}
                  </p>
                )}
              </div>
            </div>
            {errors.general && (
              <p className="text-sm text-red-500 text-center">
                {errors.general}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading}
              className=" bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? "Creating..." : "Create Display"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDisplay;
