import React from "react";
import { rules } from "../data/rules";

export default function Rules() {
  return (
    <div className="p-4 bg-white rounded shadow-md mt-4">
      <h2 className="text-xl font-semibold mb-2">Règles de vie 🧾</h2>
      <ul className="list-disc ml-6">
        {rules.map((rule, i) => (
          <li key={i}>{rule}</li>
        ))}
      </ul>
    </div>
  );
}
