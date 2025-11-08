import Stripe from "stripe";
import { supabase } from "../../supabaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  try {
    const { productId, titolo, prezzo, venditore_id } = req.body;

    if (!productId || !titolo || !prezzo || !venditore_id) {
      return res.status(400).json({ error: "Dati del prodotto mancanti" });
    }

    // 🔍 Recupera i dati del venditore da Supabase
    const { data: venditore, error } = await supabase
      .from("utenti")
      .select("stripe_account_id, email")
      .eq("id", venditore_id)
      .single();

    if (error || !venditore) {
      console.error("Errore nel recupero del venditore:", error);
      return res.status(400).json({ error: "Venditore non trovato" });
    }

    // Calcola il 5% di commissione
    const prezzoCentesimi = Math.round(prezzo * 100);
    const commissione = Math.round(prezzoCentesimi * 0.05);
    const prezzoVenditore = prezzoCentesimi - commissione;

    // 🔐 Crea la sessione di pagamento Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: titolo,
            },
            unit_amount: prezzoCentesimi,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: commissione, // la tua commissione (5%)
        transfer_data: {
          destination: venditore.stripe_account_id, // il conto Stripe del venditore
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Errore creazione sessione pagamento:", err);
    res.status(500).json({ error: err.message });
  }
}
