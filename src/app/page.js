export default function Home() {
  var whatsapp = "5491112345678";

  function Tarjeta({ num }) {
    var mensaje = encodeURIComponent("Hola! Me interesa el Producto " + num);
    var url = "https://wa.me/" + whatsapp + "?text=" + mensaje;
    return (
      <div className="border rounded-lg overflow-hidden hover:shadow-lg">
        <div className="bg-gray-200 h-48 flex items-center justify-center">
          <span className="text-gray-400">Foto del producto</span>
        </div>
        <div className="p-3">
          <h3 className="font-medium">{"Producto " + num}</h3>
          <p className="text-gray-500 text-xs mt-1">Talle: S / M / L</p>
          <p className="text-lg font-bold mt-2">$12.990</p>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <button className="mt-3 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">
              Consultar por WhatsApp
            </button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-black text-white py-6 px-4 text-center">
        <h1 className="text-3xl font-bold">MI TIENDA</h1>
        <p className="text-sm mt-1 text-gray-300">Ropa y Accesorios</p>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <input
          type="text"
          placeholder="Buscar productos..."
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-4 flex gap-3">
        {["Todos", "Remeras", "Pantalones", "Buzos", "Accesorios"].map(
          function (cat) {
            return (
              <button key={cat} className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-black hover:text-white">
                {cat}
              </button>
            );
          }
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Tarjeta num={1} />
        <Tarjeta num={2} />
        <Tarjeta num={3} />
        <Tarjeta num={4} />
        <Tarjeta num={5} />
        <Tarjeta num={6} />
      </div>

      <footer className="bg-gray-100 text-center py-6 text-sm text-gray-500 mt-8">
        Mi Tienda 2026 - Todos los derechos reservados
      </footer>
    </div>
  );
}