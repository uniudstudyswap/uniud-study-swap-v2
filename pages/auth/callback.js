import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../supabaseClient";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Errore nel recupero sessione:", error.message);
        return;
      }

      if (data?.session) {
        router.push("/"); // reindirizza alla homepage
      } else {
        router.push("/?error=auth");
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-xl font-bold mb-4 text-gray-700">
        Autenticazione in corso...
      </h1>
      <p className="text-gray-500">Attendi qualche secondo.</p>
    </div>
  );
}
