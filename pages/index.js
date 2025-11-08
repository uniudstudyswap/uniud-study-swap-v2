// pages/index.js
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ListingForm from "../components/listingform";

export default function Home() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);

  // Carica sessione e annunci
  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error(error);
      setSession(data?.session ?? null);
      setLoading(false);
    };

    const fetchListings = async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) console.error(error);
      else setListings(data);
    };

    fetchSession();
    fetchListings();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription?.unsubscribe();
  }, []);

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

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Caricamento...</div>;
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h1 className="text-3xl font-bold mb-4">UniUD StudySwap</h1>
        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md"
        >
          Accedi con Google
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Benvenuto, {session.user.email}</h1>
        <button
          onClick={handleLogout}
          className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg"
        >
          Esci
        </button>
      </div>

      <ListingForm onNewListing={(newListing) => setListings([newListing, ...listings])} />

      <h2 className="text-xl font-bold mt-8 mb-4">Annunci</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listings.map((listing) => (
          <div key={listing.id} className="border rounded p-4 bg-white shadow">
            <h3 className="font-bold text-lg">{listing.title}</h3>
            <p className="text-gray-700">{listing.description}</p>
            <p className="text-gray-500 mt-2">Categoria: {listing.category}</p>
            <p className="text-gray-900 font-semibold mt-2">Prezzo: €{listing.price}</p>
            <button className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
              Acquista
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
