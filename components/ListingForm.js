// components/ListingForm.js
import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function ListingForm({ session, onNewListing }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from("listings").insert([
      {
        title,
        description,
        category,
        price: parseFloat(price),
        user_id: session.user.id,
      },
    ]);
    if (error) console.error(error);
    else {
      setTitle("");
      setDescription("");
      setCategory("");
      setPrice("");
      if (onNewListing) onNewListing();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 bg-white p-4 rounded shadow">
      <input
        type="text"
        placeholder="Titolo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="border px-2 py-1 rounded"
      />
      <input
        type="text"
        placeholder="Descrizione"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="border px-2 py-1 rounded"
      />
      <input
        type="text"
        placeholder="Categoria"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        className="border px-2 py-1 rounded"
      />
      <input
        type="number"
        placeholder="Prezzo"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        className="border px-2 py-1 rounded"
      />
      <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700">
        Inserisci Annuncio
      </button>
    </form>
  );
}
