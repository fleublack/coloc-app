import React, { useState } from "react";
import TaskTracker from "./components/TaskTracker";
import History from "./components/History";
import Chat from "./components/Chat";
import Alert from "./components/Alert";
import TaskBoard from "./components/TaskBoard";
import Rules from "./components/Rules";
import { motion, AnimatePresence } from "framer-motion";

function getWeekNumber() {
  const now = new Date();
  const target = new Date(now.valueOf());
  const dayNr = (now.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  return Math.floor((target - firstThursday) / (7 * 24 * 60 * 60 * 1000) + 1);
}

export default function App({ currentUser, onLogout }) {
  const weekNumber = getWeekNumber();

  const [showLeft, setShowLeft] = useState(true);
  const [showMiddle, setShowMiddle] = useState(true);
  const [showRight, setShowRight] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark to-black text-gray-200 p-6">
      <div className="max-w-7xl mx-auto bg-lightGray p-8 rounded-2xl shadow-soft">
        {/* 🔹 En-tête */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-accentBlue drop-shadow-sm">
              👋 Bonjour, {currentUser} !
            </h1>
            <div className="h-1 w-20 bg-accentOrange rounded-full mt-2"></div>
          </div>
          <button
            onClick={onLogout}
            className="bg-accentOrange text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Déconnexion
          </button>
        </div>

        {/* ⚙️ Grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 🟩 Colonne gauche : suivi + historique */}
          <div className="space-y-4">
            <button
              onClick={() => setShowLeft(!showLeft)}
              className="w-full bg-accentBlue text-white px-4 py-2 rounded-lg hover:bg-cyan-500 transition"
            >
              {showLeft ? "Masquer le suivi 📉" : "Afficher le suivi 📈"}
            </button>
            <AnimatePresence>
              {showLeft && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4 bg-gray-900 p-4 rounded-xl shadow-md hover:shadow-lg transition"
                >
                  <TaskTracker currentUser={currentUser} />
                  <History />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 💛 Colonne centrale : alerte + tableau + règles */}
          <div className="space-y-4">
            <button
              onClick={() => setShowMiddle(!showMiddle)}
              className="w-full bg-accentOrange text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition"
            >
              {showMiddle ? "Masquer les infos 🗓️" : "Afficher les infos 📅"}
            </button>

            <AnimatePresence>
              {showMiddle && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4 bg-gray-900 p-4 rounded-xl shadow-md hover:shadow-lg transition"
                >
                  {/* 👇 Affiche la tâche du colocataire connecté */}
                  <Alert currentUser={currentUser} />
                  <TaskBoard />
                  <Rules />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 💬 Colonne droite : chat */}
          <div className="space-y-4">
            <button
              onClick={() => setShowRight(!showRight)}
              className="w-full bg-accentBlue text-white px-4 py-2 rounded-lg hover:bg-cyan-500 transition"
            >
              {showRight ? "Masquer le chat 💬" : "Afficher le chat 💭"}
            </button>

            <AnimatePresence>
              {showRight && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="bg-gray-900 p-4 rounded-xl shadow-md hover:shadow-lg transition"
                >
                  <Chat currentUser={currentUser} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
