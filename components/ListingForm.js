import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function ListingForm({ userId }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.from("listings").insert([
      {
        title,
        description,
        category,
        price: parseFloat(price),
        user_id: userId,
      },
    ]);

    if (error) {
      setMessage(`Errore: ${error.message}`);
    } else {
      setMessage("Annuncio creato con successo!");
      setTitle("");
      setDescription("");
      setCategory("");
      setPrice("");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg"
    >
      <h2 className="text-xl font-semibold mb-4">Nuovo Annuncio</h2>

      {message && <p className="mb-4 text-red-600">{message}</p>}

      <input
        type="text"
        placeholder="Titolo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-3 p-2 border border-gray-300 rounded"
        required
      />

      <textarea
        placeholder="Descrizione"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full mb-3 p-2 border border-gray-300 rounded"
        required
      />

      <input
        type="text"
        placeholder="Categoria"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full mb-3 p-2 border border-gray-300 rounded"
        required
      />

      <input
        type="number"
        placeholder="Prezzo (€)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full mb-3 p-2 border border-gray-300 rounded"
        step="0.01"
        min="0"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow transition"
      >
        {loading ? "Caricamento..." : "Crea Annuncio"}
      </button>
    </form>
  );
}
