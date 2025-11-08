import Stripe from "stripe";
import { supabase } from "../../supabaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId } = req.body;

    try {
      // Crea account Stripe Express per il venditore
      const account = await stripe.accounts.create({
        type: "express",
        country: "IT",
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });

      // Salva l'account_id nel DB
      const { error } = await supabase
        .from("users")
        .update({ stripe_account_id: account.id })
        .eq("id", userId);

      if (error) return res.status(400).json({ error: error.message });

      // Crea link per il dashboard Express del venditore
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${req.headers.origin}/stripe-setup?refresh=true`,
        return_url: `${req.headers.origin}/stripe-setup?success=true`,
        type: "account_onboarding",
      });

      res.status(200).json({ url: accountLink.url });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Errore nella creazione dell’account Stripe" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
