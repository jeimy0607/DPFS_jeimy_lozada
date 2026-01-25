

import { useEffect, useState } from "react";

function Home() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/users")
      .then(res => res.json())
      .then(result => {
        console.log("API USERS:", result);
        setUsers(result.data); 
      });
  }, []);

  console.log("HOME SE ESTA RENDERIZANDO");

  return (
    <div>
      <h1>Dashboard</h1>

      <h2>Usuarios encontrados:</h2>
      <p>{users.length}</p>

      {users.map(user => (
        <p key={user.id}>
          {user.nombre} - {user.email}
        </p>
      ))}
    </div>
  );
}

export default Home;
