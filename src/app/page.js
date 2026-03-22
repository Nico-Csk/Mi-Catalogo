"use client";
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Home() {
  var whatsapp = "5491112345678";
  var [productos, setProductos] = useState([]);
  var [busqueda, setBusqueda] = useState("");
  var [categoriaActiva, setCategoriaActiva] = useState("Todos");
  var [cargando, setCargando] = useState(true);

  var categorias = [
    "Todos",
    "Remeras",
    "Pantalones",
    "Buzos",
    "Accesorios",
    "Zapatillas",
    "Electrónica"
  ];

  useEffect(function () {
    async function traerProductos() {
      try {
        var snapshot = await getDocs(collection(db, "productos"));
        var lista = [];
        snapshot.forEach(function (doc) {
          lista.push({ id: doc.id, ...doc.data() });
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

  function Tarjeta({ producto }) {
    var mensaje = encodeURIComponent(
      "Hola! Me interesa: " + producto.nombre
    );
    var url =
      "https://wa.me/" + whatsapp + "?text=" + mensaje;
    return (
      <div className="border rounded-lg overflow-hidden hover:shadow-lg">
        <div className="bg-gray-200 h-48 flex items-center justify-center overflow-hidden">
          {producto.imagen ? (
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400">
              Sin foto
            </span>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-medium">{producto.nombre}</h3>
          {producto.descripcion && (
            <p className="text-gray-500 text-xs mt-1">
              {producto.descripcion}
            </p>
          )}
          {producto.talles && (
            <p className="text-gray-500 text-xs mt-1">
              {"Talles: " + producto.talles}
            </p>
          )}
          <p className="text-lg font-bold mt-2">
            {"$" + (producto.precio || 0).toLocaleString()}
          </p>
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
        <p className="text-sm mt-1 text-gray-300">
          Ropa, Zapatillas y Electrónica
        </p>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={function (e) {
            setBusqueda(e.target.value);
          }}
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-4 flex gap-3 overflow-x-auto">
        {categorias.map(function (cat) {
          var esActiva = cat === categoriaActiva;
          var estilo = esActiva
            ? "px-4 py-2 rounded-full text-sm bg-black text-white whitespace-nowrap"
            : "px-4 py-2 rounded-full text-sm bg-gray-100 hover:bg-black hover:text-white whitespace-nowrap";
          return (
            <button
              key={cat}
              className={estilo}
              onClick={function () {
                setCategoriaActiva(cat);
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cargando && (
          <p className="col-span-full text-center text-gray-400">
            Cargando productos...
          </p>
        )}
        {!cargando &&
          productosFiltrados.length === 0 && (
            <p className="col-span-full text-center text-gray-400">
              No se encontraron productos
            </p>
          )}
        {productosFiltrados.map(function (prod) {
          return (
            <Tarjeta key={prod.id} producto={prod} />
          );
        })}
      </div>

      <footer className="bg-gray-100 text-center py-6 text-sm text-gray-500 mt-8">
        Mi Tienda 2026 - Todos los derechos reservados
      </footer>
    </div>
  );
}