import React, { useState, useEffect } from "react";
import { roommates, weeklyTasks } from "../data/tasks";

// Fonction pour déterminer la semaine actuelle
function getWeekNumber() {
  const now = new Date();
  const oneJan = new Date(now.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((now - oneJan) / (24 * 60 * 60 * 1000));
  return Math.ceil((now.getDay() + 1 + numberOfDays) / 7);
}

const initialProgress = {
  Fleury: 0,
  Fortuné: 0,
  Joel: 0,
};

export default function TaskTracker() {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem("coloc_progress");
    return saved ? JSON.parse(saved) : initialProgress;
  });

  const weekNumber = getWeekNumber();
  const responsible = roommates[(0 + weekNumber) % roommates.length]; // même logique que dans App.js

  useEffect(() => {
    localStorage.setItem("coloc_progress", JSON.stringify(progress));
  }, [progress]);

  const handleTaskDone = (name) => {
    if (name !== responsible) return; // 🔒 bloque si ce n’est pas le bon coloc
    setProgress((prev) => ({
      ...prev,
      [name]: Math.min(prev[name] + 1, 7),
    }));
  };

  const resetWeek = () => {
    if (window.confirm("Réinitialiser les scores pour une nouvelle semaine ?")) {
      setProgress(initialProgress);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6">
      <h2 className="text-xl font-bold mb-4 text-green-700">
        📅 Suivi hebdomadaire des tâches
      </h2>

      <p className="mb-4 text-gray-600">
        🔐 Cette semaine, seul <strong className="text-green-700">{responsible}</strong> peut valider sa tâche.
      </p>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2">Colocataire</th>
            <th>Tâches effectuées</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(progress).map((name) => (
            <tr key={name} className="border-b">
              <td className="py-2 font-semibold">{name}</td>
              <td>
                {progress[name]} / 7 {progress[name] === 7 && "🎉"}
              </td>
              <td>
                <button
                  onClick={() => handleTaskDone(name)}
                  disabled={name !== responsible || progress[name] === 7}
                  className={`px-3 py-1 rounded-lg text-white ${
                    progress[name] === 7
                      ? "bg-gray-400"
                      : name === responsible
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {progress[name] === 7
                    ? "Terminé"
                    : name === responsible
                    ? "Fait ✅"
                    : "Verrouillé 🔒"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-center mt-4">
        <button
          onClick={resetWeek}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          🔁 Réinitialiser la semaine
        </button>
      </div>
    </div>
  );
}
