import { useState } from "react";

export default function BecomeSeller({ userEmail }) {
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    const res = await fetch("/api/create-stripe-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else console.error(data.error);
    setLoading(false);
  };

  return (
    <button onClick={handleRegister} disabled={loading} className="bg-green-600 text-white px-2 py-1 rounded">
      {loading ? "Caricamento..." : "Diventa venditore"}
    </button>
  );
}
