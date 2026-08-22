document.addEventListener("DOMContentLoaded", async function () {
    const form = document.getElementById("producto-form");
    const imageInput = document.getElementById("imagen-producto");
    const imagePreview = document.getElementById("imagen-preview");
    const pageTitle = document.getElementById("pageTitle");
    const formTitle = document.getElementById("formTitle");

    // Revisar si estamos en modo edición por la URL
    const params = new URLSearchParams(window.location.search);
    const editId = params.get("id");

    let base64Image = null;

    if (editId) {
        // MODO EDICIÓN
        pageTitle.textContent = "Editar Producto";
        formTitle.textContent = "Modificar información del producto";
        
        try {
            const response = await fetch(`http://localhost:8080/api/productos/${editId}`);
            if (!response.ok) throw new Error("Producto no encontrado");
            const producto = await response.json();
            
            document.getElementById("id-producto").value = producto.id;
            // Deshabilitar el ID para que no se cambie si es edición
            document.getElementById("id-producto").setAttribute("readonly", true);
            document.getElementById("nombre-producto").value = producto.nombre || "";
            document.getElementById("descripcion-producto").value = producto.descripcion || "";
            document.getElementById("precio").value = producto.precio || "";
            document.getElementById("categoria").value = producto.categoria || "";
            
            // Campos de UI pero que no van al backend (no existen en BD actual)
            const inputOferta = document.getElementById("producto-oferta");
            if (inputOferta) inputOferta.value = "no";
            
            const inputStock = document.getElementById("cantidad-inventario");
            if (inputStock) inputStock.value = producto.stock || "";

            if (producto.imagenUrl && producto.imagenUrl !== "https://via.placeholder.com/150") {
                base64Image = producto.imagenUrl;
                imagePreview.innerHTML = `<img src="${producto.imagenUrl}" alt="Vista previa" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 8px;">`;
            }
        } catch (error) {
            console.error("Error al cargar producto para edición:", error);
            alert("No se pudo cargar el producto desde la base de datos.");
        }
    }

    // Lógica para habilitar/deshabilitar precio de oferta (UI Only)
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
        toggleOferta();
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
        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            if (!form.checkValidity()) {
                e.stopPropagation();
                form.classList.add("was-validated");
                alert("Por favor, llena los campos obligatorios marcados en rojo.");
                return;
            }

            const formData = new FormData(form);
            const stockStr = formData.get("cantidad");
            
            const productoPayload = {
                nombre: formData.get("nombre"),
                descripcion: formData.get("descripcion"),
                precio: Number(formData.get("precio")),
                categoria: formData.get("categoria"),
                stock: stockStr ? parseInt(stockStr, 10) : 0,
                imagenUrl: base64Image || "https://via.placeholder.com/150"
            };

            try {
                let response;
                if (editId) {
                    // PUT /api/productos/{id}
                    response = await fetch(`http://localhost:8080/api/productos/${editId}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(productoPayload)
                    });
                } else {
                    // POST /api/productos
                    response = await fetch(`http://localhost:8080/api/productos`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(productoPayload)
                    });
                }

                if (!response.ok) throw new Error("Error al guardar en base de datos");

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
            } catch (error) {
                console.error("Error al guardar:", error);
                alert("Hubo un error al guardar el producto en el Backend.");
            }
        });
    }
});
