import React, { useState } from "react";
import { roommates } from "../data/tasks";

export default function Login({ onLogin }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Vérifie si le nom correspond à un coloc connu (insensible à la casse)
    const normalizedName = name.trim().toLowerCase();
    const isAuthorized = roommates.some(
      (roommate) => roommate.toLowerCase() === normalizedName
    );

    if (isAuthorized) {
      localStorage.setItem("coloc_user", name.trim());
      onLogin(name.trim());
      setError("");
    } else {
      setError("🚫 Accès refusé : vous n'êtes pas membre de la colocation.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold text-green-700 mb-4">
          🏡 Connexion ColocApp
        </h1>
        <p className="text-gray-600 mb-4">Entrez votre prénom pour continuer :</p>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Votre prénom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Se connecter
          </button>
        </form>

        {error && (
          <p className="text-red-500 font-semibold mt-4">{error}</p>
        )}
      </div>
    </div>
  );
}
