import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function ListingForm({ onNewListing }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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

    setLoading(false);

    if (error) {
      console.error("Errore inserimento listing:", error);
      alert("Errore durante l'inserimento dell'annuncio.");
      return;
    }

    // Reset form
    setTitle("");
    setDescription("");
    setCategory("");
    setPrice("");

    // Aggiorna la lista di annunci in index.js
    if (onNewListing) onNewListing(data[0]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto"
    >
      <h2 className="text-xl font-bold mb-4">Crea un nuovo annuncio</h2>

      <input
        type="text"
        placeholder="Titolo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full mb-3 p-2 border rounded"
      />

      <textarea
        placeholder="Descrizione"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="text"
        placeholder="Categoria"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="number"
        placeholder="Prezzo"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        className="w-full mb-3 p-2 border rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? "Caricamento..." : "Pubblica annuncio"}
      </button>
    </form>
  );
}
