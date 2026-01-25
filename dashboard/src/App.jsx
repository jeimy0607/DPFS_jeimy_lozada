import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [totalProductos, setTotalProductos] = useState(0);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalCategorias, setTotalCategorias] = useState(0);

  const [ultimoProducto, setUltimoProducto] = useState(null);
  const [ultimoUsuario, setUltimoUsuario] = useState(null);

  const [destacados, setDestacados] = useState([]);
  const [productosPorCategoria, setProductosPorCategoria] = useState({});

  useEffect(() => {
    fetch('http://localhost:3000/api/products')
      .then((res) => res.json())
      .then((data) => {
        const productosData = data.products || [];

        setProductos(productosData);
        setTotalProductos(productosData.length);
        setUltimoProducto(productosData[0] || null);

        setDestacados(productosData.filter((p) => p.destacado));

        const categoriasUnicas = new Set(
          productosData.filter((p) => p.categoria).map((p) => p.categoria.nombre)
        );
        setTotalCategorias(categoriasUnicas.size);

        const conteoCategorias = {};
        productosData.forEach((p) => {
          if (p.categoria?.nombre) {
            conteoCategorias[p.categoria.nombre] = (conteoCategorias[p.categoria.nombre] || 0) + 1;
          }
        });
        setProductosPorCategoria(conteoCategorias);
      })
      .catch((err) => console.error('Error productos:', err));

    fetch('http://localhost:3000/api/users')
      .then((res) => res.json())
      .then((data) => {
        const users = data.users || [];

        setUsuarios(users);
        setTotalUsuarios(data.count ?? users.length);

        const ultimo = users.length
          ? users.reduce((max, u) => (Number(u.id) > Number(max.id) ? u : max), users[0])
          : null;

        setUltimoUsuario(ultimo);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="container">
      <h1>Dashboard Cuero y Color</h1>

      {/* CARDS */}
      <div className="cards">
        <div className="card">
          <h3>Total productos</h3>
          <p>{totalProductos}</p>
        </div>

        <div className="card">
          <h3>Total usuarios</h3>
          <p>{totalUsuarios}</p>
        </div>

        <div className="card">
          <h3>Total categorías</h3>
          <p>{totalCategorias}</p>
        </div>
      </div>

      {/* CATEGORÍAS */}
      <h2 style={{ marginTop: '40px' }}>Productos por categoría</h2>

      {Object.keys(productosPorCategoria).length > 0 && (
        <div className="card">
          <ul>
            {Object.entries(productosPorCategoria).map(([cat, total]) => (
              <li key={cat}>
                <strong>{cat}:</strong> {total}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* TABLA PRODUCTOS */}
      <h2>Listado de productos</h2>

      {productos.length > 0 && (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Categoría</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td>${p.precio}</td>
                <td>{p.categoria?.nombre || 'Sin categoría'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ÚLTIMO PRODUCTO */}
      <h2>Último producto creado</h2>

      {ultimoProducto && (
        <div className="product-card">
          <h3>{ultimoProducto.nombre}</h3>

          {ultimoProducto.imagen && (
            <img
              src={`http://localhost:3000${ultimoProducto.imagen}`}
              alt={ultimoProducto.nombre}
              style={{ width: '100%', marginBottom: '10px' }}
            />
          )}

          <p>
            <strong>Precio:</strong> ${ultimoProducto.precio}
          </p>
          <p>
            <strong>Categoría:</strong> {ultimoProducto.categoria?.nombre || 'Sin categoría'}
          </p>
        </div>
      )}

      {/* ÚLTIMO USUARIO */}
      <h2>Último usuario creado</h2>

      {ultimoUsuario && (
        <div className="user-card">
          <p>
            <strong>Nombre:</strong> {ultimoUsuario.nombre} {ultimoUsuario.apellido}
          </p>
          <p>
            <strong>Email:</strong> {ultimoUsuario.email}
          </p>
          <p>
            <strong>Rol:</strong> {ultimoUsuario.rol}
          </p>
        </div>
      )}

      {/* TABLA USUARIOS */}
      <h2 style={{ marginTop: '40px' }}>Listado de usuarios</h2>

      {usuarios.length > 0 && (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>
                  {u.nombre} {u.apellido}
                </td>
                <td>{u.email}</td>
                <td>{u.rol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
