import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function ListingForm({ onListingAdded }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("listings")
      .insert([{ ...form }]);
    if (error) console.error(error);
    else {
      alert("Annuncio inserito con successo!");
      setForm({ title: "", description: "", category: "", price: "" });
      onListingAdded();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4">
      <h2 className="text-xl font-bold mb-3">Crea un nuovo annuncio</h2>

      <input name="title" placeholder="Titolo" value={form.title} onChange={handleChange} className="border p-2 w-full mb-2" required />
      <textarea name="description" placeholder="Descrizione" value={form.description} onChange={handleChange} className="border p-2 w-full mb-2" required />
      <input name="category" placeholder="Categoria" value={form.category} onChange={handleChange} className="border p-2 w-full mb-2" required />
      <input name="price" placeholder="Prezzo (€)" value={form.price} onChange={handleChange} className="border p-2 w-full mb-2" required />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Pubblica annuncio
      </button>
    </form>
  );
}
