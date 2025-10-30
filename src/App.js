import React, { useState } from "react";
import TaskTracker from "./components/TaskTracker";
import History from "./components/History";
import Chat from "./components/Chat";
import Alert from "./components/Alert";
import TaskBoard from "./components/TaskBoard";
import Rules from "./components/Rules";
import { roommates, weeklyTasks } from "./data/tasks";
import { motion, AnimatePresence } from "framer-motion";

function getWeekNumber() {
  const now = new Date();
  const oneJan = new Date(now.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((now - oneJan) / (24 * 60 * 60 * 1000));
  return Math.ceil((now.getDay() + 1 + numberOfDays) / 7);
}

export default function App({ currentUser, onLogout }) {
  const weekNumber = getWeekNumber();
  const mainTask = weeklyTasks[0].name;
  const assignedRoommate = roommates[(0 + weekNumber) % roommates.length];

  const [showLeft, setShowLeft] = useState(true);
  const [showMiddle, setShowMiddle] = useState(true);
  const [showRight, setShowRight] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
        {/* 🔹 En-tête */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-green-700">
            👋 Bonjour, {currentUser} !
          </h1>
          <button
            onClick={onLogout}
            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
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
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
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
                  className="space-y-4"
                >
                  <TaskTracker currentUser={currentUser} />
                  <History />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 💛 Colonne centrale : message, tableau, règles */}
          <div className="space-y-4">
            <button
              onClick={() => setShowMiddle(!showMiddle)}
              className="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
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
                  className="space-y-4"
                >
                  <Alert name={assignedRoommate} task={mainTask} />
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
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
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
