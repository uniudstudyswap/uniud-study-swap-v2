import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ListingForm from "../components/listingform";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Home() {
  const [session, setSession] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data?.session ?? null);
      setLoading(false);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    fetchListings();

    return () => listener.subscription.unsubscribe();
  }, []);

  const fetchListings = async () => {
    const { data, error } = await supabase.from("listings").select("*").order("created_at", { ascending: false });
    if (error) console.error(error);
    else setListings(data);
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) console.error(error.message);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error.message);
  };

  const handleBuy = async (listing) => {
    const stripe = await stripePromise;

    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listing }),
    });
    const session = await response.json();

    const result = await stripe.redirectToCheckout({ sessionId: session.id });
    if (result.error) console.error(result.error.message);
  };

  if (loading) return <p className="text-center mt-10">Caricamento...</p>;

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold mb-4">UniUD StudySwap</h1>
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Accedi con Google
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Marketplace</h1>
        <button onClick={handleLogout} className="bg-gray-800 text-white px-4 py-2 rounded">
          Esci
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Inserisci un nuovo annuncio</h2>
        <ListingForm />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Annunci disponibili</h2>
        {listings.map((listing) => (
          <div key={listing.id} className="border p-4 mb-4 rounded">
            <h3 className="text-lg font-bold">{listing.title}</h3>
            <p>{listing.description}</p>
            <p className="font-semibold">Categoria: {listing.category}</p>
            <p className="font-semibold">Prezzo: €{listing.price}</p>
            <button
              onClick={() => handleBuy(listing)}
              className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Acquista
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
