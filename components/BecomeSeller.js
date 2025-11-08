import { useState } from "react";

export default function BecomeSeller() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successUrl, setSuccessUrl] = useState("");

  const handleCreateSeller = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/create-seller-account", {
        method: "POST"
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // reindirizza al onboarding Stripe
      } else {
        setError("Errore nella creazione dell'account Stripe.");
      }
    } catch (err) {
      console.error(err);
      setError("Errore nella richiesta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Diventa venditore</h1>
      <p className="mb-4">Clicca il pulsante per creare il tuo account Stripe e collegarlo al sito.</p>
      <button
        onClick={handleCreateSeller}
        className="bg-blue-600 text-white px-6 py-3 rounded"
        disabled={loading}
      >
        {loading ? "Caricamento..." : "Collega Stripe"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
