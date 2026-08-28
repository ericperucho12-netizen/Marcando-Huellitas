/* ============================================================
   MARCANDO HUELLITAS — script.js
   Script compartido entre nuevo-producto.html y perfil-adopcion.html
   Detecta automáticamente el formulario presente en la página
   y aplica: validación en tiempo real, preview de imagen y toast.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  // El id del <form> difiere entre las dos páginas.
  const form =
    document.getElementById("producto-form") ||
    document.getElementById("adopcion-form");

  if (!form) return;

  const isProducto = form.id === "producto-form";

  // Campos obligatorios por página (según spec de cada formulario)
  const requiredFieldNames = isProducto
    ? ["nombre", "precio", "id"]
    : ["nombre", "id"];

  const toast = document.getElementById("toast");
  const imageInput = form.querySelector('input[type="file"]');
  const imagePreview = document.getElementById("imagen-preview");

  /* ---------- Utilidades de validación ---------- */

  function getFieldWrapper(name) {
    return form.querySelector(`[data-field] input[name="${name}"], [data-field] textarea[name="${name}"]`)
      ?.closest(".form-field");
  }

  function setFieldError(wrapper, message) {
    if (!wrapper) return;
    wrapper.classList.add("is-invalid");
    const errorEl = wrapper.querySelector(".field-error");
    if (errorEl) errorEl.textContent = message;
  }

  function clearFieldError(wrapper) {
    if (!wrapper) return;
    wrapper.classList.remove("is-invalid");
    const errorEl = wrapper.querySelector(".field-error");
    if (errorEl) errorEl.textContent = "";
  }

  function validateField(name) {
    const input = form.querySelector(`[name="${name}"]`);
    const wrapper = getFieldWrapper(name);
    if (!input || !wrapper) return true;

    const value = input.value.trim();

    if (!value) {
      setFieldError(wrapper, "Este campo es obligatorio.");
      return false;
    }

    if (input.type === "number" && Number(value) < 0) {
      setFieldError(wrapper, "El valor no puede ser negativo.");
      return false;
    }

    clearFieldError(wrapper);
    return true;
  }

  function validateForm() {
    let isValid = true;
    requiredFieldNames.forEach((name) => {
      const fieldIsValid = validateField(name);
      if (!fieldIsValid) isValid = false;
    });
    return isValid;
  }

  /* ---------- Validación en tiempo real ---------- */
  requiredFieldNames.forEach((name) => {
    const input = form.querySelector(`[name="${name}"]`);
    if (!input) return;
    input.addEventListener("input", () => validateField(name));
    input.addEventListener("blur", () => validateField(name));
  });

  /* ---------- Preview dinámico de imagen ---------- */
  if (imageInput && imagePreview) {
    imageInput.addEventListener("change", (event) => {
      const file = event.target.files && event.target.files[0];

      if (!file) {
        imagePreview.style.backgroundImage = "";
        imagePreview.innerHTML = "Sin imagen";
        return;
      }

      if (!file.type.startsWith("image/")) {
        imagePreview.innerHTML = "Archivo no válido";
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.innerHTML = "";
        const img = document.createElement("img");
        img.src = e.target.result;
        img.alt = "Vista previa de la imagen seleccionada";
        imagePreview.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  }

  /* ---------- Toast / notificación decorativa ---------- */
  let toastTimeout;

  function showToast({ title, message, isError = false } = {}) {
    if (!toast) return;

    if (title) toast.querySelector(".toast__title").textContent = title;
    if (message) toast.querySelector(".toast__message").textContent = message;
    toast.querySelector(".toast__icon").textContent = isError ? "⚠️" : "✅";
    toast.classList.toggle("toast--error", isError);

    toast.classList.add("toast--visible");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("toast--visible");
    }, 3200);
  }

  /* ---------- Envío del formulario ---------- */
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      showToast({
        title: "Faltan datos",
        message: "Por favor completa los campos obligatorios marcados en rojo.",
        isError: true,
      });

      // Enfoca el primer campo inválido para guiar al usuario
      const firstInvalid = form.querySelector(".is-invalid input, .is-invalid textarea");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    showToast(
      isProducto
        ? {
            title: "¡Producto guardado!",
            message: "El producto se registró con éxito en el catálogo.",
          }
        : {
            title: "¡Perfil guardado!",
            message: "El perfil de adopción se guardó con éxito.",
          }
    );

    // Emite un evento personalizado para que otros scripts (ej. productos.js) puedan escuchar y procesar los datos
    const formData = new FormData(form);
    const dataObj = Object.fromEntries(formData.entries());

    // Si hay una imagen previsualizada (convertida a base64 por FileReader), la agregamos al objeto
    if (imagePreview) {
      const imgEl = imagePreview.querySelector("img");
      if (imgEl) {
        dataObj.imagenBase64 = imgEl.src;
      }
    }

    form.dispatchEvent(new CustomEvent("formularioValido", {
      detail: dataObj
    }));
  });

  /* ---------- Botón Cancelar ---------- */
  const cancelarBtn = document.getElementById("cancelar-btn");
  if (cancelarBtn) {
    cancelarBtn.addEventListener("click", () => {
      requiredFieldNames.forEach((name) => clearFieldError(getFieldWrapper(name)));
      if (imagePreview) {
        imagePreview.style.backgroundImage = "";
        imagePreview.innerHTML = "Sin imagen";
      }
    });
  }
});

