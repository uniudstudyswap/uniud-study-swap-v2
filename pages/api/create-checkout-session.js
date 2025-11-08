import Stripe from "stripe";
import { supabase } from "../../supabaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { listingId } = req.body;

  try {
    // Prendi i dati dell'annuncio e del venditore
    const { data: listing, error } = await supabase
      .from("listings")
      .select(`price, title, user_id`)
      .eq("id", listingId)
      .single();

    if (error) throw error;

    const { data: seller, error: sellerError } = await supabase
      .from("users")
      .select("stripe_account_id")
      .eq("id", listing.user_id)
      .single();

    if (sellerError) throw sellerError;

    // Creazione della sessione Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: listing.title },
            unit_amount: Math.round(listing.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      payment_intent_data: {
        application_fee_amount: Math.round(listing.price * 100 * 0.05), // 5% commissione
        transfer_data: {
          destination: seller.stripe_account_id,
        },
      },
      success_url: `${req.headers.origin}/success?listing=${listingId}`,
      cancel_url: `${req.headers.origin}/listing/${listingId}`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore nella creazione della sessione di pagamento" });
  }
}
