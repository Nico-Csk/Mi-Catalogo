"use client";
import { useState, useEffect } from "react";
import { auth, db, storage } from "../../lib/firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";

export default function Admin() {
  var [usuario, setUsuario] = useState(null);
  var [email, setEmail] = useState("");
  var [password, setPassword] = useState("");
  var [error, setError] = useState("");
  var [productos, setProductos] = useState([]);
  var [cargando, setCargando] = useState(true);
  var [guardando, setGuardando] = useState(false);
  var [editando, setEditando] = useState(null);

  var categorias = [
    "Remeras",
    "Pantalones",
    "Buzos",
    "Accesorios",
    "Zapatillas",
    "Electrónica"
  ];

  var [form, setForm] = useState({
    nombre: "",
    precio: "",
    categoria: "Remeras",
    talles: "",
    descripcion: "",
    disponible: true,
    imagen: ""
  });

  var [archivoFoto, setArchivoFoto] = useState(null);

  useEffect(function () {
    onAuthStateChanged(auth, function (user) {
      setUsuario(user);
      setCargando(false);
      if (user) {
        traerProductos();
      }
    });
  }, []);

  async function traerProductos() {
    var snapshot = await getDocs(
      collection(db, "productos")
    );
    var lista = [];
    snapshot.forEach(function (docu) {
      lista.push({ id: docu.id, ...docu.data() });
    });
    setProductos(lista);
  }

  async function iniciarSesion() {
    setError("");
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
    } catch (err) {
      setError("Email o contraseña incorrectos");
    }
  }

  async function cerrarSesion() {
    await signOut(auth);
    setUsuario(null);
  }

  function limpiarForm() {
    setForm({
      nombre: "",
      precio: "",
      categoria: "Remeras",
      talles: "",
      descripcion: "",
      disponible: true,
      imagen: ""
    });
    setArchivoFoto(null);
    setEditando(null);
  }

  async function subirFoto() {
    if (!archivoFoto) return form.imagen;
    var nombre =
      Date.now() + "_" + archivoFoto.name;
    var storageRef = ref(storage, "productos/" + nombre);
    await uploadBytes(storageRef, archivoFoto);
    var url = await getDownloadURL(storageRef);
    return url;
  }

  async function guardarProducto() {
    if (!form.nombre || !form.precio) {
      setError("Nombre y precio son obligatorios");
      return;
    }
    setGuardando(true);
    setError("");
    try {
      var urlFoto = await subirFoto();
      var datos = {
        nombre: form.nombre,
        precio: Number(form.precio),
        categoria: form.categoria,
        talles: form.categoria === "Electrónica" ? "" : form.talles,
        descripcion: form.descripcion,
        disponible: form.disponible,
        imagen: urlFoto || ""
      };
      if (editando) {
        await updateDoc(
          doc(db, "productos", editando),
          datos
        );
      } else {
        await addDoc(collection(db, "productos"), datos);
      }
      limpiarForm();
      await traerProductos();
    } catch (err) {
      setError("Error al guardar: " + err.message);
    }
    setGuardando(false);
  }

  async function eliminarProducto(id) {
    if (window.confirm("Seguro que queres eliminar?")) {
      await deleteDoc(doc(db, "productos", id));
      await traerProductos();
    }
  }

  function editarProducto(prod) {
    setEditando(prod.id);
    setForm({
      nombre: prod.nombre || "",
      precio: String(prod.precio || ""),
      categoria: prod.categoria || "Remeras",
      talles: prod.talles || "",
      descripcion: prod.descripcion || "",
      disponible: prod.disponible !== false,
      imagen: prod.imagen || ""
    });
    window.scrollTo(0, 0);
  }

  function cambiarCampo(campo, valor) {
    var nuevoForm = { ...form };
    nuevoForm[campo] = valor;
    setForm(nuevoForm);
  }

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md w-80">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Admin
          </h1>
          {error && (
            <p className="text-red-500 text-sm mb-4">
              {error}
            </p>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={function (e) {
              setEmail(e.target.value);
            }}
            className="w-full border rounded-lg px-4 py-2 mb-3"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={function (e) {
              setPassword(e.target.value);
            }}
            className="w-full border rounded-lg px-4 py-2 mb-4"
          />
          <button
            onClick={iniciarSesion}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
          >
            Iniciar sesion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          Panel de Admin
        </h1>
        <div className="flex gap-4 items-center">
          <a href="/" className="text-sm underline">
            Ver tienda
          </a>
          <button
            onClick={cerrarSesion}
            className="text-sm bg-red-500 px-3 py-1 rounded"
          >
            Salir
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <h2 className="text-lg font-bold mb-4">
          {editando ? "Editar producto" : "Nuevo producto"}
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error}
          </p>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <input
            type="text"
            placeholder="Nombre del producto"
            value={form.nombre}
            onChange={function (e) {
              cambiarCampo("nombre", e.target.value);
            }}
            className="w-full border rounded-lg px-4 py-2 mb-3"
          />

          <input
            type="number"
            placeholder="Precio"
            value={form.precio}
            onChange={function (e) {
              cambiarCampo("precio", e.target.value);
            }}
            className="w-full border rounded-lg px-4 py-2 mb-3"
          />

          <select
            value={form.categoria}
            onChange={function (e) {
              cambiarCampo("categoria", e.target.value);
            }}
            className="w-full border rounded-lg px-4 py-2 mb-3"
          >
            {categorias.map(function (cat) {
              return (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              );
            })}
          </select>

          {form.categoria !== "Electrónica" && (
            <input
              type="text"
              placeholder={
                form.categoria === "Zapatillas"
                  ? "Talles (ej: 38, 39, 40, 41, 42)"
                  : "Talles (ej: S, M, L, XL)"
              }
              value={form.talles}
              onChange={function (e) {
                cambiarCampo("talles", e.target.value);
              }}
              className="w-full border rounded-lg px-4 py-2 mb-3"
            />
          )}

          <textarea
            placeholder="Descripcion del producto"
            value={form.descripcion}
            onChange={function (e) {
              cambiarCampo("descripcion", e.target.value);
            }}
            className="w-full border rounded-lg px-4 py-2 mb-3"
            rows={3}
          />

          <div className="mb-3">
            <label className="text-sm font-medium">
              Foto del producto:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={function (e) {
                setArchivoFoto(e.target.files[0]);
              }}
              className="w-full mt-1"
            />
          </div>

          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.disponible}
              onChange={function (e) {
                cambiarCampo(
                  "disponible",
                  e.target.checked
                );
              }}
            />
            <label className="text-sm">Disponible</label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={guardarProducto}
              disabled={guardando}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
            >
              {guardando
                ? "Guardando..."
                : editando
                ? "Actualizar"
                : "Agregar producto"}
            </button>
            {editando && (
              <button
                onClick={limpiarForm}
                className="bg-gray-300 px-6 py-2 rounded-lg"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>

        <h2 className="text-lg font-bold mb-4">
          {"Productos (" + productos.length + ")"}
        </h2>

        {productos.map(function (prod) {
          return (
            <div
              key={prod.id}
              className="bg-white p-4 rounded-lg shadow-md mb-3 flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                {prod.imagen && (
                  <img
                    src={prod.imagen}
                    alt={prod.nombre}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <h3 className="font-medium">
                    {prod.nombre}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {prod.categoria +
                      " - $" +
                      (prod.precio || 0).toLocaleString()}
                  </p>
                  {!prod.disponible && (
                    <span className="text-red-500 text-xs">
                      AGOTADO
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={function () {
                    editarProducto(prod);
                  }}
                  className="text-sm bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={function () {
                    eliminarProducto(prod.id);
                  }}
                  className="text-sm bg-red-500 text-white px-3 py-1 rounded"
                >
                  Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}