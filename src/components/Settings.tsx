import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues: { pomodoro: number; shortBreak: number; longBreak: number };
  onApply: (newSettings: {
    pomodoro: number;
    shortBreak: number;
    longBreak: number;
  }) => void;
}

export default function Settings({
  isOpen,
  onClose,
  initialValues,
  onApply,
}: SettingsProps) {
  if (!isOpen) return null;

  const handleApply = () => {
    // Get values from inputs and pass them to onApply
    // You'll need to add refs or state to track input values
    const newSettings = {
      pomodoro: 25, // Replace with actual input value
      shortBreak: 5, // Replace with actual input value
      longBreak: 15, // Replace with actual input value
    };
    onApply(newSettings);
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
                  className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-2 text-white"
                  defaultValue={initialValues.pomodoro}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Short Break</label>
                <input
                  type="number"
                  className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-2 text-white"
                  defaultValue={initialValues.shortBreak}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Long Break</label>
                <input
                  type="number"
                  className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-2 text-white"
                  defaultValue={initialValues.longBreak}
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
