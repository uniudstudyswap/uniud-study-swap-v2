export default function Success() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50">
      <h1 className="text-3xl font-bold text-green-700 mb-4">
        Pagamento completato!
      </h1>
      <p className="text-gray-700">
        Grazie per il tuo acquisto. Puoi tornare al Marketplace per continuare.
      </p>
      <a
        href="/"
        className="mt-6 bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
      >
        Torna al Marketplace
      </a>
    </div>
  );
}
