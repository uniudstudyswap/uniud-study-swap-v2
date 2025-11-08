import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function ListingForm({ userId, onListingCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.from("listings").insert([
      {
        title,
        description,
        price: parseFloat(price),
        user_id: userId,
      },
    ]);

    if (error) {
      console.error("Errore nell'inserimento dell'annuncio:", error);
      return;
    }

    setTitle("");
    setDescription("");
    setPrice("");
    if (onListingCreated) onListingCreated(data[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
      <input
        type="text"
        placeholder="Titolo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
        required
      />
      <textarea
        placeholder="Descrizione"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
        required
      />
      <input
        type="number"
        placeholder="Prezzo"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Inserisci annuncio
      </button>
    </form>
  );
}
