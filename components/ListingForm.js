import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function ListingForm({ refreshListings }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const user = supabase.auth.getSession().then(({ data }) => data?.session?.user);

    const { error } = await supabase.from("listings").insert([
      {
        title,
        description,
        price: parseFloat(price),
        category,
        user_id: (await user)?.id,
      },
    ]);

    if (error) {
      console.error("Errore nell'inserimento dell'annuncio:", error);
      alert("Errore nell'inserimento dell'annuncio. Controlla i dati.");
    } else {
      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("");
      if (refreshListings) refreshListings(); // Aggiorna la lista nel componente principale
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded-lg shadow mb-6">
      <h2 className="font-bold text-lg mb-4">Inserisci un nuovo annuncio</h2>

      <input
        type="text"
        placeholder="Titolo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded w-full mb-3"
        required
      />

      <textarea
        placeholder="Descrizione"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 rounded w-full mb-3"
        required
      />

      <input
        type="number"
        placeholder="Prezzo (€)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="border p-2 rounded w-full mb-3"
        required
        step="0.01"
      />

      <input
        type="text"
        placeholder="Categoria"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 rounded w-full mb-3"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
      >
        {loading ? "Caricamento..." : "Aggiungi Annuncio"}
      </button>
    </form>
  );
}
