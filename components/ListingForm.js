// components/listingform.js
import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function ListingForm({ onNewListing }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !category || !price) {
      alert("Per favore compila tutti i campi.");
      return;
    }

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
      console.error("Errore nell'inserimento dell'annuncio:", error);
      alert("Si è verificato un errore. Riprova.");
    } else {
      alert("Annuncio inserito con successo!");
      setTitle("");
      setDescription("");
      setCategory("");
      setPrice("");
      if (onNewListing) onNewListing(data[0]); // aggiorna la lista degli annunci nel parent
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-xl font-bold mb-4">Inserisci un nuovo annuncio</h2>
      <form onSubmit={handleSubmit}>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Titolo
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>

        <label className="block text-gray-700 text-sm font-bold mb-2">
          Descrizione
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>

        <label className="block text-gray-700 text-sm font-bold mb-2">
          Categoria
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>

        <label className="block text-gray-700 text-sm font-bold mb-2">
          Prezzo (€)
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            step="0.01"
          />
        </label>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
        >
          Inserisci Annuncio
        </button>
      </form>
    </div>
  );
}
