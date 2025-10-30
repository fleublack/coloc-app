import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import TaskBoard from "./components/TaskBoard";
import Rules from "./components/Rules";
import Alert from "./components/Alert";
import History from "./components/History";
import { roommates, weeklyTasks } from "./data/tasks";

function getWeekNumber() {
  const now = new Date();
  const oneJan = new Date(now.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((now - oneJan) / (24 * 60 * 60 * 1000));
  return Math.ceil((now.getDay() + 1 + numberOfDays) / 7);
}

export default function App() {
  const weekNumber = getWeekNumber();
  const [showHistory, setShowHistory] = useState(false); // État pour afficher/masquer l’historique

  // Tâche principale (Cuisine & Vaisselle)
  const mainTask = weeklyTasks[0].name;
  const assignedRoommate = roommates[(0 + weekNumber) % roommates.length];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
          🏡 Organisation Colocation – Fleury, Fortuné & Joel
        </h1>

        <Alert name={assignedRoommate} task={mainTask} />
        <TaskBoard />
        <Rules />

        {/* --- BOUTON AFFICHER/MASQUER HISTORIQUE --- */}
<div className="text-center mt-6">
  <button
    onClick={() => setShowHistory(!showHistory)}
    className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
  >
    {showHistory ? "Masquer l’historique" : "Afficher l’historique 📅"}
  </button>
</div>

        {/* --- HISTORIQUE AVEC ANIMATION --- */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
            >
              <History />
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="text-center text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} Colocation App – Tous droits réservés
        </footer>
      </div>
    </div>
  );
}
