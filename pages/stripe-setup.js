import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function StripeSetup() {
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async () => {
    setLoading(true);
    const user = supabase.auth.user();
    if (!user) {
      alert("Devi essere loggato per creare un account venditore");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/create-stripe-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else alert("Errore nella creazione dell'account Stripe");
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Collega il tuo account Stripe</h1>
      <p className="text-gray-600 mb-6">
        Per ricevere pagamenti direttamente sul tuo conto, devi creare un account Stripe.
      </p>
      <button
        onClick={handleCreateAccount}
        className="bg-green-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Caricamento..." : "Crea account Stripe"}
      </button>
    </div>
  );
}
