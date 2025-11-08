import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function ListingForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.from("listings").insert([
      { title, description, category, price: parseFloat(price) }
    ]);

    if (error) console.error("Errore inserimento annuncio:", error);
    else {
      setTitle("");
      setDescription("");
      setCategory("");
      setPrice("");
      alert("Annuncio inserito correttamente!");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titolo" required />
      <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrizione" required />
      <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Categoria" required />
      <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Prezzo" type="number" step="0.01" required />
      <button type="submit" disabled={loading}>{loading ? "Caricamento..." : "Inserisci annuncio"}</button>
    </form>
  );
}
