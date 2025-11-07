import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function ListingForm({ onListingAdded }) {
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
        price,
        user_id: supabase.auth.getUser()?.data?.user?.id,
      },
    ]);

    if (error) console.error("Errore inserimento:", error);
    else {
      setTitle("");
      setDescription("");
      setCategory("");
      setPrice("");
      if (onListingAdded) onListingAdded(data[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded-lg shadow mb-6">
      <h2 className="text-lg font-bold mb-2">Crea un annuncio</h2>
      <input
        type="text"
        placeholder="Titolo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 mb-2 w-full"
        required
      />
      <textarea
        placeholder="Descrizione"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 mb-2 w-full"
        required
      />
      <input
        type="text"
        placeholder="Categoria"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 mb-2 w-full"
        required
      />
      <input
        type="number"
        placeholder="Prezzo"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="border p-2 mb-2 w-full"
        required
      />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Pubblica annuncio
      </button>
    </form>
  );
}
