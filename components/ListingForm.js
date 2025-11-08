import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function ListingForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from("listings")
      .insert([
        {
          title,
          description,
          category,
          price: parseFloat(price),
        },
      ]);

    if (error) {
      console.error("Errore inserimento annuncio:", error);
    } else {
      alert("Annuncio inserito con successo!");
      setTitle("");
      setDescription("");
      setCategory("");
      setPrice("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Titolo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="border px-3 py-2 rounded"
      />
      <textarea
        placeholder="Descrizione"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="border px-3 py-2 rounded"
      />
      <input
        type="text"
        placeholder="Categoria"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        className="border px-3 py-2 rounded"
      />
      <input
        type="number"
        placeholder="Prezzo (€)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        className="border px-3 py-2 rounded"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Inserisci Annuncio
      </button>
    </form>
  );
}
