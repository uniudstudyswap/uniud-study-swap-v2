export default function Success() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50">
      <h1 className="text-3xl font-bold text-green-700 mb-4">Pagamento completato!</h1>
      <p className="text-gray-700">
        Grazie per il tuo acquisto. Il venditore riceverà i fondi e la commissione del 5% è stata trattenuta automaticamente.
      </p>
    </div>
  );
}
