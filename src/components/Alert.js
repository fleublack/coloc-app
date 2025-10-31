import React from "react";
import {
  getWeeklyAssignments,
  getTimeUntilNextMonday,
  getWeekNumber,
} from "../utils/assignments";

// 🔤 Fonction pour supprimer les accents et normaliser les noms
function normalizeName(name) {
  return name
    .normalize("NFD") // Décompose les caractères accentués
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .toLowerCase(); // Met tout en minuscules
}

export default function Alert({ currentUser }) {
  const weekNumber = getWeekNumber();
  const assignments = getWeeklyAssignments();
  const { days, hours, minutes } = getTimeUntilNextMonday();

  // ✅ Recherche du colocataire sans tenir compte des accents / majuscules
  const normalizedUser = normalizeName(currentUser);
  const matchedKey = Object.keys(assignments).find(
    (key) => normalizeName(key) === normalizedUser
  );

  const tasks = matchedKey ? assignments[matchedKey] : null;

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-lg shadow-md">
      {tasks ? (
        <>
          <p className="font-semibold text-lg mb-1">
            👋 Salut {currentUser} ! Cette semaine ({weekNumber}), tu es responsable de{" "}
            <span className="text-yellow-700 font-bold">
              {tasks.join(" & ")}
            </span>.
          </p>
          <p className="text-sm">Pense à bien t’en occuper avant dimanche 🧽</p>
        </>
      ) : (
        <p className="font-semibold text-lg mb-1">
          👋 Salut {currentUser} ! Cette semaine ({weekNumber}), tu n’as aucune tâche attribuée 😎
        </p>
      )}
      <p className="text-xs mt-2 text-gray-600">
        ⏰ Prochaine rotation dans {days}j {hours}h {minutes}min.
      </p>
    </div>
  );
}
