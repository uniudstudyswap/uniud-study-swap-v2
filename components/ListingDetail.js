// components/ListingDetail.js
import Link from "next/link";

export default function ListingDetail({ listing }) {
  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition cursor-pointer">
      <h3 className="font-bold text-lg">{listing.title}</h3>
      <p className="text-gray-600">{listing.description}</p>
      <p className="font-semibold mt-2">Prezzo: €{listing.price}</p>
      <p className="text-sm text-gray-500">Categoria: {listing.category}</p>
      <Link href={`/listing/${listing.id}`}>
        <button className="mt-2 w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700">
          Visualizza
        </button>
      </Link>
    </div>
  );
}
