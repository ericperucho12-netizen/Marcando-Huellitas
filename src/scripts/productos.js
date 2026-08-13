document.addEventListener("DOMContentLoaded", function () {
    const adminPanel = document.getElementById("adminPanel");
    const btnToggleAdmin = document.getElementById("btnToggleAdmin");
    const dynamicProductsSection = document.getElementById("dynamicProductsSection");
    const productsList = document.getElementById("productsList");
    const productoForm = document.getElementById("producto-form");

    // Simulador de rol administrador
    const isAdmin = true;

    if (!isAdmin && btnToggleAdmin) {
        btnToggleAdmin.style.display = "none";
    }

    // Toggle de Admin Panel
    if (btnToggleAdmin && adminPanel) {
        btnToggleAdmin.addEventListener("click", () => {
            if (adminPanel.style.display === "none") {
                adminPanel.style.display = "block";
                btnToggleAdmin.textContent = "Cerrar Panel Administrador";
            } else {
                adminPanel.style.display = "none";
                btnToggleAdmin.textContent = "Activar Modo Administrador";
            }
        });
    }

    let productos = JSON.parse(localStorage.getItem("productosAdmin")) || [];

    renderizarProductos();

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
                especie: data.especie,
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
            }

            renderizarProductos();
        });
    }

    function renderizarProductos() {
        if (!productsList) return;
        productsList.innerHTML = "";

        if (productos.length === 0) {
            if (dynamicProductsSection) dynamicProductsSection.style.display = "none";
            return;
        }

        if (dynamicProductsSection) dynamicProductsSection.style.display = "block";

        productos.forEach((producto) => {
            const col = document.createElement("div");
            col.className = "col-12 col-sm-6 col-md-4 col-lg-3";

            col.innerHTML = \
                <div class="product-item-card h-100">
                    <img
                        src="\"
                        class="product-img"
                        alt="\"
                        style="width: 100%; height: 180px; object-fit: cover;"
                    >
                    <span class="title">
                        \
                    </span>
                    <span class="price">
                        \
                    </span>
                    <div class="mt-2 d-flex justify-content-between">
                        <button type="button" class="btn btn-sm btn-outline-primary btn-edit" data-id="\" aria-label="Editar producto">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-danger btn-delete" data-id="\" aria-label="Eliminar producto">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            \;

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
                        imagePreview.innerHTML = \<img src="\" alt="Vista previa">\;
                    }
                }

                if (adminPanel) {
                    adminPanel.style.display = "block";
                    if (btnToggleAdmin) btnToggleAdmin.textContent = "Cerrar Panel Administrador";
                    window.scrollTo({
                        top: adminPanel.offsetTop - 20,
                        behavior: "smooth"
                    });
                }
            });
        });
    }

    function escaparHTML(texto) {
        const elemento = document.createElement("div");
        elemento.textContent = String(texto);
        return elemento.innerHTML;
    }

    function escaparAtributo(texto) {
        return String(texto)
            .replaceAll("&", "&amp;")
            .replaceAll('"', "&quot;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;");
    }
});
