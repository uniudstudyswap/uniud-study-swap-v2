import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function ListingDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [listing, setListing] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchListing = async () => {
      const { data, error } = await supabase.from("listings").select("*").eq("id", id).single();
      if (!error) setListing(data);
    };
    fetchListing();
  }, [id]);

  const handlePurchase = async () => {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listing }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  if (!listing) return <p className="text-center mt-10">Caricamento annuncio...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <div className="max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
        <p className="text-gray-700 mb-4">{listing.description}</p>
        <p className="text-xl font-semibold text-blue-600 mb-6">{listing.price} €</p>
        <button
          onClick={handlePurchase}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg"
        >
          Acquista
        </button>
      </div>
    </div>
  );
}
