import React from "react";
import { roommates, weeklyTasks } from "../data/tasks";
import jsPDF from "jspdf";
import { rules } from "../data/rules";

function getWeekNumber() {
  const now = new Date();
  const oneJan = new Date(now.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((now - oneJan) / (24 * 60 * 60 * 1000));
  return Math.ceil((now.getDay() + 1 + numberOfDays) / 7);
}

export default function History() {
  const currentWeek = getWeekNumber();
  const historyWeeks = [currentWeek - 1, currentWeek - 2, currentWeek - 3];

  const generatePDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    let y = 25;

    // === PAGE 1 : TITRE + PLANNING ===
    doc.setFillColor(230, 250, 240);
    doc.rect(0, 0, 210, 25, "F");

    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 120, 60);
    doc.setFontSize(20);
    doc.text("Historique de la Colocation", 15, 18);

    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`Date de génération : ${new Date().toLocaleDateString()}`, 150, 18);

    y += 10;
    doc.setFontSize(14);
    doc.setTextColor(0, 100, 0);
    doc.text(`Planning de la semaine ${currentWeek}`, 15, y);
    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);

    weeklyTasks.forEach((task, index) => {
      const assignedRoommate = roommates[(index + currentWeek) % roommates.length];
      doc.text(`• ${task.name} → ${assignedRoommate}`, 20, y);
      y += 8;
    });

    // === PAGE 2 : RÈGLES DE VIE ===
    doc.addPage();
    y = 25;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 120, 60);
    doc.text("Règles de vie de la colocation", 15, y);
    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    rules.forEach((rule, index) => {
      doc.text(`${index + 1}. ${rule}`, 20, y);
      y += 8;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    // === PAGE 3 : HISTORIQUE ===
    doc.addPage();
    y = 25;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 120, 60);
    doc.text("Historique des semaines précédentes", 15, y);
    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);

    historyWeeks.forEach((week) => {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 90, 0);
      doc.text(`Semaine ${week}`, 15, y);
      y += 8;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(50, 50, 50);
      weeklyTasks.forEach((task, index) => {
        const assignedRoommate = roommates[(index + week) % roommates.length];
        doc.text(`• ${task.name} → ${assignedRoommate}`, 20, y);
        y += 7;
      });
      y += 5;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    // === PIED DE PAGE ===
    doc.setDrawColor(200, 200, 200);
    doc.line(10, 285, 200, 285);
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text("© Colocation Fleury, Fortuné & Joel - Rapport automatique", 15, 292);

    // === SAUVEGARDE ===
    doc.save(`Rapport_Colocation_Semaine_${currentWeek}.pdf`);
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md mt-6 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-green-700">
          📅 Historique des semaines précédentes
        </h2>
        <button
          onClick={generatePDF}
          className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm shadow hover:bg-green-700 transition"
        >
          Télécharger le rapport complet 📄
        </button>
      </div>

      {historyWeeks.map((week, i) => (
        <div key={i} className="mb-4">
          <p className="font-semibold text-gray-800">Semaine {week}</p>
          <ul className="list-disc ml-6 text-gray-700">
            {weeklyTasks.map((task, index) => {
              const assignedRoommate =
                roommates[(index + week) % roommates.length];
              return (
                <li key={task.id}>
                  {task.name} → <b>{assignedRoommate}</b>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
