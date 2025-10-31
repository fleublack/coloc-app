import { roommates, weeklyTasks } from "../data/tasks";

// 🔹 Calcule le numéro de semaine ISO stable (même que les sites officiels)
// ✅ Calcule la vraie semaine ISO (lundi = début de semaine)
export function getWeekNumber() {
  const now = new Date();
  const target = new Date(now.valueOf());

  // On se place au jeudi de la semaine courante
  target.setDate(target.getDate() - ((target.getDay() + 6) % 7) + 3);

  // Premier jeudi de l'année
  const firstThursday = new Date(target.getFullYear(), 0, 4);

  // Calcul du numéro de semaine ISO
  const weekNumber =
    1 + Math.round(((target - firstThursday) / 86400000 - 3 + ((firstThursday.getDay() + 6) % 7)) / 7);

  return weekNumber;
}



// 🔹 Calcule les affectations pour la semaine courante
export function getWeeklyAssignments() {
  const weekNumber = getWeekNumber();
  const assignments = {};

  weeklyTasks.forEach((task, index) => {
    // ✅ Utilise (weekNumber - 1) pour garder cohérence jusqu’au lundi
    const assigned = roommates[(index + weekNumber) % roommates.length];
    if (assignments[assigned]) {
      assignments[assigned].push(task.name);
    } else {
      assignments[assigned] = [task.name];
    }
  });

  return assignments;
}

// 🔹 Calcule le temps restant avant lundi prochain
export function getTimeUntilNextMonday() {
  const now = new Date();
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + ((8 - now.getDay()) % 7));
  nextMonday.setHours(0, 0, 0, 0);

  const diffMs = nextMonday - now;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);

  return { days, hours, minutes };
}
