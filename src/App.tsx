import "./App.css";
import PomodoroTimer from "@/components/Pomodoro";
import StopWatch from "@/components/StopWatch";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

function App() {
  const [activeTab, setActiveTab] = useState<"pomodoro" | "stopwatch">(
    "pomodoro"
  );

  // Set initial theme from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("pomodoroSettings");
    if (savedSettings) {
      const { theme } = JSON.parse(savedSettings);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
    }
  }, []);

  return (
    <main>
      <div className="fixed top-4 left-0 right-0 flex justify-center z-10">
        <div className="flex gap-2 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
          <Button
            variant={activeTab === "pomodoro" ? "default" : "ghost"}
            onClick={() => setActiveTab("pomodoro")}
            className={
              activeTab === "pomodoro" ? "bg-indigo-500 text-white" : ""
            }
          >
            Pomodoro
          </Button>
          <Button
            variant={activeTab === "stopwatch" ? "default" : "ghost"}
            onClick={() => setActiveTab("stopwatch")}
            className={
              activeTab === "stopwatch" ? "bg-indigo-500 text-white" : ""
            }
          >
            StopWatch
          </Button>
        </div>
      </div>

      {activeTab === "pomodoro" ? <PomodoroTimer /> : <StopWatch />}
    </main>
  );
}

export default App;
