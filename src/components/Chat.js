import React, { useState, useEffect } from "react";

const CATEGORIES = [
  { id: "incident", label: "🚨 Déclarer un incident" },
  { id: "information", label: "📢 Donner une information" },
  { id: "idee", label: "💡 Proposer une idée" },
  { id: "rappel", label: "📜 Faire un rappel de règle" },
];

export default function Chat({ currentUser }) {
  const [messages, setMessages] = useState(() => {
    return JSON.parse(localStorage.getItem("structured_chat")) || [];
  });
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [text, setText] = useState("");

  // Sauvegarde automatique dans localStorage
  useEffect(() => {
    localStorage.setItem("structured_chat", JSON.stringify(messages));
  }, [messages]);

  const handleSend = () => {
    if (text.trim() === "") return alert("💬 Écris un message avant d’envoyer !");
    const newMsg = {
      id: Date.now(),
      user: currentUser,
      category,
      text,
      timestamp: new Date().toLocaleString(),
    };
    setMessages([...messages, newMsg]);
    setText("");
  };

  const getCategoryLabel = (id) => {
    const cat = CATEGORIES.find((c) => c.id === id);
    return cat ? cat.label : "Autre";
  };

  return (
    <div className="bg-white text-gray-800 rounded-xl shadow p-4">
      <h2 className="text-lg font-bold text-green-700 mb-3">
        💬 Communication entre colocataires
      </h2>

      {/* Sélection de catégorie */}
      <div className="mb-3">
        <label className="block text-sm font-semibold mb-1">
          Choisis un sujet :
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded-lg bg-gray-50"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Zone de message */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="3"
        placeholder="Écris ton message ici..."
        className="w-full p-2 border rounded-lg mb-3 bg-gray-50"
      ></textarea>

      {/* Bouton d'envoi */}
      <button
        onClick={handleSend}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
      >
        Envoyer 🚀
      </button>

      {/* Historique des messages */}
      <div className="mt-5 max-h-72 overflow-y-auto space-y-2">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-sm italic">
            Aucun message pour le moment...
          </p>
        ) : (
          messages
            .slice()
            .reverse()
            .map((msg) => (
              <div
                key={msg.id}
                className="border rounded-lg p-2 bg-gray-100 shadow-sm"
              >
                <p className="text-sm text-gray-600 mb-1">
                  <strong className="text-green-700">{msg.user}</strong> •{" "}
                  <span className="text-xs text-gray-500">{msg.timestamp}</span>
                </p>
                <p className="text-xs font-semibold text-blue-700">
                  {getCategoryLabel(msg.category)}
                </p>
                <p className="text-sm mt-1">{msg.text}</p>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
