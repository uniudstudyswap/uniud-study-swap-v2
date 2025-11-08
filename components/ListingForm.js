import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function ListingForm({ userId }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("listings").insert([
      { title, description, price, user_id: userId },
    ]);
    if (error) console.error(error);
    else {
      setTitle("");
      setDescription("");
      setPrice("");
      alert("Annuncio inserito!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-md">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titolo" required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrizione" required />
      <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Prezzo" required />
      <button type="submit" className="bg-green-600 text-white px-2 py-1 rounded">Pubblica</button>
    </form>
  );
}