/* ============================================================
   VALIDACIONES FORMULARIO MASCOTAS (TODOS OBLIGATORIOS)
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("adopcion-form");
    if (!form) return;

    // Lista con todos los campos obligatorios para el registro de mascotas
    const requiredFields = [
        "nombre", 
        "imagen", 
        "descripcion", 
        "edad", 
        "vacunado", 
        "salud", 
        "esterilizacion", 
        "temperamento", 
        "id", 
        "refugio"
    ];

    /* ---------- Funciones de Validación ---------- */

    function getFieldWrapper(name) {
        return form.querySelector(`[name="${name}"]`)?.closest(".form-field");
    }

    function setFieldError(wrapper, message) {
        if (!wrapper) return;
        wrapper.classList.add("is-invalid");
        
        // Busca el span de error o créalo dinámicamente si falta en el HTML
        let errorEl = wrapper.querySelector(".field-error");
        if (!errorEl) {
            errorEl = document.createElement("span");
            errorEl.className = "field-error";
            wrapper.appendChild(errorEl);
        }
        errorEl.textContent = message;
    }

    function clearFieldError(wrapper) {
        if (!wrapper) return;
        wrapper.classList.remove("is-invalid");
        const errorEl = wrapper.querySelector(".field-error");
        if (errorEl) errorEl.textContent = "";
    }

    function validateField(name) {
        const input = form.querySelector(`[name="${name}"]`);
        const wrapper = getFieldWrapper(name);
        if (!input || !wrapper) return true;

        // Validación específica para input de tipo archivo (imagen)
        if (input.type === "file") {
            if (input.files.length === 0) {
                setFieldError(wrapper, "Este campo es obligatorio.");
                return false;
            }
        } else {
            // Validación para texto, textarea y selects
            if (!input.value.trim()) {
                setFieldError(wrapper, "Este campo es obligatorio.");
                return false;
            }
        }

        clearFieldError(wrapper);
        return true;
    }

    /* ---------- Eventos en tiempo real ---------- */
    requiredFields.forEach((name) => {
        const input = form.querySelector(`[name="${name}"]`);
        if (!input) return;

        input.addEventListener("input", () => validateField(name));
        input.addEventListener("blur", () => validateField(name));
        if (input.tagName === "SELECT" || input.type === "file") {
            input.addEventListener("change", () => validateField(name));
        }
    });

    /* ---------- Envío del formulario ---------- */
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        // Validar todos los campos antes de enviar
        const isValid = requiredFields.every(name => validateField(name));

        if (!isValid) {
            console.warn("Formulario incompleto");
            
            // Enfocar automáticamente el primer campo que tenga error
            const firstInvalid = form.querySelector(".form-field.is-invalid input, .form-field.is-invalid select, .form-field.is-invalid textarea");
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        // Si es válido, preparar objeto de datos
        const formData = new FormData(form);
        const dataObj = Object.fromEntries(formData.entries());
        
        // Incluir la imagen si existe una previsualización
        const imgEl = document.querySelector("#imagen-preview img");
        if (imgEl) dataObj.imagenBase64 = imgEl.src;

        // Disparar evento para adminForms.js
        form.dispatchEvent(new CustomEvent("formularioValido", {
            detail: dataObj,
            bubbles: true
        }));
    });
});
