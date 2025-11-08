import { useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function BecomeVendor() {
  useEffect(() => {
    const createStripeAccountLink = async () => {
      const user = supabase.auth.user();

      if (!user) return alert("Devi essere loggato per diventare venditore");

      try {
        const res = await fetch("/api/create-stripe-account", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });

        const data = await res.json();
        if (data.url) {
          window.location.href = data.url; // reindirizza a Stripe
        } else {
          alert("Errore nella creazione dell'account Stripe");
        }
      } catch (err) {
        console.error(err);
      }
    };

    createStripeAccountLink();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p>Creazione account venditore in corso...</p>
    </div>
  );
}
