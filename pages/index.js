// pages/index.js
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient"; // Assicurati che supabaseClient.js sia nella root
import ListingForm from "../components/ListingForm";
import ListingDetail from "../components/ListingDetail";

export default function Home() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error("Errore nel recupero sessione:", error);
      setSession(data?.session ?? null);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    fetchListings();

    return () => subscription.unsubscribe();
  }, []);

  const fetchListings = async () => {
    const { data, error } = await supabase.from("listings").select("*").order("created_at", { ascending: false });
    if (error) console.error("Errore fetch listings:", error);
    else setListings(data);
  };

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

  if (loading) return <div className="flex items-center justify-center h-screen">Caricamento...</div>;

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">UniUD StudySwap</h1>
        <p className="text-gray-600 mb-6">Accedi per vendere o acquistare appunti e libri.</p>
        <button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg">
          Accedi con Google
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Benvenuto, {session.user.email}</h1>
        <button onClick={handleLogout} className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg">Esci</button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Inserisci un annuncio</h2>
        <ListingForm session={session} onNewListing={fetchListings} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Annunci disponibili</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map(listing => (
            <ListingDetail key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </div>
  );
}

