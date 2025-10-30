// 🧩 Toujours mettre les imports en premier
import React, { useState, useEffect } from "react";
import { roommates } from "../data/tasks";
import { sendWeeklyEmails } from "../utils/sendEmails"; // ✅ ajouté ici

// 🧮 Ensuite les fonctions utilitaires
function getWeekNumber() {
  const now = new Date();
  const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDaysOfYear = (now - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

const initialProgress = {
  Fleury: 0,
  Fortuné: 0,
  Joel: 0,
};

export default function TaskTracker({ currentUser }) {
  const [progress, setProgress] = useState(initialProgress);
  const [currentWeek] = useState(getWeekNumber());
  const [history, setHistory] = useState([]);

  // 🔄 Le colocataire actif de la semaine
  const activeRoommate = roommates[currentWeek % roommates.length];

  // Chargement initial
  useEffect(() => {
  const saved = JSON.parse(localStorage.getItem("coloc_data")) || {};
  const savedWeek = saved.week || currentWeek;
  const savedProgress = saved.progress || initialProgress;
  const savedHistory = saved.history || [];

  setProgress(savedProgress);
  setHistory(savedHistory);

  // 👉 Si on change de semaine, on réinitialise et envoie les mails
  if (savedWeek !== currentWeek) {
    const resetProgress = { Fleury: 0, Fortuné: 0, Joel: 0 };
    setProgress(resetProgress);
    setHistory([...savedHistory, { week: savedWeek, progress: savedProgress }]);

    // 🔥 Envoi des mails via EmailJS
    sendWeeklyEmails();

    localStorage.setItem(
      "coloc_data",
      JSON.stringify({
        week: currentWeek,
        progress: resetProgress,
        history: [...savedHistory, { week: savedWeek, progress: savedProgress }],
      })
    );
  }
}, [currentWeek]);


  // Sauvegarde à chaque mise à jour
  useEffect(() => {
    localStorage.setItem(
      "coloc_data",
      JSON.stringify({
        week: currentWeek,
        progress,
        history,
      })
    );
  }, [progress, history, currentWeek]);

  // Quand le colocataire responsable fait sa tâche
  const handleTaskDone = (name) => {
    if (name !== activeRoommate || name !== currentUser) return; // 🔒 Empêche si ce n’est pas son tour OU pas le bon utilisateur
    setProgress((prev) => ({
      ...prev,
      [name]: Math.min(prev[name] + 1, 7),
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6">
      <h2 className="text-xl font-bold mb-2 text-green-700">
        📅 Suivi hebdomadaire des tâches
      </h2>

      <p className="mb-4 text-gray-600">
        🔐 <strong>{activeRoommate}</strong> est responsable cette semaine (semaine{" "}
        {currentWeek})
      </p>

      <table className="w-full text-left mb-6">
        <thead>
          <tr className="border-b">
            <th className="py-2">Colocataire</th>
            <th>Progression</th>
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
                  disabled={name !== activeRoommate || progress[name] === 7}
                  className={`px-3 py-1 rounded-lg text-white ${
                    progress[name] === 7
                      ? "bg-gray-400"
                      : name === activeRoommate
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {progress[name] === 7
                    ? "Terminé"
                    : name === activeRoommate
                    ? "Fait ✅"
                    : "Verrouillé 🔒"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Historique des deux dernières semaines */}
      {history.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-blue-700 mb-3">
            📜 Historique des 2 dernières semaines
          </h3>
          {history.map((weekData) => (
            <div
              key={weekData.week}
              className="border rounded-lg p-3 mb-2 bg-gray-50 shadow-sm"
            >
              <p className="font-medium mb-2">Semaine {weekData.week}</p>
              <ul>
                {Object.entries(weekData.progress).map(([name, value]) => (
                  <li key={name}>
                    {name} : {value} / 7 {value === 7 && "🎯"}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
