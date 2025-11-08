import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ListingDetail({ listingId }) {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", listingId)
        .single();

      if (error) console.error("Errore nel recupero dell'annuncio:", error);
      setListing(data);
      setLoading(false);
    };

    fetchListing();
  }, [listingId]);

  const handlePurchase = async () => {
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listingId }),
      });

      const data = await response.json();
      if (data.url) window.location.href = data.url;
      else console.error("Errore nella creazione della sessione di pagamento:", data);
    } catch (err) {
      console.error("Errore:", err);
    }
  };

  if (loading) return <p>Caricamento annuncio...</p>;
  if (!listing) return <p>Annuncio non trovato.</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-2">{listing.title}</h2>
      <p className="mb-4">{listing.description}</p>
      <p className="font-semibold mb-4">Prezzo: €{listing.price}</p>
      <button
        onClick={handlePurchase}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Acquista
      </button>
    </div>
  );
}
