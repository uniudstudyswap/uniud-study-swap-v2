import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ListingForm from "../components/ListingForm";

export default function Home() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);

  // Carica sessione e annunci
  useEffect(() => {
    const getSessionAndListings = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      setSession(sessionData?.session ?? null);
      setLoading(false);

      // Carica gli annunci
      const { data: listingsData, error } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) console.error("Errore caricamento annunci:", error);
      else setListings(listingsData);
    };

    getSessionAndListings();

    // Listener cambiamento sessione
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) console.error("Errore login Google:", error.message);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Errore logout:", error.message);
  };

  const handleBecomeSeller = async () => {
    try {
      const res = await fetch("/api/create-seller-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, email: session.user.email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else console.error("Errore creazione account venditore:", data);
    } catch (err) {
      console.error("Errore become seller:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-500">Caricamento...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">UniUD StudySwap</h1>
        <p className="text-gray-600 mb-6">Accedi per vendere o acquistare appunti e libri.</p>
        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
        >
          Accedi con Google
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Benvenuto, {session.user.email}</h1>
        <div className="flex gap-4">
          <button
            onClick={handleBecomeSeller}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow transition"
          >
            Diventa venditore
          </button>
          <button
            onClick={handleLogout}
            className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg shadow transition"
          >
            Esci
          </button>
        </div>
      </div>

      {/* Form per inserire un nuovo annuncio */}
      <ListingForm session={session} />

      {/* Lista annunci */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div key={listing.id} className="border p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
            <h2 className="text-xl font-semibold">{listing.title}</h2>
            <p className="text-gray-600">{listing.description}</p>
            <p className="text-gray-800 font-bold mt-2">{listing.price} €</p>
            <button
              onClick={() => window.location.href = `/listing/${listing.id}`}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow transition"
            >
              Acquista
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
