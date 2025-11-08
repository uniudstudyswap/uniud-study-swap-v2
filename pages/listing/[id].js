import { supabase } from "../../supabaseClient";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function ListingPage({ listing }) {
  const handleBuy = async () => {
    const stripe = await stripePromise;

    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: listing.title,
        price: listing.price,
      }),
    });

    const data = await response.json();
    await stripe.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">{listing.title}</h1>
      <p className="mt-4">{listing.description}</p>
      <p className="mt-2 font-semibold">Prezzo: €{listing.price}</p>
      <button
        onClick={handleBuy}
        className="mt-4 bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
      >
        Acquista
      </button>
    </div>
  );
}

// Recupera i dati del singolo annuncio
export async function getServerSideProps({ params }) {
  const { data: listing, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) {
    return { notFound: true };
  }

  return { props: { listing } };
}
