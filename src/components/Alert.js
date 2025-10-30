import React, { useEffect, useState } from "react";

export default function Alert({ name, task }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      // Prochain dimanche à 23h59
      const nextSunday = new Date(now);
      nextSunday.setDate(now.getDate() + ((7 - now.getDay()) % 7));
      nextSunday.setHours(23, 59, 59, 999);

      const diff = nextSunday - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      setTimeLeft(`${days}j ${hours}h ${minutes}min`);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 60000); // met à jour chaque minute
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-4 rounded">
      👋 Salut <b>{name}</b> ! Cette semaine, tu es responsable de <b>{task}</b>.
      <br />
      Pense à bien t’en occuper avant dimanche 🧽
      <div className="mt-2 text-sm text-yellow-700">
        ⏰ Prochaine rotation dans <b>{timeLeft}</b>
      </div>
    </div>
  );
}
