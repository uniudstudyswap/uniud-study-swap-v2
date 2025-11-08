import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ListingForm from "../components/listingform"; // assicurati che il percorso sia corretto

export default function Home() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userListings, setUserListings] = useState([]);

  // Controlla sessione al caricamento
  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) console.error("Errore nel recupero sessione:", error);
      setSession(session ?? null);
      setLoading(false);
    };

    getSession();

    // Ascolta cambiamenti di sessione (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Recupera tutti gli annunci dal database
  useEffect(() => {
    const fetchListings = async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) console.error("Errore caricamento annunci:", error);
      else setUserListings(data);
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
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-500">Caricamento...</p>
      </div>
    );
  }

  if (!session) {
    // Schermata login
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

  // Schermata loggata
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 p-4">
      <div className="flex justify-between w-full max-w-4xl mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Benvenuto, {session.user.email}</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleLogout}
            className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg shadow transition"
          >
            Esci
          </button>
        </div>
      </div>

      {/* Form per diventare venditore */}
      <div className="mb-6 w-full max-w-4xl">
        <ListingForm user={session.user} />
      </div>

      {/* Lista annunci */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4 w-full max-w-4xl">Marketplace</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
        {userListings.map((listing) => (
          <div
            key={listing.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-pointer transition"
            onClick={() => window.location.href = `/listing/${listing.id}`}
          >
            <h3 className="font-bold text-gray-800">{listing.title}</h3>
            <p className="text-gray-600">{listing.category}</p>
            <p className="text-gray-900 font-semibold">{listing.price} €</p>
          </div>
        ))}
      </div>
    </div>
  );
}
