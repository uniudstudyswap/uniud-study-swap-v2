import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Home() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Controlla la sessione
  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error("Errore nel recupero sessione:", error);
      setSession(data?.session ?? null);
      setLoading(false);
    };

    getSession();

    // Ascolta i cambiamenti (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 🔹 Login con Google
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/callback`, // torna qui dopo login
      },
    });
    if (error) console.error("Errore login Google:", error.message);
  };

  // 🔹 Logout
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

  // Schermata di login
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

  // Schermata dopo il login
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-2 text-gray-800">
        Benvenuto, {session.user.email}
      </h1>
      <p className="text-gray-600 mb-6">
        Ora puoi inserire annunci, vendere o acquistare materiali.
      </p>
      <button
        onClick={handleLogout}
        className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg shadow transition"
      >
        Esci
      </button>
    </div>
  );
}

