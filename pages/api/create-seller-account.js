import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { userId } = req.body;

  try {
    // Crea un account Stripe collegato (Express account)
    const account = await stripe.accounts.create({
      type: "express",
      country: "IT",
      email: req.body.email, // opzionale, meglio email dell'utente
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    // Crea il link di onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?onboarding=success`,
      type: "account_onboarding",
    });

    // Salva account.id nel database dell'utente
    // TODO: aggiorna la tabella users con stripe_account_id

    res.status(200).json({ url: accountLink.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Impossibile creare account Stripe" });
  }
}
