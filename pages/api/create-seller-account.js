import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { listing } = req.body; // riceviamo l'annuncio completo dal frontend

      if (!listing) {
        return res.status(400).json({ error: "Listing non fornito" });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: listing.title,
                description: listing.description,
              },
              unit_amount: Math.round(listing.price * 100), // in centesimi
            },
            quantity: 1,
          },
        ],
        success_url: `${req.headers.origin}/checkout-success?session_id={CHECKOUT_SESSION_ID}&listing_id=${listing.id}&user_email=${listing.user_email}`,
        cancel_url: `${req.headers.origin}/listing/${listing.id}`,
      });

      res.status(200).json({ url: session.url });
    } catch (err) {
      console.error("Errore nella creazione della sessione:", err);
      res.status(500).json({ error: "Errore nella creazione della sessione di pagamento" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Metodo non consentito");
  }
}
