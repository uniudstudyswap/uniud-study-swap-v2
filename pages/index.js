import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../supabaseClient";
import ListingForm from "../components/ListingForm";

export default function Home() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);

  // Recupera la sessione e gli annunci
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data?.session ?? null);
      setLoading(false);
    };

    const fetchListings = async () => {
      const { data, error } = await supabase.from("listings").select("*").order("created_at", { ascending: false });
      if (error) console.error("Errore fetch listings:", error);
      else setListings(data);
    };

    getSession();
    fetchListings();

    // Listener per login/logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
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

  if (loading) return <p className="text-center mt-10">Caricamento...</p>;

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h1 className="text-3xl font-bold mb-4">UniUD StudySwap</h1>
        <p className="text-gray-600 mb-6">
          Accedi per vendere o acquistare appunti e libri.
        </p>
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
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Marketplace</h1>
        <button
          onClick={handleLogout}
          className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg"
        >
          Esci
        </button>
      </div>

      <ListingForm />

      <h2 className="text-xl font-semibold mt-8 mb-4">Annunci disponibili</h2>
      {listings.length === 0 && <p>Nessun annuncio disponibile.</p>}

      <ul>
        {listings.map((listing) => (
          <li key={listing.id} className="border p-4 mb-4 rounded hover:shadow-lg transition">
            <Link href={`/listing/${listing.id}`}>
              <a className="block">
                <h3 className="text-lg font-bold">{listing.title}</h3>
                <p className="text-gray-600">{listing.description}</p>
                <p className="font-semibold mt-1">€{listing.price}</p>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
