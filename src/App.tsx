import "./App.css";
import PomodoroTimer from "@/components/Pomodoro";
import { useEffect } from "react";

function App() {
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
      <PomodoroTimer />
    </main>
  );
}

export default App;
