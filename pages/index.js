import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ListingForm from "../components/ListingForm";
import BecomeSeller from "../components/BecomeSeller";

export default function Home() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data?.session ?? null);
      setLoading(false);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) console.error(error);
      else setListings(data);
    };
    fetchListings();
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

  if (loading) return <p>Caricamento...</p>;

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1>UniUD StudySwap</h1>
        <button onClick={handleLogin}>Accedi con Google</button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1>Benvenuto, {session.user.email}</h1>
      <button onClick={handleLogout}>Esci</button>

      <h2 className="mt-4">Diventa venditore</h2>
      <BecomeSeller userEmail={session.user.email} />

      <h2 className="mt-4">Inserisci nuovo annuncio</h2>
      <ListingForm userId={session.user.id} />

      <h2 className="mt-4">Marketplace</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map((listing) => (
          <div key={listing.id} className="border p-2 rounded">
            <h3>{listing.title}</h3>
            <p>{listing.description}</p>
            <p>€ {listing.price}</p>
            <a href={`/listing/${listing.id}`}>
              <button className="bg-blue-600 text-white px-2 py-1 rounded">
                Visualizza & Acquista
              </button>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
