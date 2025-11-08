import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function CheckoutSuccess() {
  const router = useRouter();
  const { listing_id, buyer_email, seller_email } = router.query;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (router.isReady) {
      setLoading(false);
      // Qui puoi aggiungere eventuale chiamata al backend per aggiornare lo stato della vendita
      // ad esempio: fetch("/api/mark-sold", { method: "POST", body: JSON.stringify({ listing_id }) })
    }
  }, [router.isReady]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Caricamento...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Pagamento completato!</h1>
      <p className="text-gray-700 mb-2">
        Grazie per il tuo acquisto.
      </p>
      <p className="text-gray-700 mb-2">
        Listing ID: <span className="font-mono">{listing_id}</span>
      </p>
      <p className="text-gray-700 mb-2">
        Email acquirente: <span className="font-mono">{buyer_email}</span>
      </p>
      <p className="text-gray-700 mb-4">
        Email venditore: <span className="font-mono">{seller_email}</span>
      </p>

      <button
        onClick={() => router.push("/")}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
      >
        Torna al Marketplace
      </button>
    </div>
  );
}
