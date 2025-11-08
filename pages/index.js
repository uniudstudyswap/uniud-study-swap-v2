import ListingCard from "../components/ListingCard";
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";

export default function Home() {
  const [annunci, setAnnunci] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      const { data } = await supabase.from("listings").select("*").order("created_at", { ascending: false });
      setAnnunci(data || []);
    };
    fetchListings();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {annunci.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
