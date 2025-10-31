// 🧩 Toujours mettre les imports en premier
import React, { useState, useEffect } from "react";
import { roommates } from "../data/tasks";
import { sendWeeklyEmails } from "../utils/sendEmails";
import { getWeekNumber } from "../utils/assignments";

// 🔤 Fonction pour comparer sans accent ni majuscules
function normalizeName(name) {
  return name
    ? name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    : "";
}

// 🔹 Progression initiale
const initialProgress = {
  Fleury: 0,
  Fortuné: 0,
  Joel: 0,
};

export default function TaskTracker({ currentUser }) {
  const [progress, setProgress] = useState(initialProgress);
  const [currentWeek] = useState(getWeekNumber());
  const [history, setHistory] = useState([]);

  // 🔁 Chargement initial
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("coloc_data")) || {};
    const savedWeek = saved.week || currentWeek;
    const savedProgress = saved.progress || initialProgress;
    const savedHistory = saved.history || [];

    setProgress(savedProgress);
    setHistory(savedHistory);

    // 🧹 Si on change de semaine → reset et envoi des mails
    if (savedWeek !== currentWeek) {
      const resetProgress = { Fleury: 0, Fortuné: 0, Joel: 0 };
      setProgress(resetProgress);
      setHistory([...savedHistory, { week: savedWeek, progress: savedProgress }]);

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

  // 💾 Sauvegarde automatique
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

  // 🔁 Chaque lundi, on réinitialise les blocages journaliers
  useEffect(() => {
    const now = new Date();
    if (now.getDay() === 1) {
      roommates.forEach((r) => localStorage.removeItem(`lastDone_${r}`));
    }
  }, []);

  // ✅ Quand un colocataire clique sur “Fait ✅”
  const handleTaskDone = (name) => {
    const today = new Date().toDateString(); // ex: "Fri Nov 01 2025"

    // 🔒 Vérifie si le coloc a déjà cliqué aujourd’hui
    const lastDone = localStorage.getItem(`lastDone_${name}`);
    if (lastDone === today) {
      alert("Tu as déjà validé ta tâche aujourd’hui ✅ Reviens demain !");
      return;
    }

    // ✅ Incrémente le compteur uniquement pour le coloc connecté
    if (normalizeName(name) === normalizeName(currentUser)) {
      setProgress((prev) => {
        const newProgress = {
          ...prev,
          [name]: Math.min(prev[name] + 1, 7),
        };

        // 🕐 Sauvegarde la date du jour pour bloquer jusqu’à demain
        localStorage.setItem(`lastDone_${name}`, today);

        // 💾 Enregistre aussi la progression mise à jour
        localStorage.setItem(
          "coloc_data",
          JSON.stringify({
            week: currentWeek,
            progress: newProgress,
            history,
          })
        );

        return newProgress;
      });
    }
  };

  // 🖥️ Affichage
  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6">
      <h2 className="text-xl font-bold mb-2 text-green-700">
        📅 Suivi hebdomadaire des tâches
      </h2>

      <p className="mb-4 text-gray-600">
        🗓️ Semaine actuelle : <strong>{currentWeek}</strong>
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
                {progress[name]} / 7{" "}
                {progress[name] === 7 && <span className="text-green-600">🎉</span>}
              </td>
              <td>
                <button
                  onClick={() => handleTaskDone(name)}
                  disabled={
                    normalizeName(name) !== normalizeName(currentUser) ||
                    progress[name] === 7
                  }
                  className={`px-3 py-1 rounded-lg text-white ${
                    progress[name] === 7
                      ? "bg-gray-400"
                      : normalizeName(name) === normalizeName(currentUser)
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {progress[name] === 7
                    ? "Terminé"
                    : normalizeName(name) === normalizeName(currentUser)
                    ? "Fait ✅"
                    : "Verrouillé 🔒"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🕒 Historique des 2 dernières semaines */}
      {history.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-blue-700 mb-3">
            📜 Historique des 2 dernières semaines
          </h3>
          {history.slice(-2).map((weekData) => (
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
