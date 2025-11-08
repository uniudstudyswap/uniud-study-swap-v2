import Stripe from "stripe";
import { supabase } from "../../supabaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { userId, email } = req.body;

  try {
    const account = await stripe.accounts.create({
      type: "express",
      country: "IT",
      email,
      capabilities: { card_payments: { requested: true }, transfers: { requested: true } },
    });

    const { error } = await supabase
      .from("users")
      .update({ stripe_account_id: account.id })
      .eq("id", userId);

    if (error) throw error;

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${req.headers.origin}/account`,
      return_url: `${req.headers.origin}/account`,
      type: "account_onboarding",
    });

    res.status(200).json({ url: accountLink.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore nella creazione account venditore" });
  }
}
