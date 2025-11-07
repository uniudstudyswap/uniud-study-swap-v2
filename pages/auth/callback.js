import { useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useRouter } from "next/router";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        // Se la sessione è valida, reindirizza alla home
        if (data.session) {
          router.push("/");
        } else {
          console.warn("Nessuna sessione trovata, ritorno alla home.");
          router.push("/");
        }
      } catch (err) {
        console.error("Errore callback:", err.message);
        router.push("/");
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <p className="text-gray-600 text-lg">Accesso in corso...</p>
    </div>
  );
}
