import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../supabaseClient";

export default function ListingDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

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

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId: listing.id,
          title: listing.title,
          price: listing.price,
        }),
      });

      const data = await response.json();
      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      } else {
        console.error("Errore nella creazione sessione Stripe:", data);
      }
    } catch (error) {
      console.error("Errore nel redirect a Stripe:", error);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) return <p>Caricamento annuncio...</p>;
  if (!listing) return <p>Annuncio non trovato.</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
      <p className="mb-2">{listing.description}</p>
      <p className="mb-2">Categoria: {listing.category}</p>
      <p className="mb-4 font-semibold">Prezzo: €{listing.price}</p>

      <button
        onClick={handleCheckout}
        className={`bg-green-600 text-white px-4 py-2 rounded shadow ${
          checkoutLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
        }`}
        disabled={checkoutLoading}
      >
        {checkoutLoading ? "Reindirizzamento..." : "Acquista"}
      </button>
    </div>
  );
}
