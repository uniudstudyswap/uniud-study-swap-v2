import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ListingForm from "../components/ListingForm";

export default function Home() {
  const [session, setSession] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error("Errore nel recupero sessione:", error);
      setSession(data?.session ?? null);
      setLoading(false);
    };
    getSession();

    const fetchListings = async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) console.error("Errore nel recupero annunci:", error);
      else setListings(data);
    };
    fetchListings();
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
    return <div className="flex items-center justify-center h-screen">Caricamento...</div>;
  }

  return (
    <div className="p-6">
      {!session ? (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
          <h1 className="text-3xl font-bold mb-4">UniUD StudySwap</h1>
          <p className="mb-6">Accedi per vendere o acquistare appunti e libri.</p>
          <button onClick={handleLogin} className="bg-blue-600 text-white px-6 py-3 rounded-lg">
            Accedi con Google
          </button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Benvenuto, {session.user.email}</h1>
            <button onClick={handleLogout} className="bg-gray-800 text-white px-4 py-2 rounded-lg">
              Esci
            </button>
          </div>

          <ListingForm onListingAdded={(newListing) => setListings([newListing, ...listings])} />

          <h2 className="text-xl font-bold mt-8 mb-4">Annunci disponibili</h2>
          {listings.length === 0 ? (
            <p>Nessun annuncio disponibile.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((listing) => (
                <div key={listing.id} className="border p-4 rounded-lg shadow">
                  <h3 className="font-semibold text-lg">{listing.title}</h3>
                  <p>{listing.description}</p>
                  <p>Categoria: {listing.category}</p>
                  <p>Prezzo: €{listing.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
