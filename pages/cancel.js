export default function Cancel() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-50">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        Pagamento annullato
      </h1>
      <p className="text-gray-700">
        Il pagamento non è stato completato. Puoi riprovare o tornare al Marketplace.
      </p>
      <a
        href="/"
        className="mt-6 bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700"
      >
        Torna al Marketplace
      </a>
    </div>
  );
}
