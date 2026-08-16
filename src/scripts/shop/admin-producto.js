document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("producto-form");
    const imageInput = document.getElementById("imagen-producto");
    const imagePreview = document.getElementById("imagen-preview");
    const pageTitle = document.getElementById("pageTitle");
    const formTitle = document.getElementById("formTitle");

    // Revisar si estamos en modo edición por la URL
    const params = new URLSearchParams(window.location.search);
    const editId = params.get("id");

    let base64Image = null;
    let productos = JSON.parse(localStorage.getItem("productosAdmin")) || [];

    if (editId) {
        // MODO EDICIÓN
        const producto = productos.find(p => String(p.id) === String(editId));
        if (producto) {
            pageTitle.textContent = "Editar Producto";
            formTitle.textContent = "Modificar información del producto";
            
            document.getElementById("id-producto").value = producto.id;
            // Deshabilitar el ID para que no se cambie si es edición
            document.getElementById("id-producto").setAttribute("readonly", true);

            document.getElementById("nombre-producto").value = producto.nombre || "";
            document.getElementById("descripcion-producto").value = producto.descripcion || "";
            document.getElementById("precio").value = producto.precio || "";
            document.getElementById("categoria").value = producto.categoria || "";
            document.getElementById("producto-oferta").value = producto.oferta || "no";
            document.getElementById("precio-oferta").value = producto.precio_oferta || "";
            document.getElementById("cantidad-inventario").value = producto.cantidad || "";
            document.getElementById("especie").value = producto.especie || "todos";

            if (producto.imagen && producto.imagen !== "https://via.placeholder.com/150") {
                base64Image = producto.imagen;
                imagePreview.innerHTML = `<img src="${producto.imagen}" alt="Vista previa" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 8px;">`;
            }
        }
    }

    // Lógica para habilitar/deshabilitar precio de oferta
    const selectOferta = document.getElementById("producto-oferta");
    const inputPrecioOferta = document.getElementById("precio-oferta");
    if (selectOferta && inputPrecioOferta) {
        const toggleOferta = () => {
            if (selectOferta.value === "si") {
                inputPrecioOferta.disabled = false;
                inputPrecioOferta.setAttribute("required", "true");
            } else {
                inputPrecioOferta.disabled = true;
                inputPrecioOferta.value = "";
                inputPrecioOferta.removeAttribute("required");
            }
        };
        // Inicializar estado
        toggleOferta();
        // Escuchar cambios
        selectOferta.addEventListener("change", toggleOferta);
    }

    // Previsualizar imagen seleccionada
    if (imageInput) {
        imageInput.addEventListener("change", function (event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    base64Image = e.target.result;
                    if (imagePreview) {
                        imagePreview.innerHTML = `<img src="${base64Image}" alt="Vista previa" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 8px;">`;
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Guardar Producto
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            if (!form.checkValidity()) {
                e.stopPropagation();
                form.classList.add("was-validated");
                // Muestra un alert nativo sencillo si faltan campos obligatorios
                alert("Por favor, llena los campos obligatorios marcados en rojo.");
                return;
            }

            const formData = new FormData(form);
            let idFormulario = formData.get("id");
            if (!idFormulario || idFormulario.trim() === "") {
                idFormulario = "PRD-" + Date.now().toString().slice(-6);
            }

            const nuevoProducto = {
                id: idFormulario,
                nombre: formData.get("nombre"),
                imagen: base64Image || "https://via.placeholder.com/150",
                descripcion: formData.get("descripcion"),
                precio: Number(formData.get("precio")),
                categoria: formData.get("categoria"),
                oferta: formData.get("oferta"),
                precio_oferta: formData.get("precio_oferta") ? Number(formData.get("precio_oferta")) : null,
                cantidad: formData.get("cantidad"),
                especie: formData.get("especie") ? formData.get("especie").toLowerCase() : "todos",
                createdAt: new Date().toISOString().split("T")[0]
            };

            const index = productos.findIndex(p => String(p.id) === String(idFormulario));
            if (index !== -1) {
                productos[index] = nuevoProducto;
            } else {
                productos.push(nuevoProducto);
            }

            localStorage.setItem("productosAdmin", JSON.stringify(productos));

            // Mostrar toast de éxito
            const toastEl = document.getElementById("toastExito");
            if (toastEl && typeof bootstrap !== 'undefined') {
                const toast = new bootstrap.Toast(toastEl);
                toast.show();
            }

            // Redirigir de regreso al catálogo después de 1.5s
            setTimeout(() => {
                window.location.href = "productos.html";
            }, 1500);
        });
    }
});
