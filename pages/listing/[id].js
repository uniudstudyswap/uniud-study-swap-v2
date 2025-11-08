import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../supabaseClient";

export default function ListingPage() {
  const router = useRouter();
  const { id } = router.query;
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchListing = async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .single();
      if (error) console.error("Errore fetch listing:", error);
      else setListing(data);
      setLoading(false);
    };

    fetchListing();
  }, [id]);

  const handlePurchase = async () => {
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Errore creazione sessione checkout:", data);
      }
    } catch (err) {
      console.error("Errore checkout:", err);
    }
  };

  if (loading) return <p>Caricamento annuncio...</p>;
  if (!listing) return <p>Annuncio non trovato.</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
      <p className="text-gray-700 mb-2">{listing.description}</p>
      <p className="font-semibold mb-2">Prezzo: €{listing.price}</p>
      <p className="text-sm text-gray-500 mb-4">Categoria: {listing.category}</p>
      <button
        onClick={handlePurchase}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
      >
        Acquista
      </button>
    </div>
  );
}
