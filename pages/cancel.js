import Link from "next/link";

export default function Cancel() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-50">
      <h1 className="text-3xl font-bold text-red-700 mb-4">
        Pagamento annullato ❌
      </h1>
      <p className="text-gray-700 text-center mb-6">
        Il pagamento non è stato completato. Puoi riprovare in qualsiasi momento.
      </p>
      <Link
        href="/"
        className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg shadow transition"
      >
        Torna alla home
      </Link>
    </div>
  );
}
