window.addEventListener("load", () => {
  const form = document.querySelector(".form-login");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    const errores = [];
    const email = form.email.value.trim();
    const password = form.password.value;

    if (!email || !email.includes("@")) errores.push("Debes ingresar un correo válido.");
    if (!password) errores.push("La contraseña es obligatoria.");

    if (errores.length) {
      e.preventDefault();
      alert(errores.join("\n"));
    }
  });
});
