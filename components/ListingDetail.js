import { useRouter } from "next/router";

export default function ListingDetail({ listings }) {
  const router = useRouter();

  const handleViewListing = (id) => {
    router.push(`/listing/${id}`); // Reindirizza alla pagina dell'annuncio
  };

  if (!listings || listings.length === 0) {
    return <p className="text-gray-500">Nessun annuncio disponibile.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {listings.map((listing) => (
        <div key={listing.id} className="border p-4 rounded shadow hover:shadow-lg transition">
          <h3 className="font-bold text-lg">{listing?.title ?? "Titolo non disponibile"}</h3>
          <p className="text-gray-600">{listing?.description ?? "Descrizione non disponibile"}</p>
          <p className="text-green-600 font-semibold">{listing?.price ?? 0} €</p>
          <button
            onClick={() => handleViewListing(listing?.id)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-2"
          >
            Acquista
          </button>
        </div>
      ))}
    </div>
  );
}

