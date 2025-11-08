import { useRouter } from "next/router";

export default function ListingCard({ listing }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/listing/${listing.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="border p-4 rounded shadow cursor-pointer hover:bg-gray-100"
    >
      <h2 className="font-bold text-lg">{listing.title}</h2>
      <p className="text-gray-600">{listing.description}</p>
      <p className="mt-2 font-semibold">€{listing.price}</p>
    </div>
  );
}
