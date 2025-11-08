import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ListingForm from "../components/ListingForm";
import Link from "next/link";

export default function Home() {
  const [session, setSession] = useState(null);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    // Recupera sessione corrente
    const currentSession = supabase.auth.session();
    setSession(currentSession);

    // Ascolta i cambi di autenticazione
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    fetchListings();

    return () => {
      listener?.unsubscribe();
    };
  }, []);

  async function fetchListings() {
    const { data, error } = await supabase.from("annunci").select("*").order("id", { ascending: false });
    if (error) console.error(error);
    else setListings(data);
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/callback`,
      },
    });
  }

  async function signOut() {
    await supabase.auth.signOut();
    setSession(null);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow p-4 flex justify-between">
        <h1 className="text-2xl font-bold text-blue-600">UniUd Study Swap</h1>
        <div>
          {session ? (
            <button onClick={signOut} className="bg-red-500 text-white px-4 py-2 rounded">
              Esci
            </button>
          ) : (
            <button onClick={signInWithGoogle} className="bg-blue-500 text-white px-4 py-2 rounded">
              Accedi con Google
            </button>
          )}
        </div>
      </nav>

      <main className="p-6 max-w-3xl mx-auto">
        {session ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Crea un nuovo annuncio</h2>
              <Link href="/become-vendor" className="bg-green-500 text-white px-4 py-2 rounded">
                Diventa venditore
              </Link>
            </div>
            <ListingForm onCreated={fetchListings} />
          </>
        ) : (
          <p className="text-center text-gray-600 mt-10">
            Effettua l’accesso per creare e gestire i tuoi annunci.
          </p>
        )}

        <h2 className="text-xl font-semibold mt-8 mb-4">Annunci disponibili</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              href={`/product/${listing.id}`}
              className="block bg-white shadow rounded p-4 hover:shadow-md transition"
            >
              <h3 className="font-bold text-lg mb-2">{listing.titolo}</h3>
              <p className="text-gray-700 mb-1">{listing.descrizione}</p>
              <p className="text-blue-600 font-semibold">{listing.prezzo} €</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
