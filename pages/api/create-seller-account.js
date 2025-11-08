import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  try {
    const account = await stripe.accounts.create({
      type: "express",
      country: "IT",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true }
      }
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_SITE_URL}/become-seller`,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
      type: "account_onboarding"
    });

    res.status(200).json({ url: accountLink.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore nella creazione dell'account Stripe" });
  }
}
