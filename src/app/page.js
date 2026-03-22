"use client";
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Home() {
  var whatsapp = "5491138943530";
  var [productos, setProductos] = useState([]);
  var [busqueda, setBusqueda] = useState("");
  var [categoriaActiva, setCategoriaActiva] = useState("Todos");
  var [cargando, setCargando] = useState(true);
  var [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(function () {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  var categorias = [
    "Todos",
    "Electrónica",
    "Zapatillas",
    "Perfumes",
    "Ropa de Bebé",
    "Camperas"
  ];

  useEffect(function () {
    async function traerProductos() {
      try {
        var snapshot = await getDocs(collection(db, "productos"));
        var lista = [];
        snapshot.forEach(function (docu) {
          lista.push({ id: docu.id, ...docu.data() });
        });
        setProductos(lista);
      } catch (error) {
        console.log("Error al traer productos:", error);
      }
      setCargando(false);
    }
    traerProductos();
  }, []);

  var productosFiltrados = productos.filter(function (p) {
    var coincideBusqueda = (p.nombre || "")
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    var coincideCategoria =
      categoriaActiva === "Todos" ||
      p.categoria === categoriaActiva;
    var estaDisponible = p.disponible !== false;
    return coincideBusqueda && coincideCategoria && estaDisponible;
  });

  var fuente1 = "Cormorant Garamond, serif";
  var fuente2 = "Montserrat, sans-serif";

  function Tarjeta({ producto }) {
    var mensaje = encodeURIComponent(
      "Hola! Me interesa: " + producto.nombre
    );
    var url =
      "https://wa.me/" + whatsapp + "?text=" + mensaje;
    return (
      <div className="group cursor-pointer">
        <div
          className="relative overflow-hidden bg-stone-100 mb-4"
          style={{ aspectRatio: "3/4" }}
        >
          {producto.imagen ? (
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-stone-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-0 left-0 right-0 bg-emerald-700 text-white py-3 text-center text-sm uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-full group-hover:translate-y-0"
            style={{ letterSpacing: "0.1em" }}
          >
            Consultar por WhatsApp
          </a>
        </div>
        <div className="space-y-1">
          <p
            className="text-xs text-stone-400 uppercase"
            style={{ letterSpacing: "0.15em", fontFamily: fuente2, fontWeight: 300 }}
          >
            {producto.categoria}
          </p>
          <h3
            className="text-sm text-stone-800 font-light"
            style={{ fontFamily: fuente2 }}
          >
            {producto.nombre}
          </h3>
          {producto.descripcion && (
            <p
              className="text-xs text-stone-400 font-light leading-relaxed"
              style={{ fontFamily: fuente2 }}
            >
              {producto.descripcion}
            </p>
          )}
          {producto.talles && (
            <p
              className="text-xs text-stone-400 font-light"
              style={{ fontFamily: fuente2 }}
            >
              {"Talles: " + producto.talles}
            </p>
          )}
          <p
            className="text-sm text-stone-800"
            style={{ letterSpacing: "0.05em", fontFamily: fuente2, fontWeight: 400 }}
          >
            {"$ " + (producto.precio || 0).toLocaleString("es-AR")}
          </p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block text-center border border-emerald-700 text-emerald-700 py-2.5 text-xs uppercase hover:bg-emerald-700 hover:text-white transition-all duration-300 md:hidden"
          style={{ letterSpacing: "0.15em", fontFamily: fuente2 }}
        >
          Consultar por WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <style
        dangerouslySetInnerHTML={{
          __html:
            "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Montserrat:wght@200;300;400;500&display=swap');"
        }}
      />

      {/* HEADER */}
      <header className="border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <a href="/" className="flex flex-col items-start">
            <h1
              className="text-2xl md:text-3xl text-stone-800"
              style={{ fontFamily: fuente1, fontWeight: 400, letterSpacing: "0.15em" }}
            >
              ImCus
            </h1>
            <span
              className="text-stone-400 uppercase mt-0.5"
              style={{ fontFamily: fuente2, fontWeight: 300, fontSize: "10px", letterSpacing: "0.3em" }}
            >
              Tu tienda online
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {categorias.map(function (cat) {
              var esActiva = cat === categoriaActiva;
              return (
                <button
                  key={cat}
                  onClick={function () {
                    setCategoriaActiva(cat);
                  }}
                  className="relative py-1 text-xs uppercase transition-colors duration-300"
                  style={{
                    fontFamily: fuente2,
                    fontWeight: esActiva ? 500 : 300,
                    color: esActiva ? "#292524" : "#a8a29e",
                    letterSpacing: "0.15em"
                  }}
                >
                  {cat}
                  {esActiva && (
                    <span className="absolute bottom-0 left-0 right-0 h-px bg-stone-800" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-stone-600"
            onClick={function () {
              setMenuAbierto(!menuAbierto);
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuAbierto ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuAbierto && (
          <div className="md:hidden border-t border-stone-100 px-6 py-4 bg-white">
            {categorias.map(function (cat) {
              var esActiva = cat === categoriaActiva;
              return (
                <button
                  key={cat}
                  onClick={function () {
                    setCategoriaActiva(cat);
                    setMenuAbierto(false);
                  }}
                  className="block w-full text-left py-2 text-sm uppercase transition-colors"
                  style={{
                    fontFamily: fuente2,
                    fontWeight: esActiva ? 500 : 300,
                    color: esActiva ? "#292524" : "#a8a29e",
                    letterSpacing: "0.1em"
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 text-center">
          <h2
            className="text-3xl md:text-5xl text-stone-800 mb-4 leading-tight"
            style={{ fontFamily: fuente1, fontWeight: 300 }}
          >
            Lo que buscás, al mejor precio
          </h2>
          <p
            className="text-sm text-stone-400 max-w-md mx-auto"
            style={{ fontFamily: fuente2, fontWeight: 300, letterSpacing: "0.1em" }}
          >
            Explorá nuestro catálogo y encontrá lo que necesitás
          </p>
        </div>
      </section>

      {/* SEARCH BAR */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="relative max-w-md mx-auto">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={function (e) {
              setBusqueda(e.target.value);
            }}
            className="w-full border-b border-stone-200 bg-transparent pl-10 pr-4 py-3 text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:border-stone-400 transition-colors"
            style={{ fontFamily: fuente2, fontWeight: 300 }}
          />
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        {categoriaActiva !== "Todos" && (
          <div className="mb-8 flex items-center justify-between">
            <h3
              className="text-xl text-stone-700"
              style={{ fontFamily: fuente1, fontWeight: 400 }}
            >
              {categoriaActiva}
            </h3>
            <span
              className="text-xs text-stone-400"
              style={{ fontFamily: fuente2, fontWeight: 300 }}
            >
              {productosFiltrados.length + (productosFiltrados.length === 1 ? " producto" : " productos")}
            </span>
          </div>
        )}

        {cargando && (
          <div className="text-center py-20">
            <div
              className="inline-block w-6 h-6 border border-stone-300 rounded-full spinner"
              style={{ borderTopColor: "#57534e" }}
            />
            <p
              className="mt-4 text-sm text-stone-400"
              style={{ fontFamily: fuente2, fontWeight: 300 }}
            >
              Cargando productos...
            </p>
          </div>
        )}

        {!cargando && productosFiltrados.length === 0 && (
          <div className="text-center py-20">
            <p
              className="text-sm text-stone-400"
              style={{ fontFamily: fuente2, fontWeight: 300 }}
            >
              No se encontraron productos
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {productosFiltrados.map(function (prod) {
            return <Tarjeta key={prod.id} producto={prod} />;
          })}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-stone-200 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p
                className="text-lg text-stone-700"
                style={{ fontFamily: fuente1, fontWeight: 400, letterSpacing: "0.15em" }}
              >
                ImCus
              </p>
              <p
                className="text-xs text-stone-400 mt-1"
                style={{ fontFamily: fuente2, fontWeight: 300, letterSpacing: "0.1em" }}
              >
                Tu tienda online
              </p>
            </div>
            <a
              href={"https://wa.me/" + whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs uppercase text-emerald-700 hover:text-emerald-800 transition-colors"
              style={{ fontFamily: fuente2, fontWeight: 400, letterSpacing: "0.1em" }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Contactanos
            </a>
          </div>
          <div className="mt-8 pt-6 border-t border-stone-200 text-center">
            <p
              className="text-stone-300"
              style={{ fontFamily: fuente2, fontWeight: 300, fontSize: "11px", letterSpacing: "0.05em" }}
            >
              &copy; 2026 ImCus &mdash; Todos los derechos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}