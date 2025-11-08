import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ListingForm from "../components/listingform";

export default function Home() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [fetching, setFetching] = useState(false);

  // Recupera sessione utente
  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error("Errore sessione:", error);
      setSession(data?.session ?? null);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Recupera gli annunci una sola volta
  useEffect(() => {
    const fetchListings = async () => {
      setFetching(true);
      const { data, error } = await supabase.from("listings").select("*").order("created_at", { ascending: false });
      if (error) console.error("Errore fetch listings:", error);
      else setListings(data ?? []);
      setFetching(false);
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
    return <p>Caricamento...</p>;
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h1>UniUD StudySwap</h1>
        <button onClick={handleLogin}>Accedi con Google</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2>Benvenuto, {session.user.email}</h2>
      <button onClick={handleLogout}>Esci</button>

      <h3 className="mt-6 text-xl font-bold">Inserisci un nuovo annuncio</h3>
      <ListingForm />

      <h3 className="mt-6 text-xl font-bold">Annunci disponibili</h3>
      {fetching ? (
        <p>Caricamento annunci...</p>
      ) : listings.length === 0 ? (
        <p>Nessun annuncio disponibile.</p>
      ) : (
        <ul>
          {listings.map((item) => (
            <li key={item.id} className="border p-2 my-2 rounded">
              <strong>{item.title}</strong> - {item.category} - €{item.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
