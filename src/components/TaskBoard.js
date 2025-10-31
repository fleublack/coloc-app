import React from "react";
import { getWeekNumber, getWeeklyAssignments } from "../utils/assignments";

export default function TaskBoard() {
  const weekNumber = getWeekNumber();
  const assignments = getWeeklyAssignments();

  // Transforme en liste exploitable
  const taskList = [];
  Object.entries(assignments).forEach(([roommate, tasks]) => {
    tasks.forEach((task) => {
      taskList.push({ task, roommate });
    });
  });

  return (
    <div className="bg-gray-800 text-gray-200 p-4 rounded-lg">
      <h2 className="text-xl font-semibold text-accentBlue mb-4">
        📅 Planning des tâches — Semaine {weekNumber}
      </h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-700 text-accentOrange">
            <th className="py-2">Tâche</th>
            <th className="py-2">Responsable</th>
          </tr>
        </thead>
        <tbody>
          {taskList.map((item, index) => (
            <tr key={index} className="hover:bg-gray-700 transition-all rounded-lg">
              <td className="py-2">{item.task}</td>
              <td className="py-2 font-semibold text-accentBlue">{item.roommate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
