import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { listing } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: listing.title, description: listing.description },
            unit_amount: listing.price * 100, // prezzo in centesimi
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/listing/${listing.id}`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Errore Stripe:", error);
    res.status(500).json({ error: error.message });
  }
}
