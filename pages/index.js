import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Link from "next/link";
import ListingForm from "../components/ListingForm";

export default function Home() {
  const [session, setSession] = useState(null);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      const { data, error } = await supabase.from("listings").select("*").order("id", { ascending: false });
      if (!error) setListings(data);
    };
    fetchListings();
  }, []);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h1 className="text-3xl font-bold mb-4">UniUD StudySwap</h1>
        <button
          onClick={() =>
            supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } })
          }
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Accedi con Google
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Benvenuto, {session.user.email}</h1>

      <ListingForm />

      <h2 className="text-2xl font-semibold mt-8 mb-4">Annunci disponibili</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <Link key={listing.id} href={`/listing/${listing.id}`} passHref>
            <div className="border rounded-lg p-4 bg-white shadow hover:shadow-lg transition cursor-pointer">
              <h3 className="text-lg font-bold mb-2">{listing.title}</h3>
              <p className="text-gray-600 mb-2">{listing.description}</p>
              <p className="text-blue-600 font-semibold">{listing.price} €</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
