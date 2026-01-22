window.addEventListener("load", () => {
  const form = document.querySelector(".form-producto");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    const errores = [];

    const nombre = form.nombre.value.trim();
    const descripcion = form.descripcion.value.trim();

    if (nombre.length < 5) errores.push("El nombre debe tener mínimo 5 caracteres.");
    if (descripcion.length < 20) errores.push("La descripción debe tener mínimo 20 caracteres.");

    // validar imágenes solo si seleccionan archivos
    const inputImgs = form.querySelector('input[name="imagenes"]');
    if (inputImgs && inputImgs.files && inputImgs.files.length > 0) {
      const permitidas = ["image/jpeg", "image/png", "image/webp"];
      for (const file of inputImgs.files) {
        if (!permitidas.includes(file.type)) {
          errores.push("Las imágenes deben ser JPG, PNG o WEBP.");
          break;
        }
      }
    }

    if (errores.length) {
      e.preventDefault();
      alert(errores.join("\n"));
    }
  });
});
