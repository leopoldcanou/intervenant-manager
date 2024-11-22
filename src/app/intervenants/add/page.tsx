"use client";

import { useState } from "react";

export default function AddIntervenantForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/intervenants/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    if (res.ok) {
      setMessage("Intervenant ajouté avec succès !");
      setName("");
      setEmail("");
    } else {
      setMessage("Erreur lors de l’ajout de l’intervenant.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Nom:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
      </div>
      <button type="submit">Ajouter</button>
      {message && <p>{message}</p>}
    </form>
  );
}
