import React from "react";
import { roommates, weeklyTasks } from "../data/tasks";

function getWeekNumber() {
  const now = new Date();
  const oneJan = new Date(now.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((now - oneJan) / (24 * 60 * 60 * 1000));
  return Math.ceil((now.getDay() + 1 + numberOfDays) / 7);
}

export default function TaskBoard() {
  const weekNumber = getWeekNumber();

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-semibold mb-2">Planning des tâches - Semaine {weekNumber}</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Tâche</th>
            <th className="border p-2">Responsable</th>
          </tr>
        </thead>
        <tbody>
          {weeklyTasks.map((task, index) => {
            const assignedRoommate = roommates[(index + weekNumber) % roommates.length];
            return (
              <tr key={task.id}>
                <td className="border p-2">{task.name}</td>
                <td className="border p-2">{assignedRoommate}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
