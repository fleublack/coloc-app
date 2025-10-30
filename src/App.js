// src/App.js
import React from "react";
import TaskTracker from "./components/TaskTracker";
import Alert from "./components/Alert";
import TaskBoard from "./components/TaskBoard";
import Rules from "./components/Rules";
import History from "./components/History";
import Chat from "./components/Chat"; // 👈 ajout ici
import { roommates, weeklyTasks } from "./data/tasks";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl">

        {/* Barre d’en-tête */}
        <div className="flex justify-between items-center mb-6">
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

        {/* Message principal de la semaine */}
        <Alert name={assignedRoommate} task={mainTask} />

        {/* Tableau des tâches */}
        <TaskBoard />

        {/* Règles de vie */}
        <Rules />

        {/* Suivi hebdomadaire */}
        <TaskTracker currentUser={currentUser} />

        {/* Historique des semaines précédentes */}
        <History />

        {/* 💬 Chat entre colocataires */}
        <Chat currentUser={currentUser} /> {/* 👈 ajouté ici */}
      </div>
    </div>
  );
}
