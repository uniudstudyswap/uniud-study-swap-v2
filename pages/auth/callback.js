import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../supabaseClient";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Errore nel recupero sessione:", error);
          router.replace("/");
          return;
        }

        if (data?.session) {
          // Se autenticato → torna alla home
          router.replace("/");
        } else {
          // Se non autenticato → torna comunque alla home
          router.replace("/");
        }
      } catch (err) {
        console.error("Errore nel processo di login:", err);
        router.replace("/");
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <p className="text-gray-600 text-lg">Reindirizzamento in corso...</p>
    </div>
  );
}
