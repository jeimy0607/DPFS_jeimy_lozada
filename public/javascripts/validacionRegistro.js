window.addEventListener("load", () => {
  const form = document.querySelector(".form-registro");

  form.addEventListener("submit", (e) => {
    let errores = [];

    const nombre = form.name.value.trim();
    const apellido = form.lastname.value.trim();
    const dni = form.dni.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const password2 = form.password2.value;
    const foto = form.foto.value;

    
    if (nombre.length < 2) {
      errores.push("El nombre debe tener al menos 2 caracteres");
    }

    if (apellido.length < 2) {
      errores.push("El apellido debe tener al menos 2 caracteres");
    }


    if (!/^\d+$/.test(dni)) {
  errores.push("La cédula debe contener solo números");
}

if (dni.length < 6 || dni.length > 12) {
  errores.push("La cédula debe tener entre 6 y 12 dígitos");
}
   
    if (!email.includes("@")) {
      errores.push("Debes ingresar un email válido");
    }

   
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passRegex.test(password)) {
      errores.push("La contraseña debe tener mínimo 8 caracteres, letras y números");
    }

    if (password !== password2) {
      errores.push("Las contraseñas no coinciden");
    }

    
    if (foto) {
      const ext = foto.split(".").pop().toLowerCase();
      if (!["jpg", "jpeg", "png", "gif"].includes(ext)) {
        errores.push("La foto debe ser JPG, PNG o GIF");
      }
    }

    if (errores.length > 0) {
      e.preventDefault();
      alert(errores.join("\n"));
    }
  });
});

