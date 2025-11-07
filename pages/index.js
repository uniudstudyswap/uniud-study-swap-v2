import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Home() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  if (!session) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>UniUD StudySwap</h1>
        <p>Accedi con Google per continuare</p>
        <button
          onClick={signInWithGoogle}
          style={{
            background: "#4285F4",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Accedi con Google
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Benvenuto su UniUD StudySwap!</h1>
      <p>Marketplace per libri e appunti — Commissione 5%</p>
      <button
        onClick={signOut}
        style={{
          background: "#d9534f",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "16px",
          marginTop: "20px",
        }}
      >
        Esci
      </button>
    </div>
  );
}
