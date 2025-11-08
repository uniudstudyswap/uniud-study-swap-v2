import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ListingForm from "../components/ListingForm";

export default function Home() {
  const [session, setSession] = useState(null);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data?.session ?? null);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) fetchListings();
  }, [session]);

  async function fetchListings() {
    const { data, error } = await supabase.from("listings").select("*").order("created_at", { ascending: false });
    if (error) console.error(error);
    else setListings(data);
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">UniUD StudySwap</h1>
        <p className="text-gray-600 mb-6">Accedi per vendere o acquistare appunti e libri.</p>
        <button
          onClick={() => supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin + "/auth/callback" } })}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
        >
          Accedi con Google
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Benvenuto, {session.user.email}</h1>
      <ListingForm onListingAdded={fetchListings} />

      <h2 className="text-xl font-semibold mt-8 mb-4">Annunci disponibili</h2>
      <div className="grid gap-4">
        {listings.map((item) => (
          <div key={item.id} className="border p-4 rounded shadow hover:shadow-lg transition">
            <h3 className="text-lg font-bold">{item.title}</h3>
            <p>{item.description}</p>
            <p className="text-gray-700">💰 {item.price} €</p>
            <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Acquista
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
