import Link from "next/link";

export default function Success() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50">
      <h1 className="text-3xl font-bold text-green-700 mb-4">
        Pagamento completato con successo ✅
      </h1>
      <p className="text-gray-700 text-center mb-6">
        Grazie per il tuo acquisto! Riceverai una conferma via email dal venditore.
      </p>
      <Link
        href="/"
        className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg shadow transition"
      >
        Torna alla home
      </Link>
    </div>
  );
}
