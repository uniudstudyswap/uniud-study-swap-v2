import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function ListingPage() {
  const router = useRouter();
  const { id } = router.query;
  const [listing, setListing] = useState(null);

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
    };

    fetchListing();
  }, [id]);

  const handleBuy = async () => {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId: id }),
    });

    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else alert("Errore nella creazione della sessione di pagamento");
  };

  if (!listing) return <p>Caricamento annuncio...</p>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{listing.title}</h1>
      <p className="mb-4">{listing.description}</p>
      <p className="mb-4 font-semibold">Prezzo: €{listing.price}</p>
      <button
        onClick={handleBuy}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Acquista
      </button>
    </div>
  );
}
