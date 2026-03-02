import { Button } from "@/components/ui/button";
import { X, Sun, Moon, Volume2, VolumeX, Plus, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { TimerSettings, Sequence, SequenceSettings } from "@/types/timer";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues: TimerSettings;
  onApply: (newSettings: TimerSettings) => void;
}

const DEFAULT_SEQUENCE_SETTINGS: SequenceSettings = {
  sequences: [],
  activeSequenceId: null,
  sequenceModeEnabled: false,
  totalSequenceTime: 0,
};

const EMPTY_SEQ_FORM = { pomodoro: 25, shortBreak: 5, longBreak: 0 };

export default function Settings({
  isOpen,
  onClose,
  initialValues,
  onApply,
}: SettingsProps) {
  const [values, setValues] = useState(initialValues);
  const [isAddingSequence, setIsAddingSequence] = useState(false);
  const [editingSequenceId, setEditingSequenceId] = useState<string | null>(null);
  const [seqForm, setSeqForm] = useState(EMPTY_SEQ_FORM);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  if (!isOpen) return null;

  const sequenceSettings = values.sequenceSettings ?? DEFAULT_SEQUENCE_SETTINGS;
  const sequences = sequenceSettings.sequences;

  // --- timer field handlers ---
  const handleInputChange = (
    field: "pomodoro" | "shortBreak" | "longBreak",
    value: string
  ) => {
    const numValue = parseInt(value) || 0;
    setValues((prev) => ({ ...prev, [field]: numValue }));
  };

  const toggleTheme = () => {
    setValues((prev) => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light",
    }));
  };

  const toggleSound = () => {
    setValues((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  // --- sequence helpers ---
  const updateSequenceSettings = (patch: Partial<SequenceSettings>) => {
    setValues((prev) => ({
      ...prev,
      sequenceSettings: { ...sequenceSettings, ...patch },
    }));
  };

  const handleAddSequenceClick = () => {
    setSeqForm(EMPTY_SEQ_FORM);
    setEditingSequenceId(null);
    setIsAddingSequence(true);
  };

  const handleEditSequence = (seq: Sequence) => {
    setSeqForm({ pomodoro: seq.pomodoro, shortBreak: seq.shortBreak, longBreak: seq.longBreak });
    setEditingSequenceId(seq.id);
    setIsAddingSequence(false);
  };

  const handleCancelForm = () => {
    setIsAddingSequence(false);
    setEditingSequenceId(null);
    setSeqForm(EMPTY_SEQ_FORM);
  };

  const handleSaveSequence = () => {
    if (editingSequenceId !== null) {
      // Update existing
      const updated = sequences.map((s) =>
        s.id === editingSequenceId ? { ...s, ...seqForm } : s
      );
      updateSequenceSettings({ sequences: updated });
    } else {
      // Add new
      const newSeq: Sequence = { id: crypto.randomUUID(), ...seqForm };
      const updated = [...sequences, newSeq];
      updateSequenceSettings({
        sequences: updated,
        // Auto-select if it's the first one
        activeSequenceId: updated.length === 1 ? newSeq.id : sequenceSettings.activeSequenceId,
      });
    }
    handleCancelForm();
  };

  const handleDeleteSequence = (id: string) => {
    const updated = sequences.filter((s) => s.id !== id);
    const newActiveId =
      sequenceSettings.activeSequenceId === id
        ? updated.length === 1
          ? updated[0].id
          : updated.length === 0
          ? null
          : sequenceSettings.activeSequenceId
        : sequenceSettings.activeSequenceId;
    updateSequenceSettings({
      sequences: updated,
      activeSequenceId: newActiveId,
      sequenceModeEnabled: updated.length === 0 ? false : sequenceSettings.sequenceModeEnabled,
    });
    if (editingSequenceId === id) handleCancelForm();
  };

  const handleSelectSequence = (id: string) => {
    updateSequenceSettings({ activeSequenceId: id });
  };

  const handleTotalTimeChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    updateSequenceSettings({ totalSequenceTime: Math.max(0, numValue) });
  };

  const handleSeqFormChange = (field: keyof typeof seqForm, value: string) => {
    const numValue = parseInt(value) || 0;
    setSeqForm((prev) => ({ ...prev, [field]: numValue }));
  };

  const isFormOpen = isAddingSequence || editingSequenceId !== null;

  const handleApply = () => {
    onApply(values);
    onClose();
  };

  const inputClass =
    "w-full bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded px-3 py-2 text-zinc-900 dark:text-white";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 w-[28rem] relative max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Settings</h2>
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Time (minutes) */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-zinc-900 dark:text-white">
              Time (minutes)
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-zinc-600 dark:text-zinc-400">Pomodoro</label>
                <input
                  title="Pomodoro Duration"
                  placeholder="Enter pomodoro duration"
                  type="number"
                  min="1"
                  max="60"
                  className={inputClass}
                  value={values.pomodoro}
                  onChange={(e) => handleInputChange("pomodoro", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-600 dark:text-zinc-400">Short Break</label>
                <input
                  title="Short Break Duration"
                  placeholder="Enter short break duration"
                  type="number"
                  min="1"
                  max="60"
                  className={inputClass}
                  value={values.shortBreak}
                  onChange={(e) => handleInputChange("shortBreak", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-600 dark:text-zinc-400">Long Break</label>
                <input
                  title="Long Break Duration"
                  placeholder="Enter long break duration"
                  type="number"
                  min="1"
                  max="60"
                  className={inputClass}
                  value={values.longBreak}
                  onChange={(e) => handleInputChange("longBreak", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Sequences */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-zinc-900 dark:text-white">Sequences</h3>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7 px-2"
                onClick={handleAddSequenceClick}
                disabled={isFormOpen}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Sequence
              </Button>
            </div>

            {/* Add / Edit form */}
            {isFormOpen && (
              <div className="space-y-3 p-3 border border-zinc-200 dark:border-zinc-600 rounded-lg bg-zinc-50 dark:bg-zinc-700/50">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {editingSequenceId !== null ? "Edit sequence" : "New sequence"} (minutes)
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-600 dark:text-zinc-400">Pomodoro</label>
                    <input
                      title="Sequence Pomodoro"
                      type="number"
                      min="1"
                      max="120"
                      className={inputClass + " py-1 text-sm"}
                      value={seqForm.pomodoro}
                      onChange={(e) => handleSeqFormChange("pomodoro", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-600 dark:text-zinc-400">Short Break</label>
                    <input
                      title="Sequence Short Break"
                      type="number"
                      min="1"
                      max="60"
                      className={inputClass + " py-1 text-sm"}
                      value={seqForm.shortBreak}
                      onChange={(e) => handleSeqFormChange("shortBreak", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-600 dark:text-zinc-400">Long Break</label>
                    <input
                      title="Sequence Long Break"
                      type="number"
                      min="0"
                      max="60"
                      className={inputClass + " py-1 text-sm"}
                      value={seqForm.longBreak}
                      onChange={(e) => handleSeqFormChange("longBreak", e.target.value)}
                    />
                    <p className="text-[10px] text-zinc-400">0 = skip</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="h-7 text-xs bg-indigo-500 hover:bg-indigo-600 text-white"
                    onClick={handleSaveSequence}
                    disabled={seqForm.pomodoro < 1 || seqForm.shortBreak < 1}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={handleCancelForm}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Sequence list */}
            {sequences.length > 0 && (
              <div className="space-y-1">
                {sequences.map((seq, index) => (
                  <div
                    key={seq.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                      sequenceSettings.activeSequenceId === seq.id
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30"
                        : "border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-700/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="activeSequence"
                      className="accent-indigo-500"
                      checked={sequenceSettings.activeSequenceId === seq.id}
                      onChange={() => handleSelectSequence(seq.id)}
                    />
                    <span className="text-xs font-semibold text-zinc-400 w-5">
                      #{index + 1}
                    </span>
                    <div className="flex-1 flex items-center gap-1 text-sm text-zinc-700 dark:text-zinc-300">
                      <span title="Pomodoro">{seq.pomodoro}m</span>
                      <span className="text-zinc-400">/</span>
                      <span title="Short Break">{seq.shortBreak}m</span>
                      {seq.longBreak > 0 && (
                        <>
                          <span className="text-zinc-400">/</span>
                          <span title="Long Break">{seq.longBreak}m</span>
                        </>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                      onClick={() => handleEditSequence(seq)}
                      disabled={isFormOpen}
                      title="Edit sequence"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-zinc-400 hover:text-red-500"
                      onClick={() => handleDeleteSequence(seq.id)}
                      title="Delete sequence"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {sequences.length === 0 && !isFormOpen && (
              <p className="text-sm text-zinc-400 dark:text-zinc-500 text-center py-2">
                No sequences yet. Click "Add Sequence" to create one.
              </p>
            )}

            {/* Total sequence time */}
            <div className="space-y-2">
              <label className="text-sm text-zinc-600 dark:text-zinc-400">
                Total sequence time (minutes)
              </label>
              <input
                title="Total sequence time"
                type="number"
                min="0"
                className={inputClass}
                value={sequenceSettings.totalSequenceTime}
                onChange={(e) => handleTotalTimeChange(e.target.value)}
              />
              <p className="text-xs text-zinc-400">0 = run until manually stopped</p>
            </div>
          </div>

          {/* Appearance */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-zinc-900 dark:text-white">Appearance</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Theme light/dark</span>
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
                onClick={toggleTheme}
              >
                {values.theme === "light" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Sound */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-zinc-900 dark:text-white">Sound</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                Timer completion sound
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
                onClick={toggleSound}
              >
                {values.soundEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-200 dark:border-zinc-700">
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
