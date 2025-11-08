import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ListingForm from "../components/ListingForm";
import ListingDetail from "../components/ListingDetail";
import { useRouter } from "next/router";

export default function Home() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error(error);
      setSession(data?.session ?? null);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin }
    });
    if (error) console.error(error.message);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error.message);
  };

  const handleBecomeSeller = () => {
    router.push("/become-seller");
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Caricamento...</div>;
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold mb-4">UniUD StudySwap</h1>
        <button onClick={handleLogin} className="bg-blue-600 text-white px-6 py-3 rounded">Accedi con Google</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-xl font-bold mb-4">Benvenuto, {session.user.email}</h2>
      
      {/* Pulsante Diventa Venditore */}
      <button
        onClick={handleBecomeSeller}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        Diventa venditore
      </button>

      {/* Inserimento annunci */}
      <ListingForm session={session} />

      {/* Visualizzazione annunci */}
      <ListingDetail />
      
      <button onClick={handleLogout} className="bg-gray-800 text-white px-4 py-2 rounded mt-4">
        Esci
      </button>
    </div>
  );
}
