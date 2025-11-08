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

      if (error) console.error(error);
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
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Errore nella creazione della sessione di pagamento");
    } catch (err) {
      console.error(err);
      alert("Errore di connessione al server");
    }
  };

  if (loading) return <p>Caricamento...</p>;
  if (!listing) return <p>Annuncio non trovato</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold">{listing.title}</h1>
      <p className="mt-2">{listing.description}</p>
      <p className="mt-4 font-semibold">Prezzo: €{listing.price}</p>
      <button
        onClick={handlePurchase}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Acquista
      </button>
    </div>
  );
}
