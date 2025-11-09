import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ListingDetail from "../components/ListingDetail";

export default function Home() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [showListingDetail, setShowListingDetail] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  // Controllo sessione all'avvio
  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error("Errore nel recupero sessione:", error);
      setSession(data?.session ?? null);
      setLoading(false);
    };

    getSession();

    // Ascolta cambiamenti di sessione
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Recupero degli annunci dal database
  useEffect(() => {
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
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) console.error("Errore login Google:", error.message);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Errore logout:", error.message);
  };

  const handleListingClick = (listing) => {
    setSelectedListing(listing);
    setShowListingDetail(true);
  };

  const handleCloseDetail = () => {
    setShowListingDetail(false);
    setSelectedListing(null);
  };

  const handleBecomeSeller = async () => {
    if (!session) {
      alert("Devi essere loggato per diventare venditore!");
      return;
    }

    try {
      // Qui chiami la tua API per creare/collegare account Stripe
      const response = await fetch("/api/create-seller-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id }),
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url; // Redirige a Stripe
    } catch (error) {
      console.error("Errore nel diventare venditore:", error);
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

  if (showListingDetail && selectedListing) {
    return (
      <ListingDetail
        listing={selectedListing}
        onClose={handleCloseDetail}
        session={session}
      />
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Benvenuto, {session.user.email}</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleBecomeSeller}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition"
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

      <h2 className="text-xl font-semibold mb-4 text-gray-700">Marketplace</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {listings.length === 0 && <p className="text-gray-500">Nessun annuncio presente.</p>}
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="border rounded-lg p-4 shadow hover:shadow-lg cursor-pointer transition"
            onClick={() => handleListingClick(listing)}
          >
            <h3 className="font-bold text-gray-800">{listing.title}</h3>
            <p className="text-gray-600">{listing.description}</p>
            <p className="text-gray-800 font-semibold mt-2">{listing.price} €</p>
          </div>
        ))}
      </div>
    </div>
  );
}

 