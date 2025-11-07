import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  try {
    const { title, price } = req.body;

    // Controllo campi
    if (!title || !price) {
      return res.status(400).json({ error: "Dati mancanti per il pagamento" });
    }

    // Calcola prezzo in centesimi (Stripe richiede integer)
    const amount = Math.round(price * 100);

    // Calcolo commissione (5%)
    const commission = Math.round(amount * 0.05);

    // Crea la sessione di checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: title,
              description: "Acquisto tramite UniUD StudySwap",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: commission,
        transfer_data: {
          // Qui puoi aggiungere l'account del venditore se vuoi pagare direttamente i singoli utenti
          // destination: "acct_XXXXXXXXXXXX"
        },
      },
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cancel`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Errore nella creazione della sessione Stripe:", err);
    return res
      .status(500)
      .json({ error: "Errore interno nella creazione del pagamento" });
  }
}
