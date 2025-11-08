import Stripe from "stripe";
import { supabase } from "../../supabaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { listingId } = req.body;

  // Recupera i dati dell'annuncio
  const { data: listing, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", listingId)
    .single();

  if (error || !listing) {
    return res.status(404).json({ error: "Annuncio non trovato" });
  }

  // Recupera il vendorId (lo user_id del venditore)
  const vendorStripeAccount = listing.stripe_account_id; // supponendo che tu salvi l'ID Stripe del venditore nella colonna listings.stripe_account_id

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
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
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/listing/${listing.id}`,
      payment_intent_data: {
        application_fee_amount: Math.round(listing.price * 0.05 * 100), // 5% commissione tua
        transfer_data: {
          destination: vendorStripeAccount, // soldi vanno al venditore
        },
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore nella creazione della sessione" });
  }
}
