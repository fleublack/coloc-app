// src/components/Chat.js
import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import emailjs from "emailjs-com";

const Chat = ({ currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const userEmailMap = {
    Fleury: "fleumobs@gmail.com",
    Fortuné: "fortunemobima47@gmail.com",
    Joel: "fleublackm@gmail.com",
  };

  // 📡 Charger les messages en temps réel
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  // 📤 Envoyer un message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    await addDoc(collection(db, "messages"), {
      text: newMessage,
      sender: currentUser,
      timestamp: serverTimestamp(),
    });

    // ✉️ Notification EmailJS aux autres colocataires
    const recipients = Object.values(userEmailMap).filter(
      (mail) => mail !== userEmailMap[currentUser]
    );

    recipients.forEach((email) => {
      emailjs.send(
        "service_0nuoi1h", // ✅ ton service ID
        "template_4zkucni", // ✅ ton template ID
        {
          name: currentUser,
          to_name: email.split("@")[0],
          message: newMessage,
          email: email,
          site_url: window.location.origin,
        },
        "7jpXvKcBUMhTDBonN" // ✅ ta clé publique
      );
    });

    setNewMessage("");
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6">
      <h2 className="text-xl font-bold mb-4 text-green-700">💬 Chat entre colocataires</h2>

      <div className="h-64 overflow-y-auto border p-3 rounded-lg bg-gray-50 mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 p-2 rounded-lg max-w-[75%] ${
              msg.sender === currentUser
                ? "bg-green-100 ml-auto text-right"
                : "bg-gray-200"
            }`}
          >
            <p className="text-sm text-gray-600 font-semibold">{msg.sender}</p>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex space-x-2">
        <input
          type="text"
          placeholder="Écris ton message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Envoyer 🚀
        </button>
      </form>
    </div>
  );
};

export default Chat;
