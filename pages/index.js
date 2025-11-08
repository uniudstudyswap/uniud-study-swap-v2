import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ListingForm from "./components/listingform";

export default function Home() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);

  // Recupera sessione e annunci al caricamento
  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error("Errore nel recupero sessione:", error);
      setSession(data?.session ?? null);
      setLoading(false);
    };

    const getListings = async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) console.error("Errore nel recupero annunci:", error);
      else setListings(data);
    };

    getSession();
    getListings();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
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
        <h1 className="text-2xl font-bold text-gray-800">Marketplace</h1>
        <button
          onClick={handleLogout}
          className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg shadow transition"
        >
          Esci
        </button>
      </div>

      {/* Form per inserire nuovi annunci */}
      <div className="mb-6">
        <ListingForm refreshListings={async () => {
          const { data, error } = await supabase.from("listings").select("*").order("created_at", { ascending: false });
          if (!error) setListings(data);
        }} />
      </div>

      {/* Visualizzazione degli annunci */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map((listing) => (
          <div key={listing.id} className="border p-4 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="font-bold text-lg mb-2">{listing.title}</h2>
            <p className="text-gray-700 mb-2">{listing.description}</p>
            <p className="text-gray-800 font-semibold mb-2">{listing.price} €</p>
            {/* Qui potrai inserire il pulsante di acquisto */}
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
              onClick={() => alert("Funzionalità pagamento da implementare")}
            >
              Acquista
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
