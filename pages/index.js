import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function Marketplace() {
  const [listings, setListings] = useState([]);

  // Carica gli annunci dal database
  useEffect(() => {
    const fetchListings = async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error("Errore nel caricamento degli annunci:", error);
      else setListings(data);
    };

    fetchListings();
  }, []);

  // Crea la sessione di pagamento Stripe
  const handlePurchase = async (listing) => {
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: listing.title,
          price: listing.price,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // reindirizza a Stripe Checkout
      } else {
        console.error("Errore nella creazione della sessione Stripe:", data);
        alert("Errore nel pagamento, riprova più tardi.");
      }
    } catch (err) {
      console.error("Errore durante il pagamento:", err);
      alert("Errore di connessione con Stripe.");
    }
  };

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        maxWidth: "800px",
        margin: "40px auto",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1>📚 UniUD StudySwap Marketplace</h1>
      <p>Compra o vendi libri e appunti in modo sicuro. (Commissione 5%)</p>

      {listings.length === 0 ? (
        <p>Nessun annuncio presente.</p>
      ) : (
        <div style={{ marginTop: "30px" }}>
          {listings.map((listing) => (
            <div
              key={listing.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "15px",
                marginBottom: "20px",
                textAlign: "left",
              }}
            >
              <h3>{listing.title}</h3>
              <p>{listing.description}</p>
              <p>
                <strong>Categoria:</strong> {listing.category}
              </p>
              <p>
                <strong>Prezzo:</strong> €{listing.price.toFixed(2)}
              </p>

              <button
                onClick={() => handlePurchase(listing)}
                style={{
                  backgroundColor: "#635bff",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                💳 Acquista ora
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
