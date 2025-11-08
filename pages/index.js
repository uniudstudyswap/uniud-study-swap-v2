import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ListingForm from "../components/ListingForm";
import ListingDetail from "../components/ListingDetail";

export default function Home() {
  const [session, setSession] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListingId, setSelectedListingId] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data?.session ?? null);
      setLoading(false);
    };
    getSession();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    fetchListings();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchListings = async () => {
    const { data, error } = await supabase.from("listings").select("*");
    if (error) console.error(error);
    else setListings(data);
  };

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleListingCreated = (newListing) => {
    setListings([newListing, ...listings]);
  };

  if (loading) return <p>Caricamento...</p>;

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h1 className="text-3xl font-bold mb-4">UniUD StudySwap</h1>
        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Accedi con Google
        </button>
      </div>
    );
  }

  if (selectedListingId) {
    return <ListingDetail listingId={selectedListingId} />;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Marketplace</h2>
        <button
          onClick={handleLogout}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          Esci
        </button>
      </div>

      <ListingForm userId={session.user.id} onListingCreated={handleListingCreated} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="p-4 border rounded hover:shadow cursor-pointer"
            onClick={() => setSelectedListingId(listing.id)}
          >
            <h3 className="font-semibold">{listing.title}</h3>
            <p>{listing.description}</p>
            <p className="font-bold">€{listing.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
