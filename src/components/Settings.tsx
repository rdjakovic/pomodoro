import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { TimerSettings } from "@/types/timer";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues: TimerSettings;
  onApply: (newSettings: TimerSettings) => void;
}

export default function Settings({
  isOpen,
  onClose,
  initialValues,
  onApply,
}: SettingsProps) {
  const [values, setValues] = useState(initialValues);

  // Update local state when initialValues change
  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  if (!isOpen) return null;

  const handleInputChange = (
    field: "pomodoro" | "shortBreak" | "longBreak",
    value: string
  ) => {
    const numValue = parseInt(value) || 0;
    setValues((prev) => ({
      ...prev,
      [field]: numValue,
    }));
  };

  const handleApply = () => {
    onApply(values);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-800 rounded-lg p-6 w-96 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Settings</h2>
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-zinc-300"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Time (minutes)</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Pomodoro</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-2 text-white"
                  value={values.pomodoro}
                  onChange={(e) =>
                    handleInputChange("pomodoro", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Short Break</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-2 text-white"
                  value={values.shortBreak}
                  onChange={(e) =>
                    handleInputChange("shortBreak", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Long Break</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-2 text-white"
                  value={values.longBreak}
                  onChange={(e) =>
                    handleInputChange("longBreak", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-700">
            <Button
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
              onClick={handleApply}
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
