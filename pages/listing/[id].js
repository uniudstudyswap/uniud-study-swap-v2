import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Recupera la sessione utente
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data?.session ?? null);
    };
    getSession();
  }, []);

  useEffect(() => {
    if (id) fetchListing();
  }, [id]);

  async function fetchListing() {
    const { data, error } = await supabase
      .from("annunci")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Errore caricamento annuncio:", error);
      setError("Impossibile caricare l'annuncio.");
    } else {
      setListing(data);
    }
    setLoading(false);
  }

  async function handlePurchase() {
    if (!session) {
      alert("Devi accedere per acquistare un prodotto!");
      return;
    }

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: listing.id,
          titolo: listing.titolo,
          prezzo: listing.prezzo,
          venditore_id: listing.venditore_id, // campo nella tabella annunci
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Errore nella creazione della sessione di pagamento");
      }

      // Reindirizza a Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert("Errore durante il pagamento. Riprova più tardi.");
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Caricamento...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        {error}
      </div>
    );

  if (!listing)
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Annuncio non trovato.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <button
        onClick={() => router.push("/")}
        className="text-blue-600 underline mb-4"
      >
        ← Torna indietro
      </button>

      <div className="max-w-2xl mx-auto bg-white shadow rounded p-6">
        <h1 className="text-3xl font-bold mb-2">{listing.titolo}</h1>
        <p className="text-gray-700 mb-4">{listing.descrizione}</p>
        <p className="text-blue-600 font-semibold text-xl mb-6">
          Prezzo: {listing.prezzo} €
        </p>

        <button
          onClick={handlePurchase}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-md transition"
        >
          Acquista
        </button>
      </div>
    </div>
  );
}
