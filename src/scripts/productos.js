document.addEventListener("DOMContentLoaded", function () {
    const dynamicProductsSection = document.getElementById("dynamicProductsSection");
    const productsList = document.getElementById("productsList");
    const emptyStateMsg = document.getElementById("emptyStateMsg");
    const productoForm = document.getElementById("producto-form");
    const adminToggleContainer = document.getElementById("adminToggleContainer");

    // Simulador de rol administrador
    const isAdmin = true;

    if (isAdmin && adminToggleContainer) {
        adminToggleContainer.style.display = "block";
    }

    let productos = JSON.parse(localStorage.getItem("productosAdmin")) || [];
    let currentFilter = "todos"; // todos, perro, gato

    renderizarProductos();

    // Filtros por Pestañas (Tabs)
    const filterTabs = document.querySelectorAll("#productTabs .nav-link");
    filterTabs.forEach(tab => {
        tab.addEventListener("click", function(e) {
            currentFilter = this.getAttribute("data-filter");
            renderizarProductos();
        });
    });

    // Escuchar el evento personalizado emitido por adminForms.js
    if (productoForm) {
        productoForm.addEventListener("formularioValido", function (event) {
            const data = event.detail;
            
            const idFormulario = data.id || Date.now().toString();
            
            const nuevoProducto = {
                id: idFormulario,
                nombre: data.nombre,
                imagen: data.imagenBase64 || "https://via.placeholder.com/150",
                descripcion: data.descripcion,
                precio: Number(data.precio),
                categoria: data.categoria,
                oferta: data.oferta,
                precio_oferta: data.precio_oferta ? Number(data.precio_oferta) : null,
                cantidad: data.cantidad,
                especie: data.especie ? data.especie.toLowerCase() : "todos", // Por defecto
                createdAt: new Date().toISOString().split("T")[0]
            };

            // Revisar si ya existe para editar o agregar nuevo
            const index = productos.findIndex(p => p.id === idFormulario);
            if (index !== -1) {
                productos[index] = nuevoProducto;
            } else {
                productos.push(nuevoProducto);
            }

            localStorage.setItem("productosAdmin", JSON.stringify(productos));
            
            productoForm.reset();
            const imagePreview = document.getElementById("imagen-preview");
            if(imagePreview){
                imagePreview.innerHTML = "Sin imagen";
                imagePreview.style.backgroundImage = "";
            }

            renderizarProductos();

            // Cerrar modal de Bootstrap automáticamente
            const modalEl = document.getElementById('adminModal');
            if (modalEl && typeof bootstrap !== 'undefined') {
                const modal = bootstrap.Modal.getInstance(modalEl);
                if (modal) {
                    modal.hide();
                }
            }
        });
    }

    function renderizarProductos() {
        if (!productsList) return;
        productsList.innerHTML = "";

        // Filtrar productos
        let productosFiltrados = productos;
        if (currentFilter !== "todos") {
            productosFiltrados = productos.filter(p => p.especie.includes(currentFilter));
        }

        if (productosFiltrados.length === 0) {
            if (emptyStateMsg) emptyStateMsg.style.display = "block";
            return;
        }

        if (emptyStateMsg) emptyStateMsg.style.display = "none";

        productosFiltrados.forEach((producto) => {
            const col = document.createElement("div");
            col.className = "col-12 col-sm-6 col-md-4 col-lg-3";

            col.innerHTML = `
                <div class="product-item-card h-100 position-relative shadow-sm" style="border-radius: 12px;">
                    <img
                        src="${escaparAtributo(producto.imagen)}"
                        class="product-img rounded-top"
                        alt="${escaparAtributo(producto.nombre)}"
                        style="width: 100%; height: 180px; object-fit: cover; border-top-left-radius: 12px; border-top-right-radius: 12px;"
                    >
                    <div class="p-3 bg-white rounded-bottom">
                        <span class="d-block title mb-1 text-truncate" style="font-size: 1rem; font-weight: 600;">
                            ${escaparHTML(producto.nombre)}
                        </span>
                        <span class="d-block text-muted small mb-2 text-truncate">
                            ${escaparHTML(producto.categoria || 'Sin categoría')}
                        </span>
                        <span class="price text-success fw-bold">
                            ${formatearPrecio(producto.precio)}
                        </span>
                    </div>

                    <!-- BOTONES ADMIN -->
                    <div class="admin-actions d-flex justify-content-end p-2" style="position: absolute; top: 5px; right: 5px; z-index: 10; display: ${isAdmin ? 'flex' : 'none'} !important;">
                        <button type="button" class="btn btn-sm btn-light btn-edit me-2 shadow-sm rounded-circle" style="width: 35px; height: 35px;" data-id="${escaparAtributo(producto.id)}" aria-label="Editar producto" title="Editar">
                            <i class="bi bi-pencil" style="color: #0aa738;"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-light btn-delete shadow-sm rounded-circle" style="width: 35px; height: 35px;" data-id="${escaparAtributo(producto.id)}" aria-label="Eliminar producto" title="Eliminar">
                            <i class="bi bi-trash" style="color: red;"></i>
                        </button>
                    </div>
                </div>
            `;

            productsList.appendChild(col);
        });

        agregarEventosAcciones();
    }

    function formatearPrecio(precio) {
        return Number(precio).toLocaleString("es-MX", {
            style: "currency",
            currency: "MXN"
        });
    }

    function agregarEventosAcciones() {
        document.querySelectorAll(".btn-delete").forEach((boton) => {
            boton.addEventListener("click", function () {
                const id = this.getAttribute("data-id");
                productos = productos.filter(producto => String(producto.id) !== String(id));
                localStorage.setItem("productosAdmin", JSON.stringify(productos));
                renderizarProductos();
            });
        });

        document.querySelectorAll(".btn-edit").forEach((boton) => {
            boton.addEventListener("click", function () {
                const id = this.getAttribute("data-id");
                const producto = productos.find(p => String(p.id) === String(id));
                if (!producto) return;

                document.getElementById("id-producto").value = producto.id;
                document.getElementById("nombre-producto").value = producto.nombre;
                document.getElementById("descripcion-producto").value = producto.descripcion;
                document.getElementById("precio").value = producto.precio;
                document.getElementById("categoria").value = producto.categoria;
                document.getElementById("producto-oferta").value = producto.oferta || "";
                document.getElementById("precio-oferta").value = producto.precio_oferta || "";
                document.getElementById("cantidad-inventario").value = producto.cantidad || "";
                document.getElementById("especie").value = producto.especie || "";

                if(producto.imagen && producto.imagen !== "https://via.placeholder.com/150"){
                    const imagePreview = document.getElementById("imagen-preview");
                    if(imagePreview){
                        imagePreview.innerHTML = `<img src="${producto.imagen}" alt="Vista previa" style="max-width: 100%; max-height: 100%; object-fit: contain;">`;
                    }
                }

                const modalEl = document.getElementById('adminModal');
                if (modalEl && typeof bootstrap !== 'undefined') {
                    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
                    modal.show();
                }
            });
        });
    }

    function escaparHTML(texto) {
        if (texto == null) return "";
        const elemento = document.createElement("div");
        elemento.textContent = String(texto);
        return elemento.innerHTML;
    }

    function escaparAtributo(texto) {
        if (texto == null) return "";
        return String(texto)
            .replaceAll("&", "&amp;")
            .replaceAll('"', "&quot;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;");
    }
});
